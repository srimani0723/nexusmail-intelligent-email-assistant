import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config/env.js';
import { prisma } from '../db/prisma.js';
import { encrypt, decrypt } from '../utils/encryption.util.js';
import { logger } from '../utils/logger.util.js';

export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
];

export class AuthService {
  private static createOAuth2Client(): OAuth2Client {
    return new google.auth.OAuth2(
      config.GOOGLE_CLIENT_ID,
      config.GOOGLE_CLIENT_SECRET,
      config.GOOGLE_REDIRECT_URI
    );
  }

  /**
   * Generates the Google OAuth 2.0 authorization URL
   */
  static getAuthUrl(): string {
    const oauth2Client = this.createOAuth2Client();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: GMAIL_SCOPES,
      include_granted_scopes: true,
    });
  }

  /**
   * Exchanges authorization code for tokens, fetches user profile, and persists user & connected account.
   */
  static async handleOAuthCallback(code: string): Promise<any> {
    const oauth2Client = this.createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch user profile from Google OAuth2 API
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    if (!profile.id || !profile.email) {
      throw new Error('Incomplete Google profile returned');
    }

    const googleId = profile.id;
    const email = profile.email;
    const name = profile.name || null;
    const avatarUrl = profile.picture || null;

    // Upsert User
    const user = await prisma.user.upsert({
      where: { googleId },
      update: {
        email,
        name,
        avatarUrl,
      },
      create: {
        googleId,
        email,
        name,
        avatarUrl,
      },
    });

    // Encrypt tokens before storing at rest
    const encryptedAccessToken = encrypt(tokens.access_token || '');
    const encryptedRefreshToken = tokens.refresh_token ? encrypt(tokens.refresh_token) : null;
    const tokenExpiry = tokens.expiry_date ? new Date(tokens.expiry_date) : null;

    // Upsert ConnectedAccount
    const existingAccount = await prisma.connectedAccount.findUnique({
      where: {
        userId_provider: {
          userId: user.id,
          provider: 'google',
        },
      },
    });

    if (existingAccount) {
      await prisma.connectedAccount.update({
        where: { id: existingAccount.id },
        data: {
          email,
          providerAccountId: googleId,
          encryptedAccessToken,
          ...(encryptedRefreshToken ? { encryptedRefreshToken } : {}),
          tokenExpiry,
        },
      });
    } else {
      await prisma.connectedAccount.create({
        data: {
          userId: user.id,
          provider: 'google',
          providerAccountId: googleId,
          email,
          encryptedAccessToken,
          encryptedRefreshToken,
          tokenExpiry,
        },
      });
    }

    logger.info(`Google OAuth flow completed successfully for user: ${user.id}`);
    return user;
  }

  /**
   * Retrieves an authenticated OAuth2Client for a user, automatically refreshing tokens if needed.
   */
  static async getAuthenticatedClient(userId: string): Promise<OAuth2Client> {
    const account = await prisma.connectedAccount.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: 'google',
        },
      },
    });

    if (!account) {
      throw new Error('No connected Google account found for user');
    }

    const accessToken = decrypt(account.encryptedAccessToken);
    const refreshToken = account.encryptedRefreshToken
      ? decrypt(account.encryptedRefreshToken)
      : null;

    const oauth2Client = this.createOAuth2Client();
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken || undefined,
      expiry_date: account.tokenExpiry ? account.tokenExpiry.getTime() : undefined,
    });

    // Listen for refreshed tokens and re-persist encrypted to database
    oauth2Client.on('tokens', async (newTokens) => {
      try {
        const updateData: any = {};
        if (newTokens.access_token) {
          updateData.encryptedAccessToken = encrypt(newTokens.access_token);
        }
        if (newTokens.refresh_token) {
          updateData.encryptedRefreshToken = encrypt(newTokens.refresh_token);
        }
        if (newTokens.expiry_date) {
          updateData.tokenExpiry = new Date(newTokens.expiry_date);
        }

        await prisma.connectedAccount.update({
          where: { id: account.id },
          data: updateData,
        });
        logger.info(`Tokens refreshed and updated for user ${userId}`);
      } catch (err: any) {
        logger.error(`Error updating refreshed tokens for user ${userId}`, err);
      }
    });

    return oauth2Client;
  }

  /**
   * Disconnects/removes connected account for a user.
   */
  static async disconnectAccount(userId: string): Promise<void> {
    await prisma.connectedAccount.deleteMany({
      where: { userId },
    });
    logger.info(`Connected account disconnected for user: ${userId}`);
  }
}

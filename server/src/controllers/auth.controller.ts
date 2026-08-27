import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.util.js';

export class AuthController {
  /**
   * Redirects user to Google OAuth consent page
   */
  static getGoogleUrl(req: Request, res: Response): void {
    try {
      const url = AuthService.getAuthUrl();
      res.redirect(url);
    } catch (err: any) {
      logger.error('Failed to generate Google auth URL', err);
      sendError(res, 'AUTH_URL_ERROR', 'Failed to initiate Google authentication', 500);
    }
  }

  /**
   * Google OAuth Callback handler
   */
  static async handleGoogleCallback(req: Request, res: Response): Promise<void> {
    const code = req.query.code as string;
    const error = req.query.error as string;

    if (error) {
      logger.warn(`Google OAuth error: ${error}`);
      res.redirect(`${config.CLIENT_URL}/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (!code) {
      res.redirect(`${config.CLIENT_URL}/login?error=missing_code`);
      return;
    }

    try {
      const user = await AuthService.handleOAuthCallback(code);

      // Create and persist application session
      if (req.session) {
        (req.session as any).userId = user.id;
        await new Promise<void>((resolve, reject) => {
          req.session.save((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }

      res.redirect(`${config.CLIENT_URL}/inbox`);
    } catch (err: any) {
      logger.error('OAuth callback failed', err);
      const errMsg = err?.message || 'auth_failed';
      res.redirect(`${config.CLIENT_URL}/login?error=${encodeURIComponent(errMsg)}`);
    }
  }

  /**
   * Returns currently logged-in user profile
   */
  static async getMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Not authenticated', 401);
      return;
    }
    sendSuccess(res, { user: req.user });
  }

  /**
   * Destroys user session and logs out
   */
  static async logout(req: Request, res: Response): Promise<void> {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          logger.error('Error destroying session during logout', err);
          sendError(res, 'LOGOUT_ERROR', 'Failed to log out cleanly', 500);
          return;
        }
        res.clearCookie('connect.sid');
        sendSuccess(res, { message: 'Logged out successfully' });
      });
    } else {
      sendSuccess(res, { message: 'Logged out successfully' });
    }
  }
}

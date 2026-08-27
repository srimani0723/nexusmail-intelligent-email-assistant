import { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { AuthService } from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { logger } from '../utils/logger.util.js';

export class AccountController {
  /**
   * Returns connected account details (without tokens)
   */
  static async getAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const account = await prisma.connectedAccount.findFirst({
        where: { userId },
        select: {
          id: true,
          provider: true,
          email: true,
          tokenExpiry: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      sendSuccess(res, {
        user: req.user,
        connectedAccount: account || null,
        isConnected: Boolean(account),
      });
    } catch (err: any) {
      logger.error('Error fetching account details', err);
      sendError(res, 'ACCOUNT_FETCH_ERROR', 'Failed to retrieve account details', 500);
    }
  }

  /**
   * Disconnects connected Google account
   */
  static async deleteAccount(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      await AuthService.disconnectAccount(userId);
      sendSuccess(res, { message: 'Google account disconnected successfully' });
    } catch (err: any) {
      logger.error('Error disconnecting account', err);
      sendError(res, 'DISCONNECT_ERROR', 'Failed to disconnect Google account', 500);
    }
  }
}

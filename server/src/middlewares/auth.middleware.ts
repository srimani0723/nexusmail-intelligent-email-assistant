import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util.js';
import { prisma } from '../db/prisma.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  googleId: string;
  name: string | null;
  avatarUrl: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = (req.session as any)?.userId;

    if (!userId) {
      sendError(res, 'UNAUTHORIZED', 'Authentication required. Please log in.', 401);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        googleId: true,
        name: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      if (req.session) {
        req.session.destroy(() => {});
      }
      sendError(res, 'USER_NOT_FOUND', 'User account not found. Please log in again.', 401);
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    sendError(res, 'AUTH_ERROR', 'Failed to authenticate session', 500);
  }
}

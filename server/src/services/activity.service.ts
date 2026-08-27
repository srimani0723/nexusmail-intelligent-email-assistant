import { prisma } from '../db/prisma.js';
import { logger } from '../utils/logger.util.js';

export type ActivityAction =
  | 'EMAIL_VIEWED'
  | 'EMAIL_SUMMARIZED'
  | 'REPLY_GENERATED'
  | 'EMAIL_SENT'
  | 'EMAIL_ARCHIVED'
  | 'EMAIL_DELETED'
  | 'EMAIL_MARKED_READ'
  | 'EMAIL_MARKED_UNREAD'
  | 'EMAIL_STARRED'
  | 'EMAIL_UNSTARRED';

export interface ActivityLogInput {
  userId: string;
  action: ActivityAction;
  emailId?: string;
  metadata?: Record<string, any>;
}

export class ActivityService {
  /**
   * Records a user activity event in the database.
   * Strips any sensitive credentials or tokens.
   */
  static async log(input: ActivityLogInput): Promise<any> {
    try {
      const activity = await prisma.activity.create({
        data: {
          userId: input.userId,
          action: input.action,
          emailId: input.emailId || null,
          metadata: input.metadata || {},
        },
      });
      return activity;
    } catch (err: any) {
      logger.error(`Failed to record activity ${input.action} for user ${input.userId}`, err);
      return null;
    }
  }

  /**
   * Fetches recent activity history for a user.
   */
  static async getUserActivities(userId: string, limit = 50): Promise<any[]> {
    return prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

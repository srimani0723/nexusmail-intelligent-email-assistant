import { Request, Response } from 'express';
import { ActivityService } from '../services/activity.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { logger } from '../utils/logger.util.js';

export class ActivityController {
  /**
   * Retrieves recent activity log for the current authenticated user
   */
  static async getActivity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const limit = parseInt(req.query.limit as string, 10) || 50;

      const activities = await ActivityService.getUserActivities(userId, limit);
      sendSuccess(res, { activities });
    } catch (err: any) {
      logger.error('Error fetching activities', err);
      sendError(res, 'FETCH_ACTIVITY_ERROR', 'Failed to retrieve activity history', 500);
    }
  }
}

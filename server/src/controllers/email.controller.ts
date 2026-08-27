import { Request, Response } from 'express';
import { EmailService } from '../services/email.service.js';
import { GmailService } from '../services/gmail.service.js';
import { ActivityService } from '../services/activity.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { logger } from '../utils/logger.util.js';

export class EmailController {
  /**
   * List emails in inbox or specific folder
   */
  static async getEmails(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const folder = (req.query.folder as any) || 'inbox';
      const category = req.query.category as any;
      const search = req.query.q as string;
      const limit = parseInt(req.query.limit as string, 10) || 50;
      const offset = parseInt(req.query.offset as string, 10) || 0;
      const pageToken = req.query.pageToken as string;
      const sync = req.query.sync === 'true';

      const result = await EmailService.getEmails(userId, {
        folder,
        category,
        search,
        limit,
        offset,
        pageToken,
        syncFromGmail: sync,
      });

      sendSuccess(res, result);
    } catch (err: any) {
      logger.error('Error fetching emails', err);
      sendError(res, 'FETCH_EMAILS_ERROR', err.message || 'Failed to fetch emails', 500);
    }
  }

  /**
   * Search emails
   */
  static async searchEmails(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const query = req.query.q as string;

      if (!query || !query.trim()) {
        sendSuccess(res, { emails: [], total: 0 });
        return;
      }

      const result = await EmailService.getEmails(userId, {
        search: query.trim(),
        limit: 50,
        syncFromGmail: true,
      });

      sendSuccess(res, result);
    } catch (err: any) {
      logger.error('Error searching emails', err);
      sendError(res, 'SEARCH_EMAILS_ERROR', err.message || 'Failed to search emails', 500);
    }
  }

  /**
   * Get single email by ID
   */
  static async getEmailById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;

      const email = await EmailService.getEmailById(userId, id);
      if (!email) {
        sendError(res, 'EMAIL_NOT_FOUND', 'Email not found', 404);
        return;
      }

      sendSuccess(res, email);
    } catch (err: any) {
      logger.error(`Error fetching email ${req.params.id}`, err);
      sendError(res, 'GET_EMAIL_ERROR', err.message || 'Failed to retrieve email', 500);
    }
  }

  /**
   * Get thread messages
   */
  static async getThread(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const threadId = req.params.threadId;

      const thread = await EmailService.getThread(userId, threadId);
      sendSuccess(res, thread);
    } catch (err: any) {
      logger.error(`Error fetching thread ${req.params.threadId}`, err);
      sendError(res, 'GET_THREAD_ERROR', err.message || 'Failed to retrieve thread', 500);
    }
  }

  /**
   * Mark email as read/unread
   */
  static async markRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const { isRead = true } = req.body;

      const updated = await EmailService.setRead(userId, id, isRead);
      sendSuccess(res, updated);
    } catch (err: any) {
      logger.error(`Error marking email ${req.params.id} as read/unread`, err);
      sendError(res, 'UPDATE_READ_ERROR', err.message || 'Failed to update read status', 500);
    }
  }

  /**
   * Star or unstar email
   */
  static async markStar(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const { isStarred = true } = req.body;

      const updated = await EmailService.setStar(userId, id, isStarred);
      sendSuccess(res, updated);
    } catch (err: any) {
      logger.error(`Error starring email ${req.params.id}`, err);
      sendError(res, 'UPDATE_STAR_ERROR', err.message || 'Failed to update star status', 500);
    }
  }

  /**
   * Archive email
   */
  static async archiveEmail(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;

      const updated = await EmailService.archiveEmail(userId, id);
      sendSuccess(res, updated);
    } catch (err: any) {
      logger.error(`Error archiving email ${req.params.id}`, err);
      sendError(res, 'ARCHIVE_ERROR', err.message || 'Failed to archive email', 500);
    }
  }

  /**
   * Delete email
   */
  static async deleteEmail(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;

      await EmailService.deleteEmail(userId, id);
      sendSuccess(res, { message: 'Email deleted successfully' });
    } catch (err: any) {
      logger.error(`Error deleting email ${req.params.id}`, err);
      sendError(res, 'DELETE_ERROR', err.message || 'Failed to delete email', 500);
    }
  }

  /**
   * Send a new email
   */
  static async sendEmail(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { to, cc, bcc, subject, bodyText, bodyHtml } = req.body;

      if (!to || !to.trim()) {
        sendError(res, 'INVALID_RECIPIENT', 'Recipient "to" is required', 400);
        return;
      }

      if (!subject && !bodyText) {
        sendError(res, 'EMPTY_EMAIL', 'Email must have either a subject or body', 400);
        return;
      }

      const sentResult = await GmailService.sendEmail(userId, {
        to: to.trim(),
        cc: cc?.trim(),
        bcc: bcc?.trim(),
        subject: subject?.trim() || '(No Subject)',
        bodyText: bodyText || '',
        bodyHtml,
      });

      // Record activity
      await ActivityService.log({
        userId,
        action: 'EMAIL_SENT',
        metadata: {
          to,
          subject: subject || '(No Subject)',
          gmailMessageId: sentResult.id,
        },
      });

      sendSuccess(res, sentResult, 201);
    } catch (err: any) {
      logger.error('Error sending email', err);
      sendError(res, 'SEND_EMAIL_ERROR', err.message || 'Failed to send email', 500);
    }
  }

  /**
   * Send a reply to an email/thread
   */
  static async sendReply(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const id = req.params.id;
      const { to, cc, bcc, subject, bodyText, bodyHtml } = req.body;

      if (!bodyText || !bodyText.trim()) {
        sendError(res, 'EMPTY_REPLY', 'Reply body cannot be empty', 400);
        return;
      }

      // Check email exists and belongs to user
      const email = await EmailService.getEmailById(userId, id);
      if (!email) {
        sendError(res, 'EMAIL_NOT_FOUND', 'Original email not found', 404);
        return;
      }

      const sentResult = await GmailService.sendReply(userId, email.gmailMessageId, {
        to,
        cc,
        bcc,
        subject,
        bodyText,
        bodyHtml,
      });

      await ActivityService.log({
        userId,
        action: 'EMAIL_SENT',
        emailId: email.id,
        metadata: {
          isReply: true,
          originalSubject: email.subject,
          gmailMessageId: sentResult.id,
        },
      });

      sendSuccess(res, sentResult, 201);
    } catch (err: any) {
      logger.error(`Error sending reply for email ${req.params.id}`, err);
      sendError(res, 'SEND_REPLY_ERROR', err.message || 'Failed to send reply', 500);
    }
  }
}

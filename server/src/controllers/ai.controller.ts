import { Request, Response } from 'express';
import { getAIProvider, EmailContextInput, ReplyTone } from '../services/ai/index.js';
import { EmailService } from '../services/email.service.js';
import { ActivityService } from '../services/activity.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { logger } from '../utils/logger.util.js';

export class AIController {
  /**
   * Summarize an email or thread
   */
  static async summarize(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { emailId, threadId, subject, sender, bodyText } = req.body;

      let emailContext: EmailContextInput;
      let targetEmailId: string | undefined;

      if (emailId) {
        const email = await EmailService.getEmailById(userId, emailId);
        if (!email) {
          sendError(res, 'EMAIL_NOT_FOUND', 'Email not found for summarization', 404);
          return;
        }
        targetEmailId = email.id;
        emailContext = {
          subject: email.subject,
          sender: email.sender,
          bodyText: email.bodyText || email.snippet,
        };
      } else if (threadId) {
        const thread = await EmailService.getThread(userId, threadId);
        if (!thread || thread.messages.length === 0) {
          sendError(res, 'THREAD_NOT_FOUND', 'Thread not found for summarization', 404);
          return;
        }
        const threadText = thread.messages.map((m) => `From ${m.sender} (${m.receivedAt}):\n${m.bodyText}`).join('\n\n---\n\n');
        emailContext = {
          subject: thread.subject,
          sender: thread.messages[0]?.sender || 'Unknown',
          bodyText: thread.messages[thread.messages.length - 1]?.bodyText || '',
          threadContext: threadText,
        };
      } else if (subject && bodyText) {
        emailContext = {
          subject,
          sender: sender || 'Unknown',
          bodyText,
        };
      } else {
        sendError(res, 'INVALID_INPUT', 'Either emailId, threadId, or subject and bodyText must be provided', 400);
        return;
      }

      const aiProvider = getAIProvider();
      const summaryResult = await aiProvider.summarize(emailContext);

      // Record activity
      await ActivityService.log({
        userId,
        action: 'EMAIL_SUMMARIZED',
        emailId: targetEmailId,
        metadata: {
          provider: aiProvider.name,
          subject: emailContext.subject,
          hasDeadline: summaryResult.deadline !== 'No deadline identified.',
        },
      });

      sendSuccess(res, summaryResult);
    } catch (err: any) {
      logger.error('Error during AI summarization', err);
      sendError(res, 'AI_SUMMARIZE_ERROR', err.message || 'Failed to generate AI summary', 500);
    }
  }

  /**
   * Generate an editable reply draft
   */
  static async generateReply(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { emailId, threadId, tone = 'Professional', additionalContext, subject, sender, bodyText } = req.body;

      let emailContext: EmailContextInput;
      let targetEmailId: string | undefined;

      if (emailId) {
        const email = await EmailService.getEmailById(userId, emailId);
        if (!email) {
          sendError(res, 'EMAIL_NOT_FOUND', 'Email not found for generating reply', 404);
          return;
        }
        targetEmailId = email.id;
        emailContext = {
          subject: email.subject,
          sender: email.sender,
          bodyText: email.bodyText || email.snippet,
        };
      } else if (threadId) {
        const thread = await EmailService.getThread(userId, threadId);
        if (!thread || thread.messages.length === 0) {
          sendError(res, 'THREAD_NOT_FOUND', 'Thread not found for generating reply', 404);
          return;
        }
        const threadText = thread.messages.map((m) => `From ${m.sender} (${m.receivedAt}):\n${m.bodyText}`).join('\n\n---\n\n');
        emailContext = {
          subject: thread.subject,
          sender: thread.messages[thread.messages.length - 1]?.sender || 'Unknown',
          bodyText: thread.messages[thread.messages.length - 1]?.bodyText || '',
          threadContext: threadText,
        };
      } else if (subject && bodyText) {
        emailContext = {
          subject,
          sender: sender || 'Unknown',
          bodyText,
        };
      } else {
        sendError(res, 'INVALID_INPUT', 'Either emailId, threadId, or subject and bodyText must be provided', 400);
        return;
      }

      const validTones: ReplyTone[] = ['Professional', 'Friendly', 'Formal', 'Concise'];
      const selectedTone: ReplyTone = validTones.includes(tone) ? tone : 'Professional';

      const aiProvider = getAIProvider();
      const replyResult = await aiProvider.generateReply(emailContext, {
        tone: selectedTone,
        additionalContext,
      });

      // Record activity
      await ActivityService.log({
        userId,
        action: 'REPLY_GENERATED',
        emailId: targetEmailId,
        metadata: {
          provider: aiProvider.name,
          tone: selectedTone,
          subject: emailContext.subject,
        },
      });

      sendSuccess(res, replyResult);
    } catch (err: any) {
      logger.error('Error during AI reply generation', err);
      sendError(res, 'AI_REPLY_ERROR', err.message || 'Failed to generate AI reply', 500);
    }
  }
}

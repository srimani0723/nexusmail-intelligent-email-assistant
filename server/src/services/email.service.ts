import { prisma } from '../db/prisma.js';
import { GmailService, ParsedEmailMessage } from './gmail.service.js';
import { ActivityService } from './activity.service.js';
import { logger } from '../utils/logger.util.js';

export interface GetEmailsFilter {
  folder?: 'inbox' | 'starred' | 'sent' | 'drafts' | 'archive' | 'trash';
  category?: 'primary' | 'promotions' | 'social' | 'updates';
  search?: string;
  limit?: number;
  offset?: number;
  pageToken?: string;
  syncFromGmail?: boolean;
}

export class EmailService {
  /**
   * Syncs and caches an array of parsed messages from Gmail into local database
   */
  static async cacheMessages(userId: string, messages: ParsedEmailMessage[]): Promise<any[]> {
    const results = [];
    for (const msg of messages) {
      try {
        const receivedAt = msg.receivedAt && !isNaN(msg.receivedAt.getTime()) ? msg.receivedAt : new Date();

        // Upsert Email record
        const email = await prisma.email.upsert({
          where: {
            userId_gmailMessageId: {
              userId,
              gmailMessageId: msg.id,
            },
          },
          update: {
            gmailThreadId: msg.threadId || msg.id,
            sender: msg.sender || 'Unknown Sender',
            recipient: msg.recipient || '',
            cc: msg.cc || null,
            bcc: msg.bcc || null,
            subject: msg.subject || '(No Subject)',
            snippet: msg.snippet || '',
            bodyText: msg.bodyText || msg.snippet || '',
            bodyHtml: msg.bodyHtml || null,
            receivedAt,
            isRead: Boolean(msg.isRead),
            isStarred: Boolean(msg.isStarred),
            isArchived: Boolean(msg.isArchived),
            isDeleted: Boolean(msg.isDeleted),
          },
          create: {
            userId,
            gmailMessageId: msg.id,
            gmailThreadId: msg.threadId || msg.id,
            sender: msg.sender || 'Unknown Sender',
            recipient: msg.recipient || '',
            cc: msg.cc || null,
            bcc: msg.bcc || null,
            subject: msg.subject || '(No Subject)',
            snippet: msg.snippet || '',
            bodyText: msg.bodyText || msg.snippet || '',
            bodyHtml: msg.bodyHtml || null,
            receivedAt,
            isRead: Boolean(msg.isRead),
            isStarred: Boolean(msg.isStarred),
            isArchived: Boolean(msg.isArchived),
            isDeleted: Boolean(msg.isDeleted),
          },
        });

        // Upsert Thread record if threadId exists
        if (msg.threadId) {
          try {
            await prisma.emailThread.upsert({
              where: {
                userId_gmailThreadId: {
                  userId,
                  gmailThreadId: msg.threadId,
                },
              },
              update: {
                subject: msg.subject || '(No Subject)',
                lastMessageAt: receivedAt,
              },
              create: {
                userId,
                gmailThreadId: msg.threadId,
                subject: msg.subject || '(No Subject)',
                lastMessageAt: receivedAt,
              },
            });
          } catch (threadErr: any) {
            logger.debug(`Could not update thread for ${msg.threadId}: ${threadErr.message}`);
          }
        }

        results.push(email);
      } catch (err: any) {
        logger.error(`Error caching email ${msg.id} for user ${userId}`, err);
      }
    }
    logger.info(`Cached ${results.length} of ${messages.length} messages in database for user ${userId}`);
    return results;
  }

  /**
   * Retrieves emails for a user with folder & category filtering, search query, and pagination tokens.
   * Gmail API is the source of truth, with local database fallback and background caching.
   */
  static async getEmails(
    userId: string,
    filter: GetEmailsFilter = {}
  ): Promise<{ emails: any[]; total: number; nextPageToken?: string | null; resultSizeEstimate?: number }> {
    const { folder = 'inbox', category, search, limit = 50, offset = 0, pageToken } = filter;

    let gmailLabelIds: string[] | undefined;
    let query = search ? search.trim() : '';

    switch (folder) {
      case 'inbox':
        gmailLabelIds = ['INBOX'];
        if (category === 'promotions') {
          query = query ? `${query} in:inbox category:promotions` : 'in:inbox category:promotions';
        } else if (category === 'social') {
          query = query ? `${query} in:inbox category:social` : 'in:inbox category:social';
        } else if (category === 'updates') {
          query = query ? `${query} in:inbox category:updates` : 'in:inbox category:updates';
        } else if (category === 'primary') {
          query = query
            ? `${query} in:inbox (category:primary OR category:personal OR -category:{promotions,social,updates,forums})`
            : 'in:inbox (category:primary OR category:personal OR -category:{promotions,social,updates,forums})';
        } else {
          query = query ? `${query} in:inbox` : 'in:inbox';
        }
        break;
      case 'starred':
        gmailLabelIds = ['STARRED'];
        query = query ? `${query} is:starred` : 'is:starred';
        break;
      case 'sent':
        gmailLabelIds = ['SENT'];
        query = query ? `${query} in:sent` : 'in:sent';
        break;
      case 'drafts':
        gmailLabelIds = ['DRAFT'];
        query = query ? `${query} in:draft` : 'in:draft';
        break;
      case 'trash':
        gmailLabelIds = ['TRASH'];
        query = query ? `${query} in:trash` : 'in:trash';
        break;
      case 'archive':
        query = query ? `${query} -in:inbox -in:trash -in:spam -in:draft` : '-in:inbox -in:trash -in:spam -in:draft';
        break;
    }

    // 1. Fetch live from Gmail API (Source of Truth)
    try {
      const gmailResult = await GmailService.listMessages(userId, {
        query: query || undefined,
        labelIds: category ? undefined : gmailLabelIds, // When category search is active, rely on query string
        maxResults: limit,
        pageToken,
      });

      if (gmailResult.messages && gmailResult.messages.length > 0) {
        // Cache in database asynchronously
        this.cacheMessages(userId, gmailResult.messages).catch((err) =>
          logger.warn(`Background caching error: ${err.message}`)
        );

        return {
          emails: gmailResult.messages,
          total: gmailResult.resultSizeEstimate || gmailResult.messages.length,
          nextPageToken: gmailResult.nextPageToken || null,
          resultSizeEstimate: gmailResult.resultSizeEstimate,
        };
      }

      // If Gmail returns empty list for this specific folder/category, return empty array
      if (gmailResult.messages && gmailResult.messages.length === 0) {
        return {
          emails: [],
          total: 0,
          nextPageToken: null,
          resultSizeEstimate: 0,
        };
      }
    } catch (err: any) {
      logger.warn(`Gmail API fetch failed, falling back to local DB cache for user ${userId}: ${err.message}`);
    }

    // 2. Database Fallback (if Gmail API was unreachable or offline)
    const whereClause: any = {
      userId,
      isDeleted: folder === 'trash',
    };

    if (folder === 'inbox') {
      whereClause.isArchived = false;
      whereClause.isDeleted = false;
    } else if (folder === 'starred') {
      whereClause.isStarred = true;
      whereClause.isDeleted = false;
    } else if (folder === 'archive') {
      whereClause.isArchived = true;
      whereClause.isDeleted = false;
    }

    if (search) {
      whereClause.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { sender: { contains: search, mode: 'insensitive' } },
        { snippet: { contains: search, mode: 'insensitive' } },
        { bodyText: { contains: search, mode: 'insensitive' } },
      ];
    }

    let emails: any[] = [];
    let total = 0;

    try {
      emails = await prisma.email.findMany({
        where: whereClause,
        orderBy: { receivedAt: 'desc' },
        take: limit,
        skip: offset,
      });

      total = await prisma.email.count({ where: whereClause });
    } catch (dbErr: any) {
      logger.error('Error querying emails from database fallback', dbErr);
    }

    return { emails, total, nextPageToken: null };
  }

  /**
   * Retrieves single email by ID or Gmail Message ID, verifying user ownership.
   */
  static async getEmailById(userId: string, emailIdOrGmailId: string): Promise<any> {
    // 1. Fetch directly from Gmail API (Source of Truth)
    try {
      const parsed = await GmailService.getMessage(userId, emailIdOrGmailId);
      if (parsed) {
        this.cacheMessages(userId, [parsed]).catch((err) =>
          logger.warn(`Background caching error: ${err.message}`)
        );

        // Log activity
        await ActivityService.log({
          userId,
          action: 'EMAIL_VIEWED',
          emailId: parsed.id,
          metadata: { subject: parsed.subject, sender: parsed.sender },
        });

        return parsed;
      }
    } catch (err: any) {
      logger.warn(`Failed to fetch message ${emailIdOrGmailId} from Gmail: ${err.message}`);
    }

    // 2. Database Fallback
    const email = await prisma.email.findFirst({
      where: {
        userId,
        OR: [{ id: emailIdOrGmailId }, { gmailMessageId: emailIdOrGmailId }],
      },
    });

    if (email) {
      await ActivityService.log({
        userId,
        action: 'EMAIL_VIEWED',
        emailId: email.id,
        metadata: { subject: email.subject, sender: email.sender },
      });
    }

    return email;
  }

  /**
   * Retrieves all messages in a thread, verifying user ownership.
   */
  static async getThread(userId: string, threadId: string): Promise<{ id: string; subject: string; messages: any[] }> {
    try {
      const gmailThread = await GmailService.getThread(userId, threadId);
      if (gmailThread.messages.length > 0) {
        this.cacheMessages(userId, gmailThread.messages).catch((err) =>
          logger.warn(`Background caching error: ${err.message}`)
        );

        return {
          id: gmailThread.id,
          subject: gmailThread.messages[0]?.subject || 'Email Thread',
          messages: gmailThread.messages,
        };
      }
    } catch (err: any) {
      logger.warn(`Could not fetch thread ${threadId} from Gmail API: ${err.message}`);
    }

    const messages = await prisma.email.findMany({
      where: {
        userId,
        gmailThreadId: threadId,
      },
      orderBy: { receivedAt: 'asc' },
    });

    return {
      id: threadId,
      subject: messages[0]?.subject || 'Email Thread',
      messages,
    };
  }

  /**
   * Marks email as read or unread
   */
  static async setRead(userId: string, emailId: string, read: boolean): Promise<any> {
    const email = await this.getEmailById(userId, emailId);
    if (!email) throw new Error('Email not found');

    const updatedGmail = await GmailService.markRead(userId, email.gmailMessageId || email.id, read);

    try {
      await prisma.email.updateMany({
        where: { userId, gmailMessageId: email.gmailMessageId || email.id },
        data: { isRead: read },
      });
    } catch (err: any) {
      logger.warn(`Database update error on read/unread: ${err.message}`);
    }

    await ActivityService.log({
      userId,
      action: read ? 'EMAIL_MARKED_READ' : 'EMAIL_MARKED_UNREAD',
      emailId: email.id,
      metadata: { subject: email.subject },
    });

    return updatedGmail || email;
  }

  /**
   * Stars or unstars an email
   */
  static async setStar(userId: string, emailId: string, star: boolean): Promise<any> {
    const email = await this.getEmailById(userId, emailId);
    if (!email) throw new Error('Email not found');

    const updatedGmail = await GmailService.starMessage(userId, email.gmailMessageId || email.id, star);

    try {
      await prisma.email.updateMany({
        where: { userId, gmailMessageId: email.gmailMessageId || email.id },
        data: { isStarred: star },
      });
    } catch (err: any) {
      logger.warn(`Database update error on star: ${err.message}`);
    }

    await ActivityService.log({
      userId,
      action: star ? 'EMAIL_STARRED' : 'EMAIL_UNSTARRED',
      emailId: email.id,
      metadata: { subject: email.subject },
    });

    return updatedGmail || email;
  }

  /**
   * Archives an email
   */
  static async archiveEmail(userId: string, emailId: string): Promise<any> {
    const email = await this.getEmailById(userId, emailId);
    if (!email) throw new Error('Email not found');

    const updatedGmail = await GmailService.archiveMessage(userId, email.gmailMessageId || email.id);

    try {
      await prisma.email.updateMany({
        where: { userId, gmailMessageId: email.gmailMessageId || email.id },
        data: { isArchived: true },
      });
    } catch (err: any) {
      logger.warn(`Database update error on archive: ${err.message}`);
    }

    await ActivityService.log({
      userId,
      action: 'EMAIL_ARCHIVED',
      emailId: email.id,
      metadata: { subject: email.subject },
    });

    return updatedGmail || email;
  }

  /**
   * Deletes an email (moves to trash)
   */
  static async deleteEmail(userId: string, emailId: string): Promise<void> {
    const email = await this.getEmailById(userId, emailId);
    if (!email) throw new Error('Email not found');

    await GmailService.deleteMessage(userId, email.gmailMessageId || email.id);

    try {
      await prisma.email.updateMany({
        where: { userId, gmailMessageId: email.gmailMessageId || email.id },
        data: { isDeleted: true },
      });
    } catch (err: any) {
      logger.warn(`Database update error on delete: ${err.message}`);
    }

    await ActivityService.log({
      userId,
      action: 'EMAIL_DELETED',
      emailId: email.id,
      metadata: { subject: email.subject },
    });
  }
}

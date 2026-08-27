import { google, gmail_v1 } from 'googleapis';
import { AuthService } from './auth.service.js';
import { logger } from '../utils/logger.util.js';

export interface ParsedEmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  sender: string;
  recipient: string;
  cc?: string;
  bcc?: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  receivedAt: Date;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isDeleted: boolean;
}

export class GmailService {
  private static async getGmailClient(userId: string): Promise<gmail_v1.Gmail> {
    const auth = await AuthService.getAuthenticatedClient(userId);
    return google.gmail({ version: 'v1', auth });
  }

  /**
   * Helper to decode Base64Url strings from Gmail payload safely
   */
  private static decodeBase64Url(data: string): string {
    if (!data) return '';
    try {
      const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
      return Buffer.from(base64, 'base64').toString('utf-8');
    } catch (err) {
      return '';
    }
  }

  /**
   * Extracts text and HTML bodies from recursive Gmail payload parts
   */
  private static extractBodyParts(payload: gmail_v1.Schema$MessagePart): { text: string; html: string } {
    let text = '';
    let html = '';

    if (!payload) return { text, html };

    if (payload.mimeType === 'text/plain' && payload.body?.data) {
      text += this.decodeBase64Url(payload.body.data);
    } else if (payload.mimeType === 'text/html' && payload.body?.data) {
      html += this.decodeBase64Url(payload.body.data);
    }

    if (payload.parts && payload.parts.length > 0) {
      for (const part of payload.parts) {
        const extracted = this.extractBodyParts(part);
        if (extracted.text) text += (text ? '\n' : '') + extracted.text;
        if (extracted.html) html += (html ? '<br/>' : '') + extracted.html;
      }
    }

    return { text, html };
  }

  /**
   * Parses raw Gmail message object into application structure with bulletproof date parsing
   */
  public static parseMessage(message: gmail_v1.Schema$Message): ParsedEmailMessage {
    const headers = message.payload?.headers || [];
    const getHeader = (name: string): string => {
      const h = headers.find((header) => header.name?.toLowerCase() === name.toLowerCase());
      return h?.value || '';
    };

    const sender = getHeader('From') || 'Unknown Sender';
    const recipient = getHeader('To') || '';
    const cc = getHeader('Cc') || undefined;
    const bcc = getHeader('Bcc') || undefined;
    const subject = getHeader('Subject') || '(No Subject)';
    
    // Robust date parsing (handles RFC 2822, custom headers, and internalDate timestamp)
    let receivedAt: Date;
    const dateHeader = getHeader('Date');
    if (dateHeader) {
      receivedAt = new Date(dateHeader);
      if (isNaN(receivedAt.getTime()) && message.internalDate) {
        receivedAt = new Date(parseInt(message.internalDate, 10));
      }
    } else if (message.internalDate) {
      receivedAt = new Date(parseInt(message.internalDate, 10));
    } else {
      receivedAt = new Date();
    }

    if (isNaN(receivedAt.getTime())) {
      receivedAt = new Date();
    }

    const labelIds = message.labelIds || [];
    const isRead = !labelIds.includes('UNREAD');
    const isStarred = labelIds.includes('STARRED');
    const isArchived = !labelIds.includes('INBOX') && !labelIds.includes('TRASH') && !labelIds.includes('SPAM');
    const isDeleted = labelIds.includes('TRASH');

    const { text, html } = this.extractBodyParts(message.payload || {});

    return {
      id: message.id || '',
      threadId: message.threadId || message.id || '',
      labelIds,
      snippet: message.snippet || '',
      sender,
      recipient,
      cc,
      bcc,
      subject,
      bodyText: text || message.snippet || '(No content)',
      bodyHtml: html || (text ? `<p>${text.replace(/\n/g, '<br/>')}</p>` : `<p>${message.snippet || ''}</p>`),
      receivedAt,
      isRead,
      isStarred,
      isArchived,
      isDeleted,
    };
  }

  /**
   * Lists messages with optional query, labelIds, pageToken, and maxResults
   */
  static async listMessages(
    userId: string,
    options: {
      query?: string;
      labelIds?: string[];
      maxResults?: number;
      pageToken?: string;
    } = {}
  ): Promise<{ messages: ParsedEmailMessage[]; nextPageToken?: string | null; resultSizeEstimate?: number }> {
    const gmail = await this.getGmailClient(userId);
    const { query, labelIds, maxResults = 35, pageToken } = options;

    logger.info(`Fetching messages from Gmail API for user ${userId}`, { query, labelIds, maxResults });

    const listParams: gmail_v1.Params$Resource$Users$Messages$List = {
      userId: 'me',
      maxResults,
      pageToken,
    };

    if (query) {
      listParams.q = query;
    }
    if (labelIds && labelIds.length > 0) {
      listParams.labelIds = labelIds;
    }

    const res = await gmail.users.messages.list(listParams);

    const messageList = res.data.messages || [];
    logger.info(`Gmail API returned ${messageList.length} message headers for user ${userId}`);

    if (messageList.length === 0) {
      return {
        messages: [],
        nextPageToken: res.data.nextPageToken,
        resultSizeEstimate: res.data.resultSizeEstimate || 0,
      };
    }

    // Fetch full message details in parallel with concurrency
    const detailedMessages = await Promise.all(
      messageList.map(async (item) => {
        try {
          const detail = await gmail.users.messages.get({
            userId: 'me',
            id: item.id!,
            format: 'full',
          });
          return this.parseMessage(detail.data);
        } catch (err: any) {
          logger.warn(`Failed to fetch message detail for id ${item.id}`, err.message);
          return null;
        }
      })
    );

    const validMessages = detailedMessages.filter((m): m is ParsedEmailMessage => m !== null);
    logger.info(`Successfully parsed ${validMessages.length} full emails for user ${userId}`);

    return {
      messages: validMessages,
      nextPageToken: res.data.nextPageToken,
      resultSizeEstimate: res.data.resultSizeEstimate || validMessages.length,
    };
  }

  /**
   * Retrieves single email message by Gmail Message ID
   */
  static async getMessage(userId: string, messageId: string): Promise<ParsedEmailMessage> {
    const gmail = await this.getGmailClient(userId);
    const res = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });
    return this.parseMessage(res.data);
  }

  /**
   * Retrieves an entire thread with all its messages
   */
  static async getThread(userId: string, threadId: string): Promise<{ id: string; messages: ParsedEmailMessage[] }> {
    const gmail = await this.getGmailClient(userId);
    const res = await gmail.users.threads.get({
      userId: 'me',
      id: threadId,
      format: 'full',
    });

    const messages = (res.data.messages || []).map((m) => this.parseMessage(m));
    return {
      id: res.data.id || threadId,
      messages,
    };
  }

  /**
   * Modifies message labels (e.g. read/unread, star/unstar, archive)
   */
  static async modifyLabels(
    userId: string,
    messageId: string,
    addLabelIds: string[] = [],
    removeLabelIds: string[] = []
  ): Promise<ParsedEmailMessage> {
    const gmail = await this.getGmailClient(userId);
    const res = await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        addLabelIds,
        removeLabelIds,
      },
    });
    return this.parseMessage(res.data);
  }

  /**
   * Marks an email as read or unread
   */
  static async markRead(userId: string, messageId: string, read: boolean): Promise<ParsedEmailMessage> {
    if (read) {
      return this.modifyLabels(userId, messageId, [], ['UNREAD']);
    } else {
      return this.modifyLabels(userId, messageId, ['UNREAD'], []);
    }
  }

  /**
   * Stars or unstars an email
   */
  static async starMessage(userId: string, messageId: string, star: boolean): Promise<ParsedEmailMessage> {
    if (star) {
      return this.modifyLabels(userId, messageId, ['STARRED'], []);
    } else {
      return this.modifyLabels(userId, messageId, [], ['STARRED']);
    }
  }

  /**
   * Archives an email (removes INBOX label)
   */
  static async archiveMessage(userId: string, messageId: string): Promise<ParsedEmailMessage> {
    return this.modifyLabels(userId, messageId, [], ['INBOX']);
  }

  /**
   * Moves an email to trash / deletes it
   */
  static async deleteMessage(userId: string, messageId: string): Promise<void> {
    const gmail = await this.getGmailClient(userId);
    await gmail.users.messages.trash({
      userId: 'me',
      id: messageId,
    });
    logger.info(`Message ${messageId} moved to trash for user ${userId}`);
  }

  /**
   * Creates an RFC 2822 MIME email string and encodes it as base64url
   */
  private static createMimeMessage(options: {
    from: string;
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string;
    inReplyTo?: string;
    references?: string;
    threadId?: string;
  }): string {
    const boundary = `__boundary_${Date.now()}__`;
    const lines: string[] = [];

    lines.push(`From: ${options.from}`);
    lines.push(`To: ${options.to}`);
    if (options.cc) lines.push(`Cc: ${options.cc}`);
    if (options.bcc) lines.push(`Bcc: ${options.bcc}`);
    lines.push(`Subject: =?utf-8?B?${Buffer.from(options.subject, 'utf-8').toString('base64')}?=`);
    lines.push('MIME-Version: 1.0');

    if (options.inReplyTo) {
      lines.push(`In-Reply-To: ${options.inReplyTo}`);
    }
    if (options.references) {
      lines.push(`References: ${options.references}`);
    }

    if (options.bodyHtml) {
      lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
      lines.push('');
      lines.push(`--${boundary}`);
      lines.push('Content-Type: text/plain; charset="UTF-8"');
      lines.push('Content-Transfer-Encoding: 7bit');
      lines.push('');
      lines.push(options.bodyText);
      lines.push('');
      lines.push(`--${boundary}`);
      lines.push('Content-Type: text/html; charset="UTF-8"');
      lines.push('Content-Transfer-Encoding: 7bit');
      lines.push('');
      lines.push(options.bodyHtml);
      lines.push('');
      lines.push(`--${boundary}--`);
    } else {
      lines.push('Content-Type: text/plain; charset="UTF-8"');
      lines.push('Content-Transfer-Encoding: 7bit');
      lines.push('');
      lines.push(options.bodyText);
    }

    const raw = lines.join('\r\n');
    return Buffer.from(raw)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Sends a new email message through Gmail API
   */
  static async sendEmail(
    userId: string,
    options: {
      to: string;
      cc?: string;
      bcc?: string;
      subject: string;
      bodyText: string;
      bodyHtml?: string;
      threadId?: string;
    }
  ): Promise<{ id: string; threadId: string }> {
    const gmail = await this.getGmailClient(userId);

    // Get user profile to use authenticated email as sender
    const profile = await gmail.users.getProfile({ userId: 'me' });
    const from = profile.data.emailAddress || 'me';

    const raw = this.createMimeMessage({
      from,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      bodyText: options.bodyText,
      bodyHtml: options.bodyHtml,
      threadId: options.threadId,
    });

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
        threadId: options.threadId,
      },
    });

    logger.info(`Email sent successfully via Gmail API with id ${res.data.id} for user ${userId}`);
    return {
      id: res.data.id || '',
      threadId: res.data.threadId || '',
    };
  }

  /**
   * Sends a reply to an existing email message/thread
   */
  static async sendReply(
    userId: string,
    messageId: string,
    options: {
      to?: string;
      cc?: string;
      bcc?: string;
      subject?: string;
      bodyText: string;
      bodyHtml?: string;
    }
  ): Promise<{ id: string; threadId: string }> {
    const gmail = await this.getGmailClient(userId);
    const original = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });

    const headers = original.data.payload?.headers || [];
    const getHeader = (name: string): string => {
      const h = headers.find((header) => header.name?.toLowerCase() === name.toLowerCase());
      return h?.value || '';
    };

    const msgIdHeader = getHeader('Message-ID') || getHeader('Message-Id');
    const origSubject = getHeader('Subject') || '';
    const origFrom = getHeader('From') || '';
    const replyToHeader = getHeader('Reply-To') || origFrom;

    const to = options.to || replyToHeader;
    const subject = options.subject || (origSubject.toLowerCase().startsWith('re:') ? origSubject : `Re: ${origSubject}`);

    const profile = await gmail.users.getProfile({ userId: 'me' });
    const from = profile.data.emailAddress || 'me';

    const raw = this.createMimeMessage({
      from,
      to,
      cc: options.cc,
      bcc: options.bcc,
      subject,
      bodyText: options.bodyText,
      bodyHtml: options.bodyHtml,
      inReplyTo: msgIdHeader,
      references: msgIdHeader,
      threadId: original.data.threadId || undefined,
    });

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
        threadId: original.data.threadId || undefined,
      },
    });

    logger.info(`Reply sent successfully for message ${messageId} by user ${userId}`);
    return {
      id: res.data.id || '',
      threadId: res.data.threadId || '',
    };
  }
}

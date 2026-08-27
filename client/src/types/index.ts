export interface User {
  id: string;
  email: string;
  googleId: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface ConnectedAccount {
  id: string;
  provider: string;
  email: string;
  tokenExpiry: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Email {
  id: string;
  userId: string;
  gmailMessageId: string;
  gmailThreadId: string;
  threadId?: string;
  sender: string;
  recipient: string;
  cc?: string | null;
  bcc?: string | null;
  subject: string;
  snippet: string;
  bodyText: string;
  bodyHtml?: string | null;
  receivedAt: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailThread {
  id: string;
  subject: string;
  messages: Email[];
}

export interface Activity {
  id: string;
  userId: string;
  action:
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
  emailId?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface EmailSummary {
  summary: string;
  keyPoints: string[];
  actionRequired: string;
  deadline: string;
}

export type AiSummaryResponse = EmailSummary;

export type ReplyTone = 'Professional' | 'Friendly' | 'Formal' | 'Concise';

export interface EmailReplyDraft {
  replyText: string;
  draft: string;
  subject: string;
  suggestedTo?: string;
  tone: ReplyTone;
  isAiGenerated: true;
}

export interface SendEmailPayload {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
}

export interface SendReplyPayload {
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  bodyText: string;
  bodyHtml?: string;
}

export interface GetEmailsResponse {
  emails: Email[];
  total: number;
  nextPageToken?: string | null;
  resultSizeEstimate?: number;
}

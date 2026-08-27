export interface EmailSummaryResult {
  summary: string;
  keyPoints: string[];
  actionRequired: string;
  deadline: string;
}

export type ReplyTone = 'Professional' | 'Friendly' | 'Formal' | 'Concise';

export interface EmailReplyOptions {
  tone?: ReplyTone;
  additionalContext?: string;
}

export interface EmailReplyResult {
  replyText: string;
  subject: string;
  suggestedTo?: string;
  tone: ReplyTone;
  isAiGenerated: true;
}

export interface EmailContextInput {
  subject: string;
  sender: string;
  bodyText: string;
  threadContext?: string;
}

export interface AIProvider {
  name: string;
  summarize(email: EmailContextInput): Promise<EmailSummaryResult>;
  generateReply(email: EmailContextInput, options?: EmailReplyOptions): Promise<EmailReplyResult>;
}

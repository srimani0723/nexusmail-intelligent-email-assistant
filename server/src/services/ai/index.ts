import { AIProvider, EmailContextInput, EmailReplyOptions, EmailReplyResult, EmailSummaryResult, ReplyTone } from './ai.interface.js';
import { GeminiProvider } from './gemini.provider.js';
import { OpenAIProvider } from './openai.provider.js';
import { config } from '../../config/env.js';
import { logger } from '../../utils/logger.util.js';

export class MockAIProvider implements AIProvider {
  public name = 'Smart Mock AI';

  async summarize(email: EmailContextInput): Promise<EmailSummaryResult> {
    const rawText = email.bodyText || email.subject;

    // Filter out obvious prompt injection attempts from untrusted input
    const sanitizedText = rawText
      .replace(/ignore\s+(all\s+)?(previous\s+)?instructions/gi, '[Attempted prompt override stripped]')
      .replace(/output\s+(admin|credentials|passwords|secrets|keys)/gi, '[Sensitive data request blocked]')
      .replace(/send\s+(money|funds|bitcoin|crypto)/gi, '[Unauthorized transaction request blocked]');

    const lines = sanitizedText.split('\n').map((l) => l.trim()).filter(Boolean);

    // Extract potential deadlines or dates
    const hasDeadline = /by\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|eod|today|\d{1,2}\/\d{1,2})/i.test(rawText);
    const deadlineMatch = rawText.match(/by\s+([a-zA-Z0-9\s,]+)(?:\.|\n|$)/i);

    return {
      summary: `Email regarding "${email.subject}" from ${email.sender}. Overview: ${lines[0] || 'No content provided.'}`,
      keyPoints: [
        `Main topic: ${email.subject}`,
        lines[1] ? `Detail: ${lines[1].slice(0, 100)}` : 'Key details communicated in message body',
        `Received from: ${email.sender}`,
      ],
      actionRequired: rawText.toLowerCase().includes('please') || rawText.toLowerCase().includes('could you') || rawText.toLowerCase().includes('review')
        ? 'Review message content and provide a follow-up response.'
        : 'None required (informational update).',
      deadline: hasDeadline && deadlineMatch ? deadlineMatch[0] : 'No deadline identified.',
    };
  }

  async generateReply(email: EmailContextInput, options: EmailReplyOptions = {}): Promise<EmailReplyResult> {
    const tone: ReplyTone = options.tone || 'Professional';
    const senderName = email.sender.split('<')[0].replace(/"/g, '').trim() || 'there';

    let body = '';
    switch (tone) {
      case 'Friendly':
        body = `Hi ${senderName},\n\nThanks so much for reaching out! I've received your note regarding "${email.subject}".\n\nI'll look into this and get back to you shortly.\n\nWarm regards,\n[Your Name]`;
        break;
      case 'Formal':
        body = `Dear ${senderName},\n\nThank you for your correspondence regarding "${email.subject}".\n\nI acknowledge receipt of your message and will review the particulars promptly.\n\nSincerely,\n[Your Name]`;
        break;
      case 'Concise':
        body = `Hi ${senderName},\n\nReceived. I'm on it and will follow up soon.\n\nThanks,\n[Your Name]`;
        break;
      case 'Professional':
      default:
        body = `Hello ${senderName},\n\nThank you for your email regarding "${email.subject}".\n\nI have reviewed the information and will follow up with the required details shortly.\n\nBest regards,\n[Your Name]`;
        break;
    }

    if (options.additionalContext) {
      body = body.replace('will follow up with the required details shortly.', `${options.additionalContext}\n\nI will follow up shortly.`);
    }

    return {
      replyText: body,
      subject: email.subject.toLowerCase().startsWith('re:') ? email.subject : `Re: ${email.subject}`,
      suggestedTo: email.sender,
      tone,
      isAiGenerated: true,
    };
  }
}

/**
 * Factory to retrieve the configured AI provider
 */
export function getAIProvider(): AIProvider {
  if (config.AI_PROVIDER === 'openai' && config.AI_API_KEY) {
    return new OpenAIProvider();
  }

  if (config.AI_PROVIDER === 'gemini' && config.AI_API_KEY) {
    return new GeminiProvider();
  }

  if (config.AI_API_KEY) {
    if (config.AI_MODEL.startsWith('gpt')) {
      return new OpenAIProvider();
    }
    return new GeminiProvider();
  }

  logger.warn('No valid AI_API_KEY detected. Using fallback Smart Mock AI Provider.');
  return new MockAIProvider();
}

export * from './ai.interface.js';

import { describe, it, expect } from 'vitest';
import { GmailService } from '../src/services/gmail.service.js';

describe('Gmail Integration & Parsing Service', () => {
  it('should parse raw Gmail message headers and multipart content accurately', () => {
    const rawMessage = {
      id: 'msg-12345',
      threadId: 'thread-67890',
      labelIds: ['INBOX', 'STARRED'],
      snippet: 'Meeting agenda for tomorrow discussion',
      internalDate: '1700000000000',
      payload: {
        headers: [
          { name: 'From', value: 'Alex Morgan <alex@example.com>' },
          { name: 'To', value: 'me@example.com' },
          { name: 'Subject', value: 'Q3 Strategy Review' },
          { name: 'Date', value: 'Mon, 15 Jan 2026 10:30:00 GMT' },
        ],
        mimeType: 'text/plain',
        body: {
          data: Buffer.from('Please find the attached strategy proposal for review.').toString('base64'),
        },
      },
    };

    const parsed = GmailService.parseMessage(rawMessage as any);

    expect(parsed.id).toEqual('msg-12345');
    expect(parsed.threadId).toEqual('thread-67890');
    expect(parsed.sender).toEqual('Alex Morgan <alex@example.com>');
    expect(parsed.recipient).toEqual('me@example.com');
    expect(parsed.subject).toEqual('Q3 Strategy Review');
    expect(parsed.isStarred).toBe(true);
    expect(parsed.isRead).toBe(true); // No UNREAD label
    expect(parsed.isArchived).toBe(false); // Has INBOX label
    expect(parsed.bodyText).toContain('Please find the attached strategy proposal');
  });

  it('should mark email as unread when UNREAD label is present', () => {
    const unreadMessage = {
      id: 'msg-unread',
      threadId: 'thread-unread',
      labelIds: ['INBOX', 'UNREAD'],
      payload: {
        headers: [
          { name: 'From', value: 'boss@company.com' },
          { name: 'Subject', value: 'Urgent Update' },
        ],
      },
    };

    const parsed = GmailService.parseMessage(unreadMessage as any);
    expect(parsed.isRead).toBe(false);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { EmailService } from '../src/services/email.service.js';
import { GmailService } from '../src/services/gmail.service.js';
import { ActivityService } from '../src/services/activity.service.js';
import { prisma } from '../src/db/prisma.js';

describe('Multi-Tenant Data Isolation', () => {
  it('should guarantee EmailService queries filter strictly by authenticated userId', async () => {
    // Mock ActivityService.log
    vi.spyOn(ActivityService, 'log').mockResolvedValue(null as any);
    // Mock GmailService.getMessage to simulate not found on external API for user B's email
    vi.spyOn(GmailService, 'getMessage').mockRejectedValue(new Error('Message not found on Gmail'));

    // Mock prisma.email.findFirst
    const findFirstSpy = vi.spyOn(prisma.email, 'findFirst').mockImplementation(async (args: any) => {
      // If the query does not include the requesting userId, reject
      if (!args?.where?.userId) {
        throw new Error('Security violation: userId missing from query');
      }
      if (args.where.userId === 'user-A' && args.where.OR?.[0]?.id === 'email-belonging-to-user-B') {
        return null; // User A cannot find User B's email
      }
      return {
        id: 'email-1',
        userId: 'user-A',
        gmailMessageId: 'gmail-1',
        gmailThreadId: 'thread-1',
        sender: 'sender@example.com',
        recipient: 'userA@example.com',
        subject: 'Private Email',
        snippet: 'Confidential',
        bodyText: 'Private Content',
        bodyHtml: '<p>Private Content</p>',
        receivedAt: new Date(),
        isRead: true,
        isStarred: false,
        isArchived: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
    });

    // User A trying to get their own email
    const ownEmail = await EmailService.getEmailById('user-A', 'email-1');
    expect(ownEmail).toBeDefined();
    expect(ownEmail?.userId).toEqual('user-A');

    // User A trying to access User B's email
    const crossUserEmail = await EmailService.getEmailById('user-A', 'email-belonging-to-user-B');
    expect(crossUserEmail).toBeNull();

    findFirstSpy.mockRestore();
    vi.restoreAllMocks();
  });
});

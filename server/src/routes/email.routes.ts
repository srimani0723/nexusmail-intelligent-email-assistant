import { Router } from 'express';
import { z } from 'zod';
import { EmailController } from '../controllers/email.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { sendLimiter } from '../middlewares/rateLimiter.middleware.js';

export const emailRouter = Router();

const sendEmailSchema = z.object({
  to: z.string().email('Valid recipient email address is required'),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().optional(),
  bodyText: z.string().min(1, 'Email body is required'),
  bodyHtml: z.string().optional(),
});

const sendReplySchema = z.object({
  to: z.string().optional(),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().optional(),
  bodyText: z.string().min(1, 'Reply body cannot be empty'),
  bodyHtml: z.string().optional(),
});

const updateReadSchema = z.object({
  isRead: z.boolean(),
});

const updateStarSchema = z.object({
  isStarred: z.boolean(),
});

// All email routes require authentication
emailRouter.use(requireAuth);

// GET /api/emails/search?q=
emailRouter.get('/search', EmailController.searchEmails);

// GET /api/emails
emailRouter.get('/', EmailController.getEmails);

// GET /api/emails/:id
emailRouter.get('/:id', EmailController.getEmailById);

// PATCH /api/emails/:id/read
emailRouter.patch('/:id/read', validate({ body: updateReadSchema }), EmailController.markRead);

// PATCH /api/emails/:id/star
emailRouter.patch('/:id/star', validate({ body: updateStarSchema }), EmailController.markStar);

// POST /api/emails/:id/archive
emailRouter.post('/:id/archive', EmailController.archiveEmail);

// DELETE /api/emails/:id
emailRouter.delete('/:id', EmailController.deleteEmail);

// POST /api/emails/send
emailRouter.post('/send', sendLimiter, validate({ body: sendEmailSchema }), EmailController.sendEmail);

// POST /api/emails/:id/reply
emailRouter.post('/:id/reply', sendLimiter, validate({ body: sendReplySchema }), EmailController.sendReply);

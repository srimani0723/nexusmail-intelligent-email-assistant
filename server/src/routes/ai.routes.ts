import { Router } from 'express';
import { z } from 'zod';
import { AIController } from '../controllers/ai.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { aiLimiter } from '../middlewares/rateLimiter.middleware.js';

export const aiRouter = Router();

const summarizeSchema = z.object({
  emailId: z.string().optional(),
  threadId: z.string().optional(),
  subject: z.string().optional(),
  sender: z.string().optional(),
  bodyText: z.string().optional(),
});

const replySchema = z.object({
  emailId: z.string().optional(),
  threadId: z.string().optional(),
  subject: z.string().optional(),
  sender: z.string().optional(),
  bodyText: z.string().optional(),
  tone: z.enum(['Professional', 'Friendly', 'Formal', 'Concise']).optional(),
  additionalContext: z.string().optional(),
});

aiRouter.use(requireAuth);
aiRouter.use(aiLimiter);

// POST /api/ai/summarize
aiRouter.post('/summarize', validate({ body: summarizeSchema }), AIController.summarize);

// POST /api/ai/reply
aiRouter.post('/reply', validate({ body: replySchema }), AIController.generateReply);

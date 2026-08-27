import { Router } from 'express';
import { EmailController } from '../controllers/email.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const threadRouter = Router();

threadRouter.use(requireAuth);

// GET /api/threads/:threadId
threadRouter.get('/:threadId', EmailController.getThread);

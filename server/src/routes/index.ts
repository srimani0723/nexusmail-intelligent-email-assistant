import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { accountRouter } from './account.routes.js';
import { emailRouter } from './email.routes.js';
import { threadRouter } from './thread.routes.js';
import { aiRouter } from './ai.routes.js';
import { activityRouter } from './activity.routes.js';
import { sendSuccess } from '../utils/response.util.js';

export const apiRouter = Router();

// GET /api/health
apiRouter.get('/health', (req, res) => {
  sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Intelligent Email Assistant API',
    uptime: process.uptime(),
  });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/account', accountRouter);
apiRouter.use('/emails', emailRouter);
apiRouter.use('/threads', threadRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/activity', activityRouter);

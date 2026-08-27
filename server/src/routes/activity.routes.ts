import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const activityRouter = Router();

activityRouter.use(requireAuth);

// GET /api/activity
activityRouter.get('/', ActivityController.getActivity);

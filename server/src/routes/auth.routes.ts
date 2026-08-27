import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const authRouter = Router();

// GET /api/auth/google
authRouter.get('/google', AuthController.getGoogleUrl);

// GET /api/auth/google/callback
authRouter.get('/google/callback', AuthController.handleGoogleCallback);

// GET /api/auth/me
authRouter.get('/me', requireAuth, AuthController.getMe);

// POST /api/auth/logout
authRouter.post('/logout', requireAuth, AuthController.logout);

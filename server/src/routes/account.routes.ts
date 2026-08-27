import { Router } from 'express';
import { AccountController } from '../controllers/account.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const accountRouter = Router();

// GET /api/account
accountRouter.get('/', requireAuth, AccountController.getAccount);

// DELETE /api/account
accountRouter.delete('/', requireAuth, AccountController.deleteAccount);

import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util.js';
import { logger } from '../utils/logger.util.js';
import { isDev } from '../config/env.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(`Unhandled error on ${req.method} ${req.path}`, err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const errorMessage = isDev || statusCode < 500
    ? err.message || 'An unexpected error occurred'
    : 'An unexpected internal server error occurred';

  sendError(res, errorCode, errorMessage, statusCode);
}

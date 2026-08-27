import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.util.js';
import { isDev } from '../config/env.js';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: isDev ? ['query', 'info', 'warn', 'error'] : ['error'],
  });

if (isDev) {
  globalThis.prisma = prisma;
}

export async function connectDB(): Promise<boolean> {
  try {
    await prisma.$connect();
    logger.info('Database connection established successfully');
    return true;
  } catch (err: any) {
    logger.error('Failed to connect to database. Please check DATABASE_URL.', err);
    return false;
  }
}

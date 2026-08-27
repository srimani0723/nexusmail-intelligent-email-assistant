import { createApp } from './app.js';
import { config } from './config/env.js';
import { connectDB } from './db/prisma.js';
import { logger } from './utils/logger.util.js';

async function bootstrap() {
  const app = createApp();

  // Attempt database connection
  await connectDB();

  app.listen(config.PORT, () => {
    logger.info(`Intelligent Email Assistant Backend listening on port ${config.PORT}`);
    logger.info(`Environment: ${config.NODE_ENV}`);
    logger.info(`Client URL: ${config.CLIENT_URL}`);
  });
}

bootstrap().catch((err) => {
  logger.error('Fatal error starting server', err);
  process.exit(1);
});

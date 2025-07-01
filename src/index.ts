import type { Server } from 'node:http';
import app from './app';
import { env } from './config';
import { logger } from './config/logger';
import db from './db';

let server: Server;

const startServer = async () => {
  try {
    await db.execute('SELECT 1');
    logger.info('Connected to PostgreSQL');

    server = app.listen(env.port, () => {
      logger.info(`Listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error('Failed to connect to the database', error);
    process.exit(1);
  }
};

startServer();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

const gracefulShutdown = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed gracefully');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.');
  gracefulShutdown();
});

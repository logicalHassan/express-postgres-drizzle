import db from "./db";
import app from "./app";
import { env } from "./config";
import { logger } from "./config/logger";
import { Server } from "http";

let server: Server;

const startServer = async () => {
  try {
    await db.execute("SELECT 1");
    logger.info("Connected to PostgreSQL");

    server = app.listen(env.port, () => {
      logger.info(`Listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

startServer();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: any) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});

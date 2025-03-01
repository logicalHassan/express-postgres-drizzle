import httpStatus from "http-status";
import { env } from "@/config";
import { logger } from "@/config/logger";
import { ApiError } from "@/utils";
import { NextFunction, Request, Response } from "express";

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = (error.statusCode = httpStatus.INTERNAL_SERVER_ERROR);
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;
  if (env.mode === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(env.mode === "development" && { stack: err.stack }),
  };

  if (env.mode === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

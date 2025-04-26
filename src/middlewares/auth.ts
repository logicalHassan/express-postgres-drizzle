import { env } from "@/config";
import { tokenTypes } from "@/config/tokens";
import { ApiError } from "@/utils";
import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

//TODO: Refactore Auth middleware

/**
 * Middleware to authenticate a JWT token and attach the user to the request object.
 */
const authenticateToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "No token provided");
  }

  const payload: any = jwt.verify(token, env.jwt.secret);

  if (payload.type !== tokenTypes.ACCESS) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token type");
  }

  // const user = await User.findById(payload.sub);
  // if (!user) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
  // }

  // req.user = user;
};

/**
 * Authorization middleware that checks if the authenticated user has the required role.
 */
const auth = (requiredRole?: string) => async (req: Request, res: Response, next: NextFunction) => {
  await authenticateToken(req, res);
  // const { role } = req.user;
  // if (requiredRole && role !== requiredRole) {
  //   throw new ApiError(httpStatus.FORBIDDEN, "Access denied, Role not allowed");
  // }
  next();
};

export default auth;

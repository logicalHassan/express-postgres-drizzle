import { env } from '@/config';
import { tokenTypes } from '@/config/tokens';
import userService from '@/services/user.service';
import type { AppJwtPayload, AuthedReq } from '@/types';
import { ApiError } from '@/utils/api-error';
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate a JWT token and attach the user to the request object.
 */
const authenticateToken = async (req: Request): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'No token provided');
  }

  let decoded: AppJwtPayload;

  try {
    decoded = jwt.verify(token, env.jwt.secret) as AppJwtPayload;
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
  }

  if (decoded.type !== tokenTypes.ACCESS) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
  }

  const user = await userService.getUserById(decoded.sub);

  (req as AuthedReq).user = user;
};

/**
 * Authorization middleware that checks if the authenticated user has the required role.
 */
const auth = (requiredRoles?: string[]) => async (req: Request, _res: Response, next: NextFunction) => {
  await authenticateToken(req);
  const { role } = (req as AuthedReq).user;
  if (requiredRoles?.length && !requiredRoles.includes(role)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }
  next();
};

export default auth;

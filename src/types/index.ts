import type { tokens, users } from '@/db/schema';
import type { Request } from 'express';
import type { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

export type UserPayload = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type TokenPayload = typeof tokens.$inferInsert;

export interface PaginateOptions {
  limit?: string;
  page?: string;
  sortBy?: string;
  populate?: string;
}

export interface PaginateResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface AppJwtPayload extends BaseJwtPayload {
  sub: string;
  type: string;
}

export interface AuthedReq extends Request {
  user: User;
}

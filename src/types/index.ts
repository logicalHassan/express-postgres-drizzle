import type { rolesAllowed } from '@/config';
import type { tokens, users } from '@/db/schema';
import type { SQL } from 'drizzle-orm';
import type { Request } from 'express';
import type { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

export type UserRole = (typeof rolesAllowed)[number];

export type UserPayload = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type TokenPayload = typeof tokens.$inferInsert;

export interface PaginationOptions {
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: string;
}

export interface PaginatedResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface PaginateParams<TTable> {
  table: TTable;
  filters?: SQL[];
  options?: PaginationOptions;
}

export interface AppJwtPayload extends BaseJwtPayload {
  sub: string;
  type: string;
}

export type SafeUser = Omit<User, 'password'>;

export interface AuthedReq extends Request {
  user: SafeUser;
}

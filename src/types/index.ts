import type { rolesAllowed } from '@/config';
import type { tokens, users } from '@/db/schema';
import type { Request } from 'express';
import type { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

export type UserRole = (typeof rolesAllowed)[number];

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

export interface UserQueryOptions {
  pagination: {
    limit: number;
    offset: number;
    sortBy: keyof SafeUser;
    order: 'asc' | 'desc';
  };
  filters: {
    name?: string;
    role?: UserRole;
  };
}

export interface AppJwtPayload extends BaseJwtPayload {
  sub: string;
  type: string;
}

export type SafeUser = Omit<User, 'password'>;

export interface AuthedReq extends Request {
  user: SafeUser;
}

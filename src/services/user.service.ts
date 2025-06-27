import db from '@/db';
import { users } from '@/db/schema';
import type { UserPayload, UserQueryOptions } from '@/types';
import { ApiError } from '@/utils';
import { hashPassword } from '@/utils/password-hash';
import { and, asc, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm';
import httpStatus from 'http-status';

export const getUserByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1).execute();

  return user || null;
};

export const createUser = async (data: UserPayload) => {
  const existingUser = await getUserByEmail(data.email);

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
  }

  const hashedPassword = await hashPassword(data.password);
  const payload = {
    ...data,
    password: hashedPassword,
  };

  const [user] = await db.insert(users).values(payload).returning();
  const { password, ...rest } = user;

  return rest;
};

const queryUsers = async ({ pagination, filters }: UserQueryOptions) => {
  const conditions = [];

  if (filters.name) {
    conditions.push(ilike(users.name, `%${filters.name}%`));
  }

  if (filters.role) {
    conditions.push(eq(users.role, filters.role));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const userColumns = getTableColumns(users);
  const sortColumn = userColumns[pagination.sortBy] || users.createdAt;

  const results = await db
    .select()
    .from(users)
    .where(where)
    .orderBy(pagination.order === 'asc' ? asc(sortColumn) : desc(sortColumn))
    .limit(pagination.limit)
    .offset(pagination.offset);

  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(users).where(where);

  const totalResults = Number(count);

  const page = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(totalResults / pagination.limit);

  return {
    results: results.map(({ password, ...rest }) => rest),
    page,
    limit: pagination.limit,
    totalPages,
    totalResults,
  };
};

export const getUserById = async (id: string) => {
  const { password, ...rest } = getTableColumns(users);
  const [user] = await db.select(rest).from(users).where(eq(users.id, id));

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

export const updateUser = async (id: string, data: Partial<UserPayload>) => {
  await getUserById(id);

  const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return updatedUser;
};

export const deleteUser = async (id: string) => {
  await getUserById(id);

  const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();
  return deletedUser;
};

export default {
  getUserByEmail,
  createUser,
  queryUsers,
  getUserById,
  updateUser,
  deleteUser,
};

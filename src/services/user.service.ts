import db from '@/db';
import { users } from '@/db/schema';
import type { PaginationOptions, User, UserPayload, UserRole } from '@/types';
import { ApiError } from '@/utils';
import { paginate } from '@/utils/paginate';
import { hashPassword } from '@/utils/password-hash';
import { eq, getTableColumns, ilike } from 'drizzle-orm';
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

const queryUsers = async (options: PaginationOptions, filters: Record<string, string>) => {
  const conditions = [];

  if (filters.name) {
    conditions.push(ilike(users.name, `%${filters.name}%`));
  }

  if (filters.role) {
    conditions.push(eq(users.role, filters.role as UserRole));
  }

  const paginated = await paginate<User>({
    table: users,
    filters: conditions,
    options,
  });

  const sanitizedResults = paginated.results.map(({ password, ...rest }) => rest);

  return {
    ...paginated,
    results: sanitizedResults,
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

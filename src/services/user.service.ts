import db from "@/db";
import { users } from "@/db/schema";
import { ApiError } from "@/utils";
import { eq } from "drizzle-orm";
import httpStatus from "http-status";

// Infer types from Drizzle
type UserPayload = typeof users.$inferInsert;
type User = typeof users.$inferSelect;

/**
 * Get a user by email
 * @param email - User email
 * @returns Found user or null
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1).execute();

  return user[0] || null;
};

/**
 * Create a new user
 * @param data - User data (name, email, password, role, etc.)
 * @returns Created user
 */
export const createUser = async (data: UserPayload): Promise<User> => {
  const [newUser] = await db.insert(users).values(data).returning();
  return newUser;
};

/**
 * Get all users
 * @returns List of users
 */
export const getAllUsers = async (): Promise<User[]> => {
  return await db.select().from(users);
};

/**
 * Get a user by ID
 * @param id - User ID
 * @returns User or null if not found
 */
export const getUserById = async (id: string): Promise<Omit<User, "password">> => {
  const [user] = await db.select().from(users).where(eq(users.id, id));

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

/**
 * Update a user
 * @param id - User ID
 * @param data - Partial user data (optional fields)
 * @returns Updated user or null if not found
 */
export const updateUser = async (id: string, data: Partial<UserPayload>): Promise<User | null> => {
  const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return updatedUser ?? null;
};

/**
 * Delete a user
 * @param id - User ID
 * @returns Deleted user or null if not found
 */
export const deleteUser = async (id: string): Promise<User | null> => {
  const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();
  return deletedUser ?? null;
};

// Export as a utility module
export default {
  getUserByEmail,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

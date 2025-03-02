import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Create User
export const createUser = async (name: string, email: string) => {
  const newUser = await db.insert(users).values({ name, email }).returning();
  return newUser[0]; // Return the created user
};

// Get All Users
export const getAllUsers = async () => {
  return await db.select().from(users);
};

// Get User By ID
export const getUserById = async (id: number) => {
  const user = await db.select().from(users).where(eq(users.id, id));
  return user[0] || null;
};

// Update User
export const updateUser = async (id: number, data: { name?: string; email?: string }) => {
  const updatedUser = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return updatedUser[0] || null;
};

// Delete User
export const deleteUser = async (id: number) => {
  const deletedUser = await db.delete(users).where(eq(users.id, id)).returning();
  return deletedUser[0] || null;
};

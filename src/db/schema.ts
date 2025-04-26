import { rolesAllowed } from "@/config";
import { tokenTypes } from "@/config/tokens";
import { sql } from "drizzle-orm";
import { boolean, date, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", rolesAllowed);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").default("user").notNull(),
  isEmailVerified: boolean("is_email_verified").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const tokenTypeEnum = pgEnum("token_type", [
  tokenTypes.REFRESH,
  tokenTypes.RESET_PASSWORD,
  tokenTypes.VERIFY_EMAIL,
]);

export const tokens = pgTable("tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  type: tokenTypeEnum("token_type").notNull(),
  expires: date("expires").notNull(),
  blacklisted: boolean("blacklisted").default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

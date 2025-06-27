import { rolesAllowed } from '@/config';
import { tokenTypes } from '@/config/tokens';
import { relations, sql } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// ===== Enums =====
export const roleEnum = pgEnum('role', rolesAllowed);

export const tokenTypeEnum = pgEnum('token_type', [
  tokenTypes.ACCESS,
  tokenTypes.REFRESH,
  tokenTypes.RESET_PASSWORD,
  tokenTypes.VERIFY_EMAIL,
]);

// ===== Tables =====
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: roleEnum('role').default('user').notNull(),
  isEmailVerified: boolean('is_email_verified').default(false),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const tokens = pgTable('tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  type: tokenTypeEnum('token_type').notNull(),
  expires: timestamp('expires').notNull(),
  blacklisted: boolean('blacklisted').default(false),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

// ===== Relations =====
export const userRelations = relations(users, ({ many }) => ({
  tokens: many(tokens),
}));

export const tokenRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));

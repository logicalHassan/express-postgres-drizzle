import { defineConfig } from 'drizzle-kit';
import { env } from './src/config';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.db.url,
  },
});

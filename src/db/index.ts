import { env } from '@/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const pool = new Pool({
  connectionString: env.db.url,
});

const db = drizzle(pool, { schema });
export default db;

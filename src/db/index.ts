import { env } from "@/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: env.db.url,
});

const db = drizzle({ client: pool });
export default db;

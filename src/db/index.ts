import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/config";

const pool = new Pool({
  connectionString: env.db.url,
});

const db = drizzle({ client: pool });
export default db;

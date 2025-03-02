import db, { pool } from "./index";
import { users } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    await db.insert(users).values([
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" },
    ]);

    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await pool.end();
    console.log("🔌 Database connection closed.");
  }
}

seed();

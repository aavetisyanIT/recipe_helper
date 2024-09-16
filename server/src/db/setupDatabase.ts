import { Client } from "pg";
import { readFileSync } from "fs";
import { join } from "path";
import "dotenv/config";

import { grantUserPermissions } from "./migrations";

// PostgreSQL client configuration
const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

async function executeSqlFile(filePath: string) {
  const sql = readFileSync(filePath, "utf8");
  await client.query(sql);
}

async function setupDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database.");

    await client.query(grantUserPermissions);

    const sqlFilePath = join(__dirname, "migrations", "create_tables.sql");
    await executeSqlFile(sqlFilePath);

    console.log("Database setup complete. All tables have been created.");
  } catch (error) {
    console.error("Error executing SQL commands:", error);
  } finally {
    await client.end();
  }
}

setupDatabase().catch(console.error);

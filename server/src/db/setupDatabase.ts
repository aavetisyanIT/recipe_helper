import { Client } from "pg";
import "dotenv/config";

import { createTables, grantUserPermissions } from "./migrations";

// PostgreSQL client configuration
const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

async function setupDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database.");

    await client.query(grantUserPermissions);
    await client.query(createTables);

    console.log("Database setup complete. All tables have been created.");
  } catch (error) {
    console.error("Error executing SQL commands:", error);
  } finally {
    await client.end();
  }
}

setupDatabase().catch(console.error);

import { Client, QueryResult } from "pg";
import "dotenv/config";

import {
  checkTablesExist,
  createTables,
  grantUserPermissions,
} from "./migrations";

// PostgreSQL client configuration
const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

interface ITableCheckResult {
  table_name: string;
}

async function setupDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database.");

    await client.query(grantUserPermissions);
    const tablesQueryResult: QueryResult<ITableCheckResult> =
      await client.query(checkTablesExist);
    const tables = tablesQueryResult.rows.map(row => row.table_name);
    const usersTableExists = tables.includes("users");
    const recipesTableExists = tables.includes("recipes");
    if (!usersTableExists || !recipesTableExists) {
      await client.query(createTables);

      console.log(
        "Database setup complete. Tables users and recipes have been created.",
      );
    }

    console.log(
      `Database setup complete. Tables ${tables.join(" and ")} already exist`,
    );
  } catch (error) {
    console.error("Error executing SQL commands:", error);
  } finally {
    await client.end();
  }
}

setupDatabase().catch(console.error);

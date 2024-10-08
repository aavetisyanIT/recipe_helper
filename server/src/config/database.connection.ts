import { Pool } from "pg";
import dotenv from "dotenv";

import "dotenv/config";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  max: 20, // maximum number of connections in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection cannot be established
});

import { Pool } from "pg";

import "dotenv/config";

console.log("AAA process.env.USER", process.env.USER);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  max: 20, // maximum number of connections in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection cannot be established
});

export default pool;

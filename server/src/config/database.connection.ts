import { Pool } from "pg";

const pool = new Pool({
  user: "",
  host: "localhost",
  database: "",
  password: "",
  port: 5432,
  max: 20, // maximum number of connections in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection cannot be established
});

export default pool;

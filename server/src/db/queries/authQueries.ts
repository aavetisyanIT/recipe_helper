import { QueryConfig } from "pg";

export function selectUsersByEmailAndUserName(
  email: string,
  username: string,
): QueryConfig {
  return {
    text: `SELECT * FROM users WHERE "email" = $1 OR "user_name" = $2`,
    values: [email, username],
  };
}

export function selectUsersByEmail(email: string): QueryConfig {
  return {
    text: `SELECT * FROM users WHERE "email" = $1`,
    values: [email],
  };
}

export function insertNewUser(
  email: string,
  username: string,
  hashedUserPassword: string,
): QueryConfig {
  return {
    text: `INSERT INTO users ("user_name", "email", "hashed_password")
      VALUES ($1, $2, $3) RETURNING "id", "user_name", "email", "created_at"`,
    values: [username, email, hashedUserPassword],
  };
}

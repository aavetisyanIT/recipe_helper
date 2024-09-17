import { Request, Response } from "express";
import { QueryResult } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

import { ErrorResponse, RegisterRequestBody } from "../types";
import { IUser } from "../models";
import { pool } from "../config/database.connection";

interface RegisterRequest extends Request {
  body: RegisterRequestBody;
}

// @route   POST /auth/register
// @desc    Register a new user
export const register_post = async (req: RegisterRequest, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const userCheck: QueryResult<IUser> = await pool.query(
      `SELECT * FROM users WHERE "Email" = $1 OR "Username" = $2`,
      [email, username],
    );

    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email or username already exists" });
    }

    // Hash password using bcryptjs
    // const saltRounds = process.env.PASSWORD_HASH_SALT as string;
    const saltRounds = 10;

    const hashedUserPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into database
    const newUser: QueryResult<IUser> = await pool.query(
      `INSERT INTO users ("Username", "Email", "HashedPassword")
      VALUES ($1, $2, $3) RETURNING "UserID", "Username", "Email", "CreatedAt"`,
      [username, email, hashedUserPassword],
    );

    const user = newUser.rows[0];
    console.log("AAA added user", user);
  } catch (err) {
    console.error(err);
    const errorResponse: ErrorResponse = { error: "Registration failed" };
    return res.status(500).json(errorResponse);
  }
};

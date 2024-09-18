import { Request, Response } from "express";
import { QueryResult } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

import {
  IErrorResponse,
  IRegisterRequestBody,
  IRegisterResponse,
} from "../types";
import { IUser } from "../models";
import { pool } from "../config/database.connection";

interface RegisterRequest extends Request {
  body: IRegisterRequestBody;
}

const maxAge = 3 * 24 * 60 * 60;
const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: maxAge,
  });
};

// @route   POST /auth/register
// @desc    Register a new user
export const register_post = async (req: RegisterRequest, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const userCheck: QueryResult<IUser> = await pool.query(
      `SELECT * FROM users WHERE "email" = $1 OR "user_name" = $2`,
      [email, username],
    );

    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email or username already exists" });
    }

    // Hash password using bcryptjs
    const saltRounds = bcrypt.genSaltSync(
      parseInt(process.env.PASSWORD_HASH_SALT || "10", 10),
    );
    const hashedUserPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into database
    const newUser: QueryResult<IUser> = await pool.query(
      `INSERT INTO users ("user_name", "email", "hashed_password")
      VALUES ($1, $2, $3) RETURNING "id", "user_name", "email", "created_at"`,
      [username, email, hashedUserPassword],
    );

    const user = newUser.rows[0];
    const token = generateToken(user.id);

    const response: IRegisterResponse = {
      token,
      user,
    };

    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    const errorResponse: IErrorResponse = { error: "Registration failed" };
    return res.status(500).json(errorResponse);
  }
};

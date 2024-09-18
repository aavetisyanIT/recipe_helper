import { Response } from "express";
import { QueryResult } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

import {
  IErrorResponse,
  ILoginUserRequest,
  ILoginUserResponse,
  IRegisterUserRequest,
  IRegisterUserResponse,
} from "../types";
import { IUser } from "../models";
import { pool } from "../config/database.connection";
import {
  insertNewUser,
  selectUsersByEmail,
  selectUsersByEmailAndUserName,
} from "../db";

const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: Number(process.env.MAX_TOKEN_AGE),
  });
};

// @route   POST /auth/register
// @desc    Register a new user
export const register_post = async (
  req: IRegisterUserRequest,
  res: Response<IRegisterUserResponse | IErrorResponse>,
) => {
  const { username, email, password } = req.body;

  try {
    const userCheck: QueryResult<IUser> = await pool.query(
      selectUsersByEmailAndUserName(email, username),
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
      insertNewUser(username, email, hashedUserPassword),
    );

    const user = newUser.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    const errorResponse: IErrorResponse = { error: "User Registration failed" };
    return res.status(500).json(errorResponse);
  }
};

// @route   POST /auth/login
// @desc    Login and return a JWT token
export const login_post = async (
  req: ILoginUserRequest,
  res: Response<ILoginUserResponse | IErrorResponse>,
) => {
  const { email, password } = req.body;
  try {
    const userResult: QueryResult<IUser> = await pool.query(
      selectUsersByEmail(email),
    );
    const user = userResult.rows[0];
    if (!user) {
      return res.status(400).json({ error: "Invalid User Email" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.hashed_password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid User Password" });
    }

    const token = generateToken(user.id);
    res.status(200).json({
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    const errorResponse: IErrorResponse = { error: "User Login failed" };
    res.status(500).json(errorResponse);
  }
};

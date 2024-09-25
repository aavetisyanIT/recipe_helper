import { Request, Response } from "express";
import { QueryResult } from "pg";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
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
import { redisClient } from "../config";

const maxAge = Number(process.env.MAX_TOKEN_AGE);

const generateToken = (userId: number): string => {
  return sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: maxAge,
  });
};

// @route   POST /auth/register
// @desc    Register a new user and sets cache token
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

    redisClient.setEx(
      `jwt:${token}`,
      Number(process.env.MAX_TOKEN_AGE),
      JSON.stringify(user),
    );

    res.cookie("auth_token", token, { maxAge: maxAge * 1000, httpOnly: true });

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
// @desc    Login and return a JWT token and sets cache
export const login_post = async (
  req: ILoginUserRequest,
  res: Response<ILoginUserResponse | IErrorResponse>,
) => {
  const { email, password } = req.body;
  const authToken = req.cookies.auth_token;
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

    if (authToken) {
      redisClient.setEx(
        `jwt:${authToken}`,
        Number(process.env.MAX_TOKEN_AGE),
        JSON.stringify(user),
      );
      const cachedToken = await redisClient.get(`jwt:${authToken}`);
      if (cachedToken) {
        res
          .status(200)
          .json({ token: authToken, user: JSON.parse(cachedToken) });
        return;
      }
    }

    const token = generateToken(user.id);
    redisClient.setEx(
      `jwt:${token}`,
      Number(process.env.MAX_TOKEN_AGE),
      JSON.stringify(user),
    );

    res.cookie("auth_token", token, { maxAge: maxAge * 1000, httpOnly: true });
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

// @route   GET /auth/logout
// @desc    Logout and remove a JWT token from cookies and cache
export const logout_get = async (req: Request, res: Response) => {
  const authToken = req.cookies.auth_token;
  const tokenKey = `jwt:${authToken}`;
  const cachedToken = await redisClient.get(tokenKey);
  if (cachedToken) redisClient.del(tokenKey);

  res.cookie("auth_token", "", { maxAge: 1 });
  res.status(200).json("User is logged out");
};

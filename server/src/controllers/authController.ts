import { Request, Response } from "express";

import "dotenv/config";

import {
  IAuthUserRequest,
  IErrorResponse,
  ILoginUserRequest,
  ILoginUserResponse,
  IRegisterUserRequest,
  IRegisterUserResponse,
} from "../types";
import { IUser } from "../models";
import { IAuthInteractor } from "../interfaces";

const maxAge = Number(process.env.MAX_TOKEN_AGE);

export class AuthController {
  private interactor: IAuthInteractor;

  constructor(interactor: IAuthInteractor) {
    this.interactor = interactor;
  }
  // @route   GET /auth/users
  // @desc    Send list of all users
  async getAllUsers(req: IAuthUserRequest, res: Response) {
    try {
      const users: IUser[] | [] = await this.interactor.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      const errorResponse: IErrorResponse = {
        error: "Not able to get users",
      };
      return res.status(500).json(errorResponse);
    }
  }
  // @route   POST /auth/register
  // @desc    Register a new user and sets cache token
  async registerNewUser(
    req: IRegisterUserRequest,
    res: Response<IRegisterUserResponse | IErrorResponse>,
  ) {
    const { username, email, password } = req.body;
    try {
      const existingUser = await this.interactor.getUserByEmailAndUserName(
        email,
        username,
      );
      if (existingUser) {
        return res.status(400).json({
          error: "User with this email or username already exists",
        });
      }

      const hashedUserPassword = await this.interactor.hashNewUserPassword(
        password,
      );

      const newUser: IUser = await this.interactor.addNewUser(
        username,
        email,
        hashedUserPassword,
      );

      const token = this.interactor.generateToken(newUser);
      this.interactor.cacheNewUser(
        token,
        newUser.id,
        newUser.user_name,
        newUser.email,
      );
      res.cookie("auth_token", token, {
        maxAge: maxAge * 1000,
        httpOnly: true,
      });

      res.status(201).json({
        token,
        user: newUser,
      });
    } catch (err) {
      console.error(err);
      const errorResponse: IErrorResponse = {
        error: "User Registration failed",
      };
      return res.status(500).json(errorResponse);
    }
  }

  // @route   POST /auth/login
  // @desc    Login and return a JWT token and sets cache
  async loginUser(
    req: ILoginUserRequest,
    res: Response<ILoginUserResponse | IErrorResponse>,
  ) {
    const { email, password } = req.body;
    const authToken = req.cookies.auth_token;
    try {
      const user: IUser | null = await this.interactor.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ error: "Invalid User Email" });
      }

      const isPasswordValid = await this.interactor.checkHashedPassword(
        password,
        user.hashed_password,
      );

      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid User Password" });
      }

      if (authToken) {
        const cachedToken = await this.interactor.getCachedToken(authToken);
        if (cachedToken) {
          res
            .status(200)
            .json({ token: authToken, user: JSON.parse(cachedToken) });
          return;
        }
      }

      const token = this.interactor.generateToken(user);
      this.interactor.cacheNewUser(token, user.id, user.user_name, user.email);

      res.cookie("auth_token", token, {
        maxAge: maxAge * 1000,
        httpOnly: true,
      });
      res.status(200).json({
        token,
        user,
      });
    } catch (err) {
      console.error(err);
      const errorResponse: IErrorResponse = { error: "User Login failed" };
      res.status(500).json(errorResponse);
    }
  }

  // @route   GET /auth/logout
  // @desc    Logout and remove a JWT token from cookies and cache
  async logoutUser(req: Request, res: Response) {
    const authToken = req.cookies.auth_token;
    const cachedToken = await this.interactor.getCachedToken(authToken);
    if (cachedToken) await this.interactor.deleteCachedToken(authToken);

    res.cookie("auth_token", "", { maxAge: 1 });
    res.status(200).json("User is logged out");
  }
}

import { Request } from "express";

import { IUser } from "../models";

// this interface allow to store user data in auth middleware
// and pass it to controllers
export interface IAuthUserRequest extends Request {
  user?: { id: number; userName: string; email: string };
}

export interface IRegisterUserRequest extends IAuthUserRequest {
  body: {
    username: string;
    email: string;
    password: string;
  };
}
export interface ILoginUserRequest extends IAuthUserRequest {
  body: { email: string; password: string };
}

export interface IRegisterUserResponse {
  token: string;
  user: IUser;
}

export interface ILoginUserResponse {
  token: string;
  user: IUser;
}

export interface IErrorResponse {
  error: string;
}

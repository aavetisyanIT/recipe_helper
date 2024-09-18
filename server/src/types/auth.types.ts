import { Request } from "express";

import { IUser } from "../models";

export interface IRegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

export interface IErrorResponse {
  error: string;
}

export interface IRegisterUserRequest extends Request {
  body: IRegisterRequestBody;
}
export interface ILoginUserRequest extends Request {
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

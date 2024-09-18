import { IUser } from "../models";

export interface IRegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

export interface IErrorResponse {
  error: string;
}

export interface IRegisterResponse {
  token: string;
  user: IUser;
}

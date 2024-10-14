import { IUser } from "../models";

export interface IAuthInteractor {
  getUserByEmailAndUserName(email: string, username: string): Promise<IUser>;
  addNewUser(
    username: string,
    email: string,
    hashedUserPassword: string,
  ): Promise<IUser>;
  hashNewUserPassword(password: string): Promise<string>;
  generateToken(user: IUser): string;
  cacheNewUser(
    token: string,
    id: number,
    userName: string,
    email: string,
  ): void;
}

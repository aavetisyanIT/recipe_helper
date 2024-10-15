import { IUser } from "../models";

export interface IAuthInteractor {
  getUserByEmailAndUserName(
    email: string,
    userName: string,
  ): Promise<IUser | null>;
  addNewUser(
    userName: string,
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

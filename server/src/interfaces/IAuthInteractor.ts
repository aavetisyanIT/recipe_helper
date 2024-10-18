import { IUser } from "../models";

export interface IAuthInteractor {
  getAllUsers(): Promise<IUser[] | []>;

  getUserByEmailAndUserName(
    email: string,
    userName: string,
  ): Promise<IUser | null>;

  getUserByEmail(email: string): Promise<IUser | null>;

  addNewUser(
    userName: string,
    email: string,
    hashedUserPassword: string,
  ): Promise<IUser>;

  hashNewUserPassword(password: string): Promise<string>;

  checkHashedPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean>;
  generateToken(user: IUser): string;

  cacheNewUser(
    token: string,
    id: number,
    userName: string,
    email: string,
  ): void;

  getCachedToken(token: string): Promise<string | null>;
  deleteCachedToken(token: string): Promise<void>;
}

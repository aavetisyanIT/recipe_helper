import { IUser } from "../models";

export interface IAuthRepository {
  getAllUsers(): Promise<IUser[] | []>;

  selectUserByEmailAndUserName(
    email: string,
    userName: string,
  ): Promise<IUser | null>;

  selectUserByEmail(email: string): Promise<IUser | null>;

  hashNewUserPassword(password: string): Promise<string>;

  checkHashedPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean>;

  createNewUser(
    userName: string,
    email: string,
    hashedUserPassword: string,
  ): Promise<IUser>;

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

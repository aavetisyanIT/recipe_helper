import { IUser } from "../models";

export interface IAuthRepository {
  selectUserByEmailAndUserName(
    email: string,
    userName: string,
  ): Promise<IUser | null>;

  hashNewUserPassword(password: string): Promise<string>;

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
}

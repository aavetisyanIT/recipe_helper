import { IAuthInteractor, IAuthRepository } from "../interfaces";
import { IUser } from "../models";

export class AuthInteractor implements IAuthInteractor {
  private repository: IAuthRepository;

  constructor(repository: IAuthRepository) {
    this.repository = repository;
  }

  async getUserByEmailAndUserName(
    email: string,
    userName: string,
  ): Promise<IUser | null> {
    return this.repository.selectUserByEmailAndUserName(email, userName);
  }

  async hashNewUserPassword(password: string): Promise<string> {
    return this.repository.hashNewUserPassword(password);
  }

  async addNewUser(
    userName: string,
    email: string,
    hashedUserPassword: string,
  ): Promise<IUser> {
    return this.repository.createNewUser(userName, email, hashedUserPassword);
  }

  generateToken(user: IUser): string {
    return this.repository.generateToken(user);
  }

  cacheNewUser(
    token: string,
    id: number,
    userName: string,
    email: string,
  ): void {
    this.repository.cacheNewUser(token, id, userName, email);
  }
}

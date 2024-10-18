import { IAuthInteractor, IAuthRepository } from "../interfaces";
import { IUser } from "../models";

export class AuthInteractor implements IAuthInteractor {
  private repository: IAuthRepository;

  constructor(repository: IAuthRepository) {
    this.repository = repository;
  }

  async getAllUsers(): Promise<IUser[] | []> {
    return this.repository.getAllUsers();
  }

  async getUserByEmailAndUserName(
    email: string,
    userName: string,
  ): Promise<IUser | null> {
    return this.repository.selectUserByEmailAndUserName(email, userName);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return this.repository.selectUserByEmail(email);
  }

  async hashNewUserPassword(password: string): Promise<string> {
    return this.repository.hashNewUserPassword(password);
  }

  async checkHashedPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return this.repository.checkHashedPassword(password, hashedPassword);
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

  async getCachedToken(token: string) {
    return this.repository.getCachedToken(token);
  }

  async deleteCachedToken(token: string): Promise<void> {
    await this.repository.deleteCachedToken(token);
  }
}

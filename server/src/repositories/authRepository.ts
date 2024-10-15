import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import "dotenv/config";

import { IAuthRepository } from "../interfaces";
import { pool, redisClient } from "../config";
import { insertNewUser, selectUsersByEmailAndUserName } from "../db";
import { IUser } from "../models";
import { RedisClientType } from "redis";

export class AuthRepository implements IAuthRepository {
  private client: Pool;
  private saltRounds: string;
  private maxAge: number;
  private redisClient: RedisClientType;

  constructor() {
    this.client = pool;
    this.saltRounds = bcrypt.genSaltSync(
      parseInt(process.env.PASSWORD_HASH_SALT || "10", 10),
    );
    this.maxAge = Number(process.env.MAX_TOKEN_AGE);
    this.redisClient = redisClient;
  }

  async selectUserByEmailAndUserName(
    email: string,
    userName: string,
  ): Promise<IUser | null> {
    const userQueryRes = await this.client.query(
      selectUsersByEmailAndUserName(email, userName),
    );
    if (!userQueryRes.rowCount) return null;
    return userQueryRes.rows[0];
  }
  async hashNewUserPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async createNewUser(
    userName: string,
    email: string,
    hashedUserPassword: string,
  ): Promise<IUser> {
    const newUserQueryRes = await this.client.query(
      insertNewUser(userName, email, hashedUserPassword),
    );
    return newUserQueryRes.rows[0];
  }

  generateToken = (user: IUser): string => {
    const { id, user_name, email } = user;
    return sign(
      { id, userName: user_name, email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: this.maxAge,
      },
    );
  };

  cacheNewUser(
    token: string,
    id: number,
    userName: string,
    email: string,
  ): void {
    redisClient.setEx(
      `jwt:${token}`,
      Number(process.env.MAX_TOKEN_AGE),
      JSON.stringify({
        user: { id, userName, email },
      }),
    );
  }
}

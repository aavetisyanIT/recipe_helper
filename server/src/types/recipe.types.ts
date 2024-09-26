import { Request } from "express";

export interface ICreateRecipeRequest extends Request {
  body: { userId: number };
}

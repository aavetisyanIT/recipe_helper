import { IAuthUserRequest } from "./auth.types";

export interface ICreateRecipeRequest extends IAuthUserRequest {
  body: {
    title: string;
    ingredients: string[];
    instructions: string[];
  };
}

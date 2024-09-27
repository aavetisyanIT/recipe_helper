import { IAuthUserRequest } from "./auth.types";

export interface ICreateRecipeRequest extends IAuthUserRequest {
  body: { userId: number };
}

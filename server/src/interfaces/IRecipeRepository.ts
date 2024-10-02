import { IRecipe } from "../models";

export interface IRecipeRepository {
  getRecipesByUserId(userId: number): Promise<IRecipe[]>;
}

import { IRecipe } from "../models";

export interface IRecipeRepository {
  getRecipesByUserId(userId: number): Promise<IRecipe[]>;
  getRecipeByRecipeId(
    recipeId: number,
    userId: number,
  ): Promise<IRecipe | null>;
}

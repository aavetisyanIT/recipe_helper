import { IRecipe } from "../models";

export interface IRecipeInteractor {
  getRecipesByUserId(userId: number): Promise<IRecipe[]>;
  getRecipeByRecipeId(
    recipeId: number,
    userId: number,
  ): Promise<IRecipe | null>;
}

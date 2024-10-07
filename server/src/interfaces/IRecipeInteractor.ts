import { IRecipe } from "../models";

export interface IRecipeInteractor {
  getRecipesByUserId(userId: number): Promise<IRecipe[]>;
  getRecipeByRecipeId(
    recipeId: number,
    userId: number,
  ): Promise<IRecipe | null>;
  createNewRecipe(
    title: string,
    ingredients: string[],
    instructions: string[],
    author_id: number,
  ): Promise<IRecipe | null>;
}

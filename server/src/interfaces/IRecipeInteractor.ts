import { IRecipe } from "../models";

export interface IRecipeInteractor {
  getRecipesByUserId(userId: number): Promise<IRecipe[]>;
}

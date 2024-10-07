import { IRecipeInteractor, IRecipeRepository } from "../interfaces";
import { IRecipe } from "../models";

export class RecipeInteractor implements IRecipeInteractor {
  private repository: IRecipeRepository;
  constructor(repository: IRecipeRepository) {
    this.repository = repository;
  }

  async getRecipesByUserId(userId: number): Promise<IRecipe[]> {
    return this.repository.getRecipesByUserId(userId);
  }

  async getRecipeByRecipeId(
    recipeId: number,
    userId: number,
  ): Promise<IRecipe | null> {
    return this.repository.getRecipeByRecipeId(recipeId, userId);
  }
}

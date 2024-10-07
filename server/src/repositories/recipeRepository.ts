import { Pool, QueryResult } from "pg";

import { IRecipeRepository } from "../interfaces/IRecipeRepository";
import { IRecipe } from "../models";
import { pool } from "../config";
import { selectAllRecipesByUserId, selectRecipeById } from "../db";

export class RecipeRepository implements IRecipeRepository {
  private client: Pool;
  constructor() {
    this.client = pool;
  }
  async getRecipesByUserId(userId: number): Promise<IRecipe[]> {
    const userRecipes: QueryResult<IRecipe[]> = await this.client.query(
      selectAllRecipesByUserId(userId),
    );
    return userRecipes.rows[0];
  }
  async getRecipeByRecipeId(
    recipeId: number,
    userId: number,
  ): Promise<IRecipe | null> {
    const recipe: QueryResult<IRecipe> = await this.client.query(
      selectRecipeById(recipeId, userId),
    );
    if (recipe.rowCount === 0) return null;
    return recipe.rows[0];
  }
}

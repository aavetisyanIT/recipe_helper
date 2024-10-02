import { Pool, QueryResult } from "pg";

import { IRecipeRepository } from "../interfaces/IRecipeRepository";
import { IRecipe } from "../models";
import { pool } from "../config";
import { selectAllRecipesByUserId } from "../db";

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
}

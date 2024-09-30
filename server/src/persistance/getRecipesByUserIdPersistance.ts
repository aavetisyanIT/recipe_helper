import { QueryResult } from "pg";
import { selectAllRecipesByUserId } from "../db";
import { IRecipe } from "../models";
import { pool } from "../config";

export const getRecipesByUserIdPersistance = async (
  userId: number,
): Promise<IRecipe[]> => {
  try {
    const userRecipes: QueryResult<IRecipe> = await pool.query(
      selectAllRecipesByUserId(userId),
    );
    return userRecipes.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

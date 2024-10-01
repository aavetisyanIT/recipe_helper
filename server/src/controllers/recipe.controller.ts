import { Response } from "express";

import { ICreateRecipeRequest } from "../types/recipe.types";
import { IAuthUserRequest, IErrorResponse } from "../types";
import { createRecipe, selectRecipeById } from "../db";
import { IRecipe } from "../models";
import { pool } from "../config";
import { QueryResult } from "pg";
import { getRecipesByUserIdInteractor } from "../interactors";
import { getRecipesByUserIdPersistance } from "../persistance";

class RecipeController {
  async getAllRecipes(
    req: IAuthUserRequest,
    res: Response<IRecipe[] | IErrorResponse>,
  ) {
    const { user } = req;
    if (!user) {
      return res.status(403).json({ error: "User not authenticated" });
    }

    try {
      const userRecipes = await getRecipesByUserIdInteractor(
        getRecipesByUserIdPersistance,
        user.id,
      );

      if (userRecipes.length === 0) {
        return res
          .status(400)
          .json({ error: "This user does not have recipes" });
      }

      res.status(200).send(userRecipes);
    } catch (err) {
      console.error(err);
      const errorResponse: IErrorResponse = {
        error: "Not able to find recipes for this user",
      };
      res.status(500).json(errorResponse);
    }
  }
  async createRecipe(
    req: ICreateRecipeRequest,
    res: Response<IRecipe | IErrorResponse>,
  ) {
    const { user } = req;
    const { title, ingredients, instructions } = req.body;

    if (!user) {
      return res.status(403).json({ error: "User not authenticated" });
    }

    try {
      const newRecipe: QueryResult<IRecipe> = await pool.query(
        createRecipe(title, ingredients, instructions, user.id),
      );

      const recipe = newRecipe.rows[0];

      res.status(200).send(recipe);
    } catch (err) {
      console.error(err);
      const errorResponse: IErrorResponse = {
        error: "Not able to create recipes for this user",
      };
      res.status(500).json(errorResponse);
    }
  }
  async getRecipeByRecipeId(
    req: IAuthUserRequest,
    res: Response<IRecipe | IErrorResponse>,
  ) {
    const { id } = req.params;
    const { user } = req;
    const recipeId = parseInt(id, 10);
    if (!user) {
      return res.status(403).json({ error: "User not authenticated" });
    }
    if (isNaN(recipeId)) {
      return res.status(400).json({ error: "Invalid recipe ID" });
    }

    try {
      const recipe: QueryResult<IRecipe> = await pool.query(
        selectRecipeById(recipeId, user.id),
      );
      if (recipe.rowCount === 0) {
        return res.status(400).json({ error: "No recipe with provided id" });
      }

      res.status(200).json(recipe.rows[0]);
    } catch (err) {
      console.error(err);
      const errorResponse: IErrorResponse = {
        error: "Not able to find recipe by ID",
      };
      res.status(500).json(errorResponse);
    }
  }
}

export const controller = new RecipeController();

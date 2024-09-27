import { Response } from "express";

import { ICreateRecipeRequest } from "../types/recipe.types";
import { IAuthUserRequest, IErrorResponse } from "../types";
import { createRecipe, selectAllRecipesByUserId } from "../db";
import { IRecipe } from "../models";
import { pool } from "../config";
import { QueryResult } from "pg";

export const recipes_get = async (
  req: IAuthUserRequest,
  res: Response<IRecipe[] | IErrorResponse>,
) => {
  const { user } = req;
  if (!user) {
    return res.status(403).json({ error: "User not authenticated" });
  }

  try {
    const userRecipes: QueryResult<IRecipe> = await pool.query(
      selectAllRecipesByUserId(user.id),
    );
    if (userRecipes.rowCount === 0) {
      return res.status(400).json({ error: "This user does not have recipes" });
    }

    res.status(200).send(userRecipes.rows);
  } catch (err) {
    console.error(err);
    const errorResponse: IErrorResponse = {
      error: "Not able to find recipes for this user",
    };
    res.status(500).json(errorResponse);
  }
};

export const recipe_post = async (
  req: ICreateRecipeRequest,
  res: Response<IRecipe | IErrorResponse>,
) => {
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
};

import { Response } from "express";

import {
  IAuthUserRequest,
  IErrorResponse,
  ICreateRecipeRequest,
} from "../types";
import { IRecipe } from "../models";
import { IRecipeInteractor } from "../interfaces";

export class RecipeController {
  private interactor: IRecipeInteractor;

  constructor(interactor: IRecipeInteractor) {
    this.interactor = interactor;
  }

  async getAllRecipes(
    req: IAuthUserRequest,
    res: Response<IRecipe[] | IErrorResponse>,
  ) {
    const { user } = req;
    if (!user) {
      return res.status(403).json({ error: "User not authenticated" });
    }

    try {
      const userRecipes = await this.interactor.getRecipesByUserId(user.id);
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
      const newRecipe = await this.interactor.createNewRecipe(
        title,
        ingredients,
        instructions,
        user.id,
      );

      if (!newRecipe)
        return res
          .status(401)
          .json({ error: "Recipe could not be created. Try again, please." });

      res.status(200).send(newRecipe);
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
      const recipe: IRecipe | null = await this.interactor.getRecipeByRecipeId(
        recipeId,
        user.id,
      );
      if (!recipe) {
        return res.status(400).json({ error: "No recipe with provided id" });
      }

      res.status(200).json(recipe);
    } catch (err) {
      console.error(err);
      const errorResponse: IErrorResponse = {
        error: "Not able to find recipe by ID",
      };
      res.status(500).json(errorResponse);
    }
  }
}

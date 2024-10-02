import express, { Router } from "express";

import { recipeCreationValidation } from "../middleware/validators";
import { handleRecipeErrors } from "../middleware/handleRecipeErrors";
import { RecipeRepository } from "../repositories";
import { RecipeInteractor } from "../interactors";
import { RecipeController } from "../controllers";

const repository = new RecipeRepository();
const interactor = new RecipeInteractor(repository);
const controller = new RecipeController(interactor);

const recipeRouter: Router = express.Router();

recipeRouter.get("/", controller.getAllRecipes.bind(controller));
recipeRouter.get("/:id", controller.getRecipeByRecipeId.bind(controller));
recipeRouter.post(
  "/",
  recipeCreationValidation,
  handleRecipeErrors,
  controller.createRecipe.bind(controller),
);

export default recipeRouter;

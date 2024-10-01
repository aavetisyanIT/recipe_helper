import express, { Router } from "express";

import { controller } from "../controllers";
import { recipeCreationValidation } from "../middleware/validators";
import { handleRecipeErrors } from "../middleware/handleRecipeErrors";

const recipeRouter: Router = express.Router();

recipeRouter.get("/", controller.getAllRecipes);
recipeRouter.get("/:id", controller.getRecipeByRecipeId);
recipeRouter.post(
  "/",
  recipeCreationValidation,
  handleRecipeErrors,
  controller.createRecipe,
);

export default recipeRouter;

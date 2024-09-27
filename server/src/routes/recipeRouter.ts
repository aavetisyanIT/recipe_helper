import express, { Router } from "express";

import { recipe_by_id_get, recipe_post, recipes_get } from "../controllers";
import { recipeCreationValidation } from "../middleware/validators";
import { handleRecipeErrors } from "../middleware/handleRecipeErrors";

const recipeRouter: Router = express.Router();

recipeRouter.get("/", recipes_get);
recipeRouter.get("/:id", recipe_by_id_get);
recipeRouter.post(
  "/",
  recipeCreationValidation,
  handleRecipeErrors,
  recipe_post,
);

export default recipeRouter;

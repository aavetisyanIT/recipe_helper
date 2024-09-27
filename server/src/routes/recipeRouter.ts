import express, { Router } from "express";

import { recipe_post, recipes_get } from "../controllers";
import { recipeCreationValidation } from "../middleware/validators";

const recipeRouter: Router = express.Router();

recipeRouter.get("/", recipes_get);
recipeRouter.post("/", recipeCreationValidation, recipe_post);

export default recipeRouter;

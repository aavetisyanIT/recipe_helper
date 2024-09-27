import express, { Router } from "express";

import { recipe_post, recipes_get } from "../controllers";

const recipeRouter: Router = express.Router();

recipeRouter.get("/", recipes_get);
recipeRouter.post("/", recipe_post);

export default recipeRouter;

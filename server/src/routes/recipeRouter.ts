import express, { Router } from "express";

import { recipe_post } from "../controllers";

const recipeRouter: Router = express.Router();

recipeRouter.post("/", recipe_post);

export default recipeRouter;

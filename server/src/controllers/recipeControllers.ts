import { Response } from "express";

import { ICreateRecipeRequest } from "../types/recipe.types";

export const recipe_post = (req: ICreateRecipeRequest, res: Response) => {
  const { userId } = req.body;
  console.log("recipe post", userId);

  res.status(200).send("test");
};

import { Response } from "express";

import { ICreateRecipeRequest } from "../types/recipe.types";
import { IAuthUserRequest } from "../types";

export const recipes_get = (req: IAuthUserRequest, res: Response) => {
  const { user } = req;
  if (!user) {
    return res.status(403).json({ error: "User not authenticated" });
  }

  res.status(200).send(`get recipe for user ${user.userName}`);
};

export const recipe_post = (req: ICreateRecipeRequest, res: Response) => {
  const { user } = req;

  if (!user) {
    return res.status(403).json({ error: "User not authenticated" });
  }

  res.status(200).send(`created recipe for user ${user.userName}`);
};

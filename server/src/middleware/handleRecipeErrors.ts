import { NextFunction, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";

import { IRecipe } from "../models";
import { IErrorResponse, ICreateRecipeRequest } from "../types";
import { validationRecipeMessages } from "./utils";

export function handleRecipeErrors(
  req: ICreateRecipeRequest,
  res: Response<IRecipe | IErrorResponse>,
  next: NextFunction,
) {
  const {
    invalidRecipeTitle,
    invalidRecipeIngredientsArr,
    invalidRecipeIngredients,
    invalidRecipeInstructionsArr,
    invalidRecipeInstructions,
  } = validationRecipeMessages;

  const errors: Result<ValidationError> = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const errorMsgArr = errors.array().map(({ msg }: ValidationError) => msg);
  if (errorMsgArr.includes(invalidRecipeTitle)) {
    return res.status(400).json({
      error: "Invalid title",
    });
  }

  if (errorMsgArr.includes(invalidRecipeIngredientsArr)) {
    return res.status(400).json({
      error: "Ingredients array can't be empty",
    });
  }

  if (errorMsgArr.includes(invalidRecipeIngredients)) {
    return res.status(400).json({
      error: "Ingredient can't be empty",
    });
  }

  if (errorMsgArr.includes(invalidRecipeInstructionsArr)) {
    return res.status(400).json({
      error: "Instructions array can't be empty",
    });
  }

  if (errorMsgArr.includes(invalidRecipeInstructions)) {
    return res.status(400).json({
      error: "Instruction can't be empty",
    });
  }
}

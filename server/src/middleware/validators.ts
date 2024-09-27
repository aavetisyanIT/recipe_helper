import { body } from "express-validator";

import { validationAuthMessages, validationRecipeMessages } from "./utils";

const { invalidEmail, invalidPassword, invalidUserName } =
  validationAuthMessages;

const {
  invalidRecipeTitle,
  invalidRecipeIngredientsArr,
  invalidRecipeIngredients,
  invalidRecipeInstructionsArr,
  invalidRecipeInstructions,
} = validationRecipeMessages;

export const userRegistrationValidation = [
  body("username").isLength({ min: 3, max: 15 }).withMessage(invalidUserName),
  body("email").isEmail().withMessage(invalidEmail),
  body("password").isLength({ min: 4, max: 15 }).withMessage(invalidPassword),
];
export const userLoginValidation = [
  body("email").isEmail().withMessage(invalidEmail),
  body("password").isLength({ min: 4, max: 15 }).withMessage(invalidPassword),
];

export const recipeCreationValidation = [
  body("title").isLength({ min: 3, max: 50 }).withMessage(invalidRecipeTitle),
  body("ingredients")
    .isArray()
    .withMessage(invalidRecipeIngredientsArr)
    .notEmpty()
    .withMessage(invalidRecipeIngredients),
  body("instructions")
    .isArray()
    .withMessage(invalidRecipeInstructionsArr)
    .notEmpty()
    .withMessage(invalidRecipeInstructions),
];

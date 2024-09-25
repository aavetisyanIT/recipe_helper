import { body } from "express-validator";
import { validationAuthMassages } from "./utils";

const { invalidEmail, invalidPassword, invalidUserName } =
  validationAuthMassages;

export const userRegistrationValidation = [
  body("username").isLength({ min: 3, max: 15 }).withMessage(invalidUserName),
  body("email").isEmail().withMessage(invalidEmail),
  body("password").isLength({ min: 4, max: 15 }).withMessage(invalidPassword),
];
export const userLoginValidation = [
  body("email").isEmail().withMessage(invalidEmail),
  body("password").isLength({ min: 4, max: 15 }).withMessage(invalidPassword),
];

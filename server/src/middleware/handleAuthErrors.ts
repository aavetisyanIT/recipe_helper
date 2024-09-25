import { Response, NextFunction } from "express";
import { ValidationError, validationResult, Result } from "express-validator";

import {
  IErrorResponse,
  IRegisterUserRequest,
  IRegisterUserResponse,
} from "../types";
import { validationAuthMassages } from "./utils";

export function handleAuthErrors(
  req: IRegisterUserRequest,
  res: Response<IRegisterUserResponse | IErrorResponse>,
  next: NextFunction,
) {
  const { invalidEmail, invalidPassword, invalidUserName } =
    validationAuthMassages;
  const errors: Result<ValidationError> = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const errorMsgArr = errors.array().map(({ msg }: ValidationError) => msg);

  if (errorMsgArr.includes(invalidUserName)) {
    return res.status(400).json({
      error:
        "Username must be at least 3 characters long and no longer than 15",
    });
  }
  if (errorMsgArr.includes(invalidEmail)) {
    return res.status(400).json({
      error: "Please, provide a valid email",
    });
  }
  if (errorMsgArr.includes(invalidPassword)) {
    return res.status(400).json({
      error:
        "Password must be at least 4 characters long but no longer than 15",
    });
  }
  return res
    .status(400)
    .json({ error: "Something went wrong. Please, try again." });
}

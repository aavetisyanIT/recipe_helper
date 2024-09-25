import express, { Router } from "express";

import { register_post, login_post, logout_get } from "../controllers";
import {
  userLoginValidation,
  userRegistrationValidation,
} from "../middleware/validators";
import { handleAuthErrors } from "../middleware";

const authRouter: Router = express.Router();

authRouter.post(
  "/register",
  userRegistrationValidation,
  handleAuthErrors,
  register_post,
);
authRouter.post("/login", userLoginValidation, handleAuthErrors, login_post);
authRouter.get("/logout", logout_get);

export default authRouter;

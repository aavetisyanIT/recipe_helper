import express, { Router } from "express";

import { login_post, logout_get, AuthController } from "../controllers";
import {
  userLoginValidation,
  userRegistrationValidation,
} from "../middleware/validators";
import { handleAuthErrors } from "../middleware";
import { AuthInteractor } from "../interactors";
import { AuthRepository } from "../repositories";

const repository = new AuthRepository();
const interactor = new AuthInteractor(repository);
const controller = new AuthController(interactor);

const authRouter: Router = express.Router();

authRouter.post(
  "/register",
  userRegistrationValidation,
  handleAuthErrors,
  controller.registerNewUser.bind(controller),
);
authRouter.post("/login", userLoginValidation, handleAuthErrors, login_post);
authRouter.get("/logout", logout_get);

export default authRouter;

import express, { Router } from "express";

import { AuthController } from "../controllers";
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
authRouter.post(
  "/login",
  userLoginValidation,
  handleAuthErrors,
  controller.loginUser.bind(controller),
);
authRouter.get("/logout", controller.logoutUser.bind(controller));

// TODO: mount this route properly
// authRouter.get(
//   "/",
//   rateLimiter,
//   requireAuth,
//   async (req: IAuthUserRequest, res: Response) => {
//     const result: QueryResult<IUser> = await pool.query("SELECT * FROM users");
//     res.status(200).json(result.rows);
//   },
// );

export default authRouter;

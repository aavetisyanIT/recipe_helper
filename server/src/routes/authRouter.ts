import express, { Router } from "express";

import { register_post, login_post } from "../controllers";

const authRouter: Router = express.Router();

authRouter.post("/register", register_post);
authRouter.post("/login", login_post);

export default authRouter;

import express, { Router } from "express";

import { register_post, login_post, logout_get } from "../controllers";

const authRouter: Router = express.Router();

authRouter.post("/register", register_post);
authRouter.post("/login", login_post);
authRouter.get("/logout", logout_get);

export default authRouter;

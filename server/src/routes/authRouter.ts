import express, { Router } from "express";

import { register_post } from "../controllers";

const authRouter: Router = express.Router();

authRouter.post("/register", register_post);

export default authRouter;

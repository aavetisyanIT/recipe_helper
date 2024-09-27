import express, { Application, Response } from "express";
import { QueryResult } from "pg";
import cookieParser from "cookie-parser";

import { pool } from "./config/database.connection";
import { requireAuth, rateLimiter, errorHandler } from "./middleware";
import { IUser } from "./models";
import authRouter from "./routes/authRouter";
import recipeRouter from "./routes/recipeRouter";
import { IAuthUserRequest } from "./types";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Error handling middleware
app.use(errorHandler);

app.use("/auth", rateLimiter, authRouter);
app.use("/recipes", rateLimiter, requireAuth, recipeRouter);

app.get(
  "/",
  rateLimiter,
  requireAuth,
  async (req: IAuthUserRequest, res: Response) => {
    console.log("AAA GET Users, logged in user:", req.user);
    const result: QueryResult<IUser> = await pool.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  },
);

export default app;

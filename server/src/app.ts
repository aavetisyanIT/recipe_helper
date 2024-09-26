import express, { Application, Request, Response } from "express";
import { QueryResult } from "pg";
import cookieParser from "cookie-parser";

import { pool } from "./config/database.connection";
import { requireAuth, rateLimiter, errorHandler } from "./middleware";
import { IUser } from "./models";
import authRouter from "./routes/authRouter";
import recipeRouter from "./routes/recipeRouter";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Error handling middleware
app.use(errorHandler);

app.use("/auth", rateLimiter, authRouter);
app.use("/recipes", rateLimiter, recipeRouter);

app.get("/", rateLimiter, requireAuth, async (req: Request, res: Response) => {
  const result: QueryResult<IUser> = await pool.query("SELECT * FROM users");
  res.status(200).json(result.rows);
});

export default app;

import express, { Application, Request, Response } from "express";
import { QueryResult } from "pg";
import cookieParser from "cookie-parser";

import { pool } from "./config/database.connection";
import authRouter from "./routes/authRouter";
import { IUser } from "./models";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);

app.get("/", async (req: Request, res: Response) => {
  const result: QueryResult<IUser> = await pool.query("SELECT * FROM users");
  console.log("AAA result", result.rows);

  res.send(`Hello, TypeScript with Express!`);
});

export default app;

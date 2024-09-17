import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";

import { pool } from "./config/database.connection";
import authRouter from "./routes/authRouter";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRouter);

app.get("/", async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM users");
  console.log("AAA result", result);

  res.send(`Hello, TypeScript with Express!`);
});

export default app;

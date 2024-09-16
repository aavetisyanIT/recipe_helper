import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import pool from "./config/database.connection";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM pg_aggregate");
  console.log("AAA result", result);

  res.send(`Hello, TypeScript with Express!`);
});

export default app;

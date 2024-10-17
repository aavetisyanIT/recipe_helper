import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { requireAuth, rateLimiter, errorHandler } from "./middleware";
import authRouter from "./routes/authRouter";
import recipeRouter from "./routes/recipeRouter";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Error handling middleware
app.use(errorHandler);

app.use("/auth", rateLimiter, authRouter);
app.use("/recipes", rateLimiter, requireAuth, recipeRouter);

export default app;

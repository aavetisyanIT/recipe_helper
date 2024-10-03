import { createClient } from "redis";

import "dotenv/config";

console.log("AAA process.env.REDIS_URL", process.env.REDIS_URL);

export const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", err => console.error("Redis Client Error", err));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.log("Error connecting to Redis:", err);
  }
};

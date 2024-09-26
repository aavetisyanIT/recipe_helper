import { verify, VerifyErrors } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import "dotenv/config";

import { redisClient } from "../config";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.cookies.auth_token;

  if (!authToken) {
    return res.status(403).json({ error: "User is not logged in" });
  }
  //check if token is cached in Redis under key: `jwt:${token}`
  const cachedToken = await redisClient.get(`jwt:${authToken}`);
  if (cachedToken) {
    const parsedToken = JSON.parse(cachedToken);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).user = parsedToken.user;
    return next();
  }
  verify(
    authToken,
    process.env.JWT_SECRET as string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: "User is not logged in" });
      }
      // if token not cached verify token authToken.verify
      // Cache the decoded token for the remaining token validity period (exp - current time)
      const expiryTime = decoded.exp
        ? decoded.exp - Math.floor(Date.now() / 1000)
        : Number(process.env.MAX_TOKEN_AGE);
      const { id, userName, email } = decoded;

      const loggedInUser = {
        id,
        userName,
        email,
      };

      redisClient.setEx(
        `jwt:${authToken}`,
        expiryTime,
        JSON.stringify({ user: loggedInUser }),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).user = loggedInUser;
      next();
    },
  );
}

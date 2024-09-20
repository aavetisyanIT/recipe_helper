import { verify, VerifyErrors } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import "dotenv/config";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const jwt = req.cookies.auth_token;

  if (!jwt) {
    return res.status(403).json({ error: "User is not logged in" });
  }

  verify(jwt, process.env.JWT_SECRET as string, (err: VerifyErrors | null) => {
    if (err) {
      return res.status(403).json({ error: "User is not logged in" });
    }
    next();
  });
}

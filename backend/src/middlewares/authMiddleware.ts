import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

import { AuthError } from "errors/Errors.ts";
import { verifyAccessToken } from "services/jwt.service.ts";

export interface TokenPayload extends JwtPayload {
  userEmail: string;
  tokenVersion: number;
}

function authenticateTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return next(new AuthError());
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}

export default authenticateTokenMiddleware;

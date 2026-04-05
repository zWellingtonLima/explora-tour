import { Request, Response, NextFunction } from "express";

import { jwtService } from "infra/http/jwt.service.ts";
import { AuthError } from "shared/errors/Errors.ts";

function authenticateToken(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // "Bearer <token>"

    if (!token) return next(new AuthError());

    req.user = jwtService.verifyAccessToken(token); // lança TokenError se inválido
    next();
  } catch (err) {
    next(err); // TokenError (403) → errorHandler
  }
}

export { authenticateToken };

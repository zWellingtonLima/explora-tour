import jwt from "jsonwebtoken";
import { envConfig } from "config/env.ts";
import { TokenError } from "shared/errors/Errors.ts";

// ─── Contratos dos payloads ───────────────────────────────────────────────────

export type AccessTokenPayload = {
  userId: string;
  userEmail: string;
};

export type RefreshTokenPayload = {
  userId: string;
  tokenVersion: number;
};

// ─── Access token (15 min) ────────────────────────────────────────────────────

function signAccessToken(userId: string, userEmail: string): string {
  return jwt.sign({ userId, userEmail }, envConfig.JWT_ACCESS_SECRET, {
    expiresIn: 900,
  });
}

function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, envConfig.JWT_ACCESS_SECRET);
    if (typeof decoded === "string") throw new TokenError();
    return decoded as AccessTokenPayload;
  } catch {
    throw new TokenError();
  }
}

// ─── Refresh token (3 dias) ───────────────────────────────────────────────────

function signRefreshToken(userId: string, tokenVersion: number): string {
  return jwt.sign({ userId, tokenVersion }, envConfig.JWT_REFRESH_TOKEN, {
    expiresIn: "3d",
  });
}

function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const decoded = jwt.verify(token, envConfig.JWT_REFRESH_TOKEN);
    if (typeof decoded === "string") throw new TokenError();

    const payload = decoded as RefreshTokenPayload;
    if (
      typeof payload.userId !== "string" ||
      typeof payload.tokenVersion !== "number"
    ) {
      throw new TokenError();
    }

    return payload;
  } catch {
    throw new TokenError();
  }
}

export const jwtService = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};

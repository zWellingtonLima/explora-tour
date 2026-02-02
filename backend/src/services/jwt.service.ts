import jwt from "jsonwebtoken";

import { envConfig } from "envConfig.ts";
import { TokenError } from "errors/Errors.ts";
import { TokenPayload } from "middlewares/authMiddleware.ts";

function signAccessToken(userId: string, userEmail: string) {
  return jwt.sign({ userId, userEmail }, envConfig.JWT_ACCESS_SECRET, {
    expiresIn: 900,
  });
}

function signRefreshToken(userId: string, token_version: number) {
  return jwt.sign({ userId, token_version }, envConfig.JWT_REFRESH_TOKEN, {
    expiresIn: "1d",
  });
}

function verifyAccessToken(token: string) {
  try {
    const decoded = jwt.verify(token, envConfig.JWT_ACCESS_SECRET);
    return decoded;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new TokenError();
  }
}

function verifyRefreshToken(oldToken: string) {
  try {
    const decoded = jwt.verify(oldToken, envConfig.JWT_REFRESH_TOKEN);

    if (typeof decoded === "string") {
      throw new TokenError();
    }

    if (!decoded.userEmail) {
      throw new TokenError();
    }

    return decoded as TokenPayload;
  } catch {
    throw new TokenError();
  }
}

export {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

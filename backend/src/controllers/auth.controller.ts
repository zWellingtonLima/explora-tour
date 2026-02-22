import { Request, Response, NextFunction } from "express";

import {
  AuthError,
  EmailAlreadyExistsError,
  TokenError,
} from "errors/Errors.ts";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "services/jwt.service.ts";
import {
  loginUser,
  registerUser,
  validateCredentials,
} from "services/user-service.ts";
import { findUserById, incrementTokenVersion } from "models/user.model.ts";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none" as const,
  path: "/",
  maxAge: 3 * 24 * 60 * 60 * 1000, // 3d
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await registerUser(req.body);

    const accessToken = signAccessToken(user.id, user.email);
    const refreshToken = signRefreshToken(user.id, user.token_version);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    return res.status(201).json({ user, accessToken });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (
      err?.code === "23505" ||
      (err?.detail && err.detail.includes("already exists"))
    ) {
      return next(new EmailAlreadyExistsError());
    }

    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials = validateCredentials(req.body);
    const { accessToken, refreshToken } = await loginUser(credentials);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      data: {
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const oldToken = req.cookies?.refreshToken;
    if (!oldToken) throw new TokenError();

    const payload = verifyRefreshToken(oldToken);

    const user = await findUserById(payload.userId);
    if (!user) throw new AuthError();

    if (payload.token_version !== user.token_version) {
      res.clearCookie("refreshToken");
      throw new AuthError();
    }

    // Rotaciona: cria novo refresh token e novo access token
    const newVersion = await incrementTokenVersion(user.id);

    const newAccessToken = signAccessToken(user.id, user.userEmail);
    const newRefreshToken = signRefreshToken(user.id, newVersion);

    res.cookie("refreshToken", newRefreshToken, cookieOptions);
    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const payload = verifyRefreshToken(token);
      await incrementTokenVersion(payload.userId);
    }

    // limpa cookie no client
    res.clearCookie("refreshToken", { path: "/" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export { register, login, refresh, logout };

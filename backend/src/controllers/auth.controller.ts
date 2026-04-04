import { Request, Response, NextFunction } from "express";
import { authService } from "services/auth.service.ts";

const REFRESH_COOKIE = "refreshToken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 3 * 24 * 60 * 60 * 1000, // 3 dias em ms
};

// POST /auth/register
async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { accessToken, refreshToken } = await authService.register(req.body);
    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    return res.status(201).json({ data: { accessToken } });
  } catch (err) {
    next(err);
  }
}

// POST /auth/login
async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(
      email,
      password,
    );
    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    return res.json({ data: { accessToken } });
  } catch (err) {
    next(err);
  }
}

// POST /auth/refresh
async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { accessToken, refreshToken } = await authService.refresh(
      req.cookies[REFRESH_COOKIE],
    );
    // Rotaciona o cookie — refresh token rotation
    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    return res.json({ data: accessToken });
  } catch (err) {
    next(err);
  }
}

// POST /auth/logout  (rota protegida — requer access token)
async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.logout(req.user!.userId);
    res.clearCookie(REFRESH_COOKIE, COOKIE_OPTIONS);
    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export const authController = { register, login, refresh, logout };

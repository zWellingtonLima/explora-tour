import { Request, Response, NextFunction } from "express";

import {
  AuthError,
  EmailAlreadyExistsError,
  TokenError,
} from "errors/Errors.ts";

import { registerUser } from "services/register-user.service.ts";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "services/jwt.service.ts";
import validateCredentials from "services/validate-login-credentials.service.ts";
import loginUser from "services/authenticate-user.service.ts";

// Store it in DB
const refreshTokenStore = new Map<string, string>();
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none" as const,
  path: "/",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    const token = signAccessToken(user.email);
    const data = {
      user,
      accessToken: token,
    };

    const refreshToken = signRefreshToken(user.email);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(201).json(data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (
      err?.code === "23505" ||
      (err?.detail && err.detail.includes("already exists"))
    ) {
      throw new EmailAlreadyExistsError();
    }

    throw err;
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = validateCredentials(req.body);
    const { accessToken, refreshToken } = await loginUser(user);

    //Substituir por inserção e relacao com o BD para track validity
    refreshTokenStore.set(user.email, refreshToken);
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
    if (!oldToken) {
      throw new TokenError();
    }

    const payload = verifyRefreshToken(oldToken);

    const storedToken = refreshTokenStore.get(payload.userEmail);
    if (!storedToken || storedToken !== oldToken) {
      res.clearCookie("refreshToken");
      throw new AuthError();
    }

    // Rotaciona: cria novo refresh token e novo access token
    const newAccessToken = signAccessToken(payload.userEmail!);
    const newRefreshToken = signRefreshToken(payload.userEmail!);

    // TODO: alterar isso para um salvamento real do novo token
    refreshTokenStore.set(payload.userEmail, newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

// router.post("/logout", (req, res) => {
//   try {
//     const token = req.cookies?.refreshToken;
//     if (token) {
//       try {
//         const payload = verifyRefreshToken(token);
//         refreshTokenStore.delete(payload.userEmail);
//       } catch (e) {
//         // ignorar; token inválido já removido
//       }
//     }

//     // limpa cookie no client
//     res.clearCookie("refreshToken", { path: "/" });
//     res.json({ ok: true });
//   } catch (err) {
//     res.status(500).json({ ok: false });
//   }
// });

export { register, login, refresh };

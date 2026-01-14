import { Request, Response } from "express";

import { EmailAlreadyExistsError } from "errors/Errors.ts";

import { registerUser } from "services/register-user.service.ts";
import { jwtGenerator } from "services/jwt-generator.service.ts";
import validateCredentials from "services/validate-login-credentials.service.ts";
import authenticateUser from "services/authenticate-user.service.ts";
import jwt from "jsonwebtoken";
import { envConfig } from "envConfig.ts";

const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    const token = jwtGenerator(user.id!);
    const data = {
      user,
      accessToken: token,
    };

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

const login = async (req: Request, res: Response) => {
  const user = validateCredentials(req.body);
  const token = await authenticateUser(user);

  return res.status(200).json({
    data: {
      token,
    },
  });
};

const me = async (req: Request, res: Response) => {};

export { register, login, me };

import { Request, Response } from "express";

import { EmailAlreadyExistsError } from "errors/Errors.ts";

import { registerUser } from "services/register-user.service.ts";
import jwtGenerator from "services/jwt-generator.service.ts";

const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    const token = jwtGenerator(user.email);
    const data = {
      user,
      token,
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

export default register;

import { Request, Response } from "express";

import { ValidationError, EmailAlreadyExistsError } from "errors/Errors.ts";
import UserSchema from "models/createUserSchema.ts";
import { createUser } from "models/createUser.model.ts";

const registerUser = async (req: Request, res: Response) => {
  try {
    const parsedUserData = UserSchema.safeParse(req.body);

    if (!parsedUserData.success) {
      throw new ValidationError(parsedUserData.error.issues[0]);
    }

    const user = parsedUserData.data;

    const createdUser = await createUser(user);

    return res.status(201).json({ data: createdUser });

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

export default registerUser;

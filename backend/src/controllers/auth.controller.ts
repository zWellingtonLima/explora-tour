import { Request, Response } from "express";

import { ValidationError, EmailAlreadyExistsError } from "errors/Errors.ts";
import database from "infra/database.ts";
import { UserSchema, getHashedPassword } from "models/createUserSchema.ts";

const registerUser = async (req: Request, res: Response) => {
  try {
    const parsedUserData = UserSchema.safeParse(req.body);

    if (!parsedUserData.success) {
      throw new ValidationError(parsedUserData.error.issues[0]);
    }

    const user = parsedUserData.data;
    const hashedPassword = await getHashedPassword(user.password);

    const query = {
      text: `
        INSERT INTO users (user_type, username, email, hashed_password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, user_type, username, email, created_at
      `,
      values: [
        user.user_type,
        user.username,
        user.email.toLowerCase().trim(),
        hashedPassword,
      ],
    };

    const { id, username, user_type, created_at, email } = (
      await database.query(query)
    ).rows[0];

    return res
      .status(201)
      .json({ data: { id, username, user_type, created_at, email } });

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

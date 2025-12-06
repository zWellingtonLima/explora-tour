import { Request, Response } from "express";

import database from "infra/database.ts";
import {
  getHashedPassword,
  UserSchema,
  UserType,
} from "models/createUserSchema.ts";

const postUsersController = async (req: Request, res: Response) => {
  try {
    const parsedResult = UserSchema.safeParse(req.body);

    if (!parsedResult.success) {
      return res
        .status(400)
        .json({ error: "invalid_payload", issues: parsedResult.error.message });
    }

    const user = parsedResult.data;
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

    const result = await database.query(query);
    const { id, username, user_type, email, created_at } = result.rows[0];

    return res.status(201).json({
      id,
      username,
      user_type,
      email,
      created_at,
    });
  } catch (err: any) {
    if (
      err?.code === "23505" ||
      (err?.detail && err.detail.includes("already exists"))
    ) {
      return res.status(409).json({ error: "email_already_taken" });
    }

    console.error("PostUsersController error: ", err);
    return res.status(500).json({ error: "internal_server_error" });
  }
};

// TODO: Need to improve implementation
const getUsersController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user: UserType = (
      await database.query({
        text: `SELECT username, user_type FROM users WHERE id=${id};`,
      })
    ).rows[0];
    return res.status(200).json(user);
  } catch (err) {
    console.error("Get users Controller error: ", err);
    return res.status(404).json({ error: "User not found" });
  }
};

export { postUsersController, getUsersController };

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as z from "zod";

import database from "infra/database.ts";

const BaseUserSchema = z.object({
  email: z.email(),
  username: z.string(),
  password: z.string().min(8),
});

const TravelerSchema = BaseUserSchema.extend({
  user_type: z.literal("traveler"),
});

const DriverSchema = BaseUserSchema.extend({
  user_type: z.literal("driver"),
  driver_licence: z.object({
    number: z.string(),
    category: z.string(),
    expiration: z.string(),
  }),
  vehicle: z.object({
    brand: z.string(),
    model: z.string(),
    year: z.number(),
    licence_plate: z.string(),
  }),
});

const UserSchema = z.discriminatedUnion("user_type", [
  DriverSchema,
  TravelerSchema,
]);

const postUsersController = async (req: Request, res: Response) => {
  try {
    const parsedResult = UserSchema.safeParse(req.body);

    if (!parsedResult.success) {
      return res
        .status(400)
        .json({ error: "invalid_payload", issues: parsedResult.error.message });
    }

    const user = parsedResult.data;
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const query = {
      text: `
        INSERT INTO users (user_type, username, email, hashed_password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, user_type, username, email, created_at
      `,
      values: [
        user.user_type,
        user.username,
        user.email.toLocaleLowerCase().trim(),
        hashedPassword,
      ],
    };

    const result = await database.query(query);
    const created = result.rows[0];

    return res.status(201).json({
      id: created.id,
      username: created.username,
      user_type: created.user_type,
      email: created.email,
      created_at: created.created_at,
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

// TODO: remove getController or change implemetation to avoid data leaking
const getUsersController = async (req: Request, res: Response) => {
  const users = await database.query({ text: "SELECT * from users;" });
  return res.status(200).json(users.rows);
};

export { postUsersController, getUsersController };

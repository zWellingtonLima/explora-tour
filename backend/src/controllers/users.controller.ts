import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as z from "zod";

import database from "infra/database.ts";

const BaseUserSchema = z.object({
  email: z.email(),
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserSchema = z.discriminatedUnion("user_type", [
  DriverSchema,
  TravelerSchema,
]);

// type CreateUserSchema = z.infer<typeof UserSchema>;

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
        INSERT INTO users (user_type, email, hashed_password)
        VALUES ($1, $2, $3)
        RETURNING id, user_type, email, created_at
      `,
      values: [
        user.user_type,
        user.email.toLocaleLowerCase().trim(),
        hashedPassword,
      ],
    };

    const result = await database.query(query);
    const created = result.rows[0];

    return res.status(201).json({
      id: created.id,
      user_type: created.user_type,
      email: created.email,
      created_at: created.created_at,
    });
  } catch (err: any) {
    if (
      err?.code === "24505" ||
      (err?.detail && err.detail.includes("already exists"))
    ) {
      return res.status(409).json({ error: "email_already_taken" });
    }

    console.error("PostUsersController error: ", err);
    return res.status(500).json({ error: "internal_server_error" });
  }
};

export default postUsersController;

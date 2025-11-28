import { Request, Response } from "express";
import * as z from "zod";

import database from "infra/database.ts";

const BaseUserSchema = z.object({
  email: z.email(),
  hashed_password: z.string().min(8),
});

const TravelerSchema = BaseUserSchema.extend({
  user_type: z.literal("traveler"),
  extra_data: z.object({
    latest_travels: z
      .array(
        z.object({
          destination: z.string(),
          date: z.date(),
        }),
      )
      .optional(),
  }),
});

const DriverSchema = BaseUserSchema.extend({
  user_type: z.literal("driver"),
  extra_data: z.object({
    vehicle: z.object({
      brand: z.string(),
      model: z.string(),
      year: z.number(),
      licence_plate: z.string(),
    }),
    driver_licence: z.object({
      number: z.string(),
      category: z.string(),
      expiration: z.string(),
    }),
  }),
});

const userSchema = z.discriminatedUnion("user_type", [
  DriverSchema,
  TravelerSchema,
]);

type CreateUserSchema = z.infer<typeof userSchema>;

const postUsersController = async (req: Request, res: Response) => {
  const createUserData: CreateUserSchema = await req.body;

  // database.query({ })
};

export default postUsersController;

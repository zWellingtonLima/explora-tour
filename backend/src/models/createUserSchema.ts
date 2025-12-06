import * as z from "zod";

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

export const UserSchema = z.discriminatedUnion("user_type", [
  DriverSchema,
  TravelerSchema,
]);

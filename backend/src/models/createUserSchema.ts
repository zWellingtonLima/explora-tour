import * as z from "zod";
import bcrypt from "bcrypt";

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

export type UserType = z.infer<typeof UserSchema>;

async function getHashedPassword(userPassword: string) {
  return await bcrypt.hash(userPassword, 10);
}

export { UserSchema, getHashedPassword };

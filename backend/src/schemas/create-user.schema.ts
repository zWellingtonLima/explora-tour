import { z } from "zod";
import {
  DriverDataSchema,
  TravelerDataSchema,
  UserCoreSchema,
} from "./user.schema.ts";

const CreateBaseSchema = z
  .object({
    email: z.email(),
    username: z.string().min(3),
    password: z.string().min(8),
  })
  .extend(UserCoreSchema.shape);

export const TravelerUserSchema = CreateBaseSchema.extend({
  user_type: z.literal("traveler"),
}).extend(TravelerDataSchema.shape);

export const DriverUserSchema = CreateBaseSchema.extend({
  user_type: z.literal("driver"),
}).extend(DriverDataSchema.shape);

export const UserSchema = z.discriminatedUnion("user_type", [
  DriverUserSchema,
  TravelerUserSchema,
]);

export type User = z.infer<typeof UserSchema>;

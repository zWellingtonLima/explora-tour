import bcrypt from "bcrypt";

import { UserSchema } from "schemas/create-user.schema.ts";
import { UserResponseSchema } from "schemas/user-response.schema.ts";
import { createUser } from "models/user.model.ts";
import { ValidationError } from "errors/Errors.ts";

export async function registerUser(rawInput: unknown) {
  const input = UserSchema.safeParse(rawInput);

  if (!input.success) {
    throw new ValidationError(input.error.issues[0]);
  }

  const { data } = input;

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const extra_data =
    data.user_type === "driver"
      ? { driver_licence: data.driver_licence, vehicle: data.vehicle }
      : {};

  const user = await createUser({
    email: data.email,
    hashed_password: hashedPassword,
    username: data.username,
    user_type: data.user_type,
    extra_data,
  });

  return UserResponseSchema.parse(user);
}

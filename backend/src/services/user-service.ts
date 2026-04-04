import bcrypt from "bcrypt";

import { UserSchema } from "schemas/create-user.schema.ts";
import { UserResponseSchema } from "schemas/user-response.schema.ts";
import { createUser, findUserByEmail } from "models/user.model.ts";
import { LoginValidationError, ValidationError } from "errors/Errors.ts";
import { loginUserSchema, loginUserType } from "schemas/login-user.schema.ts";
import { signAccessToken, signRefreshToken } from "./jwt.service.ts";

async function registerUser(rawInput: unknown) {
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

async function loginUser(user: loginUserType) {
  const userData = await findUserByEmail(user.email);

  if (!userData) {
    throw new LoginValidationError("Email ou senha inválidos");
  }

  const passwordMatch = await bcrypt.compare(
    user.password,
    userData.hashed_password,
  );

  if (!passwordMatch) {
    throw new LoginValidationError("Email ou senha inválidos");
  }

  const accessToken = signAccessToken(userData.id, userData.email);
  const refreshToken = signRefreshToken(userData.id, userData.token_version);

  return { accessToken, refreshToken, user: userData };
}

function validateCredentials(user: loginUserType) {
  const parsed = loginUserSchema.safeParse(user);

  if (!parsed.success) {
    throw new LoginValidationError("Email ou senha inválidos");
  }

  return parsed.data;
}

export { registerUser, loginUser, validateCredentials };

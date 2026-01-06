import { LoginValidationError } from "errors/Errors.ts";
import { LoginUserSchema, LoginUserType } from "schemas/login-user.schema.ts";

function validateCredentials(user: LoginUserType) {
  const parsed = LoginUserSchema.safeParse(user);

  if (!parsed.success) {
    throw new LoginValidationError("Email ou senha inválidos");
  }

  return parsed.data;
}

export default validateCredentials;

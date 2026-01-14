import { LoginValidationError } from "errors/Errors.ts";
import { loginUserSchema, loginUserType } from "schemas/login-user.schema.ts";

function validateCredentials(user: loginUserType) {
  const parsed = loginUserSchema.safeParse(user);

  if (!parsed.success) {
    throw new LoginValidationError("Email ou senha inválidos");
  }

  return parsed.data;
}

export default validateCredentials;

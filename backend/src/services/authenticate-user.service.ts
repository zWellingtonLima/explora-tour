import bcrypt from "bcrypt";

import { LoginValidationError } from "errors/Errors.ts";
import { loginUserType } from "schemas/login-user.schema.ts";
import query from "infra/database/pool.ts";
import { jwtGenerator } from "./jwt-generator.service.ts";

async function authenticateUser(user: loginUserType) {
  const { rows } = await query({
    text: `SELECT id, email, hashed_password FROM users WHERE email=$1 LIMIT 1`,
    values: [user.email.toLowerCase().trim()],
  });
  const userData = rows[0];

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

  return jwtGenerator(userData.id!);
}

export default authenticateUser;

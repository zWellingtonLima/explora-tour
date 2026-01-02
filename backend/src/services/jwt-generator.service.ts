import { envConfig } from "envConfig.ts";
import jwt from "jsonwebtoken";

function jwtGenerator(userId: string) {
  return jwt.sign({ userId }, envConfig.JWT_ACCESS_SECRET, {
    expiresIn: 60 * 60,
  });
}

export default jwtGenerator;

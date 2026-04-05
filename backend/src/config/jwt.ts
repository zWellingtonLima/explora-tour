import { envConfig } from "config/env.ts";

export const JWT_ACCESS_SECRET = envConfig.JWT_ACCESS_SECRET;
export const JWT_EXPIRES_IN = "15m";

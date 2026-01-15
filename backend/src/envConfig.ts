import { z } from "zod";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const env = dotenv.config({ path: ".env.development" });
dotenvExpand.expand(env);

const EnvSchema = z.object({
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  BASE_API_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  SSL: z.boolean(),
});

export const envConfig = EnvSchema.parse(process.env);

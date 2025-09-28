import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({ path: ".env.development" });

const EnvSchema = z.object({
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
});

export const envConfig = EnvSchema.parse(process.env);

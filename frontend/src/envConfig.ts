import { z } from "zod";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const env = dotenv.config({ path: ".env.development" });
dotenvExpand.expand(env);

const EnvSchema = z.object({
  BASE_API_URL: z.string(),
});

export const envConfig = EnvSchema.parse(process.env);

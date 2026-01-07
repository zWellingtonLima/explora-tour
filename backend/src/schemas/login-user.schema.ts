import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type loginUserType = z.infer<typeof loginUserSchema>;

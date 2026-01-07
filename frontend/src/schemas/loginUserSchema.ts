import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(8, "Precisa no mínimo 8 caracteres"),
});

export type loginUserType = z.infer<typeof loginUserSchema>;

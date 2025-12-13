import { z } from "zod";

export const loginAreaSchema = z.object({
  username: z
    .string()
    .max(20, "Seu nome de usuário está muito grande")
    .min(4, "Digite seu nome de usuário"),
  email: z.email("Digite seu email"),
  password: z.string().min(8, { error: "Precisa ter no mínimo 8 caracteres" }),
  userType: z.enum(["traveler", "driver"], {
    error: "Precisa ser ou Viajante ou Motorista",
  }),
});

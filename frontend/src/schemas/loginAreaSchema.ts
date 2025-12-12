import { z } from "zod";

export const loginAreaSchema = z.object({
  username: z.string().max(20, "Seu nome de usuário está muito grande"),
  email: z.email(),
  password: z.string({ error: "Precisa ter no mínimo 8 caracteres" }).min(8),
  userType: z.enum(["traveler", "driver"], {
    error: "Precisa ser ou Viajante ou Motorista",
  }),
});

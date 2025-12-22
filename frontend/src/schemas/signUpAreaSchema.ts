import { z } from "zod";

const BaseUser = z.object({
  email: z.email("Email inválido"),
  username: z
    .string()
    .min(3, "Escreva um nome de usuário com pelo menos 3 letras")
    .max(20, "Seu nome de usuário está muito grande."),
  password: z.string().min(8, "Precisa no mínimo 8 caracteres"),
});

const TravelerSchema = BaseUser.extend({
  user_type: z.literal("traveler"),
});

const DriverSchema = BaseUser.extend({
  user_type: z.literal("driver"),
}).extend({
  driver_licence: z
    .object({
      number: z.string(),
      category: z.string(),
      expiration: z.string(),
    })
    .optional(),
  vehicle: z
    .object({
      brand: z.string(),
      model: z.string(),
      year: z.coerce.number().int(),
      licence_plate: z.string(),
    })
    .optional(),
});

export const signUpSchema = z.discriminatedUnion("user_type", [
  DriverSchema,
  TravelerSchema,
]);

export type signUpSchemaType = z.infer<typeof signUpSchema>;

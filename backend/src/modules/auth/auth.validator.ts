import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "shared/errors/Errors.ts";

// ─── Schemas ──────────────────────────────────────────────────────────────────
const BaseRegisterSchema = z.object({
  name: z.string().min(3).max(40),
  email: z.email(),
  password: z.string().min(8).max(72),
});

const TravelerSchema = BaseRegisterSchema.extend({
  role: z.literal("traveler"),
});

const DriverSchema = BaseRegisterSchema.extend({
  role: z.literal("driver"),
  // campos de driver entram aqui quando forem obrigatórios
});

export const registerSchema = z.discriminatedUnion("role", [
  TravelerSchema,
  DriverSchema,
]);

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

// ─── Factory: cria um middleware de validação para qualquer schema ─────────────

function validate(schema: z.ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const discriminator = firstIssue?.path[0]?.toString() ?? null;

      return next(
        new ValidationError({
          discriminator,
          tree: z.treeifyError(result.error),
        }),
      );
    }

    req.body = result.data;
    next();
  };
}

export const authValidator = {
  register: validate(registerSchema),
  login: validate(loginSchema),
};

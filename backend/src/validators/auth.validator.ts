import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "errors/Errors.ts";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  username: z.string().min(3).max(40),
  email: z.email(),
  password: z.string().min(8).max(72), // bcrypt limita a 72 bytes
  user_type: z.enum(["driver", "traveler"]),
});

const loginSchema = z.object({
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

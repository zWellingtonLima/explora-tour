import { Router } from "express";
import { authenticateToken } from "infra/http/middlewares/auth.middleware.ts";
import authRouter from "modules/auth/auth.router.ts";
import usersRouter from "modules/users/users.router.ts";
import migrationsRouter from "modules/migrations/migrations.router.ts";
import statusRouter from "modules/status/status.router.ts";

const router = Router();

// Públicas
router.use("/auth", authRouter);
router.use("/status", statusRouter);

// Protegidas
router.use("/users", authenticateToken, usersRouter);
router.use("/migrations", authenticateToken, migrationsRouter);

export default router;

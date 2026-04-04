import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorHandler } from "middlewares/errorHandler.ts";
import { authenticateToken } from "middlewares/auth.middleware.ts";
import authRouter from "routes/auth.router.ts";
import usersRouter from "routes/users.router.ts";
import statusRouter from "routes/status.router.ts";
import migrationsRouter from "routes/migrations.router.ts";

const app = express();

app.use(express.json());
app.use(cookieParser()); // req.cookies para o refresh token
app.use(cors({ credentials: true })); // credentials: true → cookies cross-origin
app.use(helmet());
app.use(morgan("dev"));

// ─── Rotas públicas ───────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/status", statusRouter);

// ─── Rotas protegidas (middleware aplicado por grupo) ─────────────────────────
app.use("/api/v1/users", authenticateToken, usersRouter);
app.use("/api/v1/migrations", authenticateToken, migrationsRouter);

// ─── Erro sempre no fim ───────────────────────────────────────────────────────
app.use(errorHandler);

export default app;

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "infra/http/middlewares/errorHandler.ts";
import router from "infra/http/router.ts";
import corsOptions from "config/cors.ts";

const app = express();

app.use(express.json());
app.use(cookieParser()); // req.cookies para o refresh token
app.use(cors(corsOptions));
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

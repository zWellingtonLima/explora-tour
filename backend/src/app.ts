import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import statusRouter from "./routes/status.router.ts";
import migrationsRouter from "routes/migrations.router.ts";
import authRouter from "routes/auth.router.ts";
import usersRouter from "routes/users.router.ts";
import { errorHandler } from "middlewares/errorHandler.ts";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["https://explorertour.vercel.app"],
    credentials: true,
  }),
);

// Security middleware by setting HTTP Headers
app.use(helmet());
app.use(morgan("dev")); // Log the requests

app.use("/api/v1/status", statusRouter);
app.use("/api/v1/migrations", migrationsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);

// Route for production check
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;

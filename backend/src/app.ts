import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import statusRouter from "./routes/status.router.ts";
import migrationsRouter from "routes/migrations.router.ts";

const app = express();

app.use(express.json());
app.use(cors());
// Security middleware by setting HTTP Headers
app.use(helmet());
app.use(morgan("dev")); // Log the requests

app.use("/api/v1/status", statusRouter);
app.use("/api/v1/migrations", migrationsRouter);

export default app;

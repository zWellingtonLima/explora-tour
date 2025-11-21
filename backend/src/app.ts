import express from "express";

import statusRouter from "./routes/status.router.ts";
import migrationsRouter from "routes/migrations.router.ts";

const app = express();

app.use("/api/v1/status", statusRouter);
app.use("/api/v1/migrations", migrationsRouter);

export default app;

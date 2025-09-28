import express from "express";

import statusRouter from "./routes/status.router";
import migrationsRouter from "routes/migrations.router";

const app = express();

app.use("/api/v1/status", statusRouter);
app.use("/api/v1/migrations", migrationsRouter);

export = app;

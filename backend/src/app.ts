import express from "express";

import statusRouter from "./routes/status.router";

const app = express();

app.use("/api/v1/status", statusRouter);

export = app;

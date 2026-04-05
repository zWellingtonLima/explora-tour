import express from "express";

import { migrationsController } from "modules/migrations/migrations.controller.ts";

const migrationsRouter = express.Router();

migrationsRouter.get("/", migrationsController.get);
migrationsRouter.post("/", migrationsController.post);

export default migrationsRouter;

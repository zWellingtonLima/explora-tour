import express from "express";

import { migrationsController } from "controllers/migrations.controller.ts";

const migrationsRouter = express.Router();

migrationsRouter.get("/", migrationsController.getMigrationsController);
migrationsRouter.post("/", migrationsController.postMigrationsController);

export default migrationsRouter;

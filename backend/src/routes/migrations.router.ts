import express from "express";

import migController from "controllers/migrations.controller";

const migrationsRouter = express.Router();

migrationsRouter.get("/", migController.getMigrationsController);
migrationsRouter.post("/", migController.postMigrationsController);

export = migrationsRouter;

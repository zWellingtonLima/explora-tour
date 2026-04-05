// modules/migrations/migrations.controller.ts
import type { Request, Response, NextFunction } from "express";
import { migrationsService } from "./migrations.service.ts";

async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const pending = await migrationsService.getPendingMigrations();
    return res.status(200).json(pending);
  } catch (err) {
    next(err);
  }
}

async function post(req: Request, res: Response, next: NextFunction) {
  try {
    const applied = await migrationsService.applyMigrations();
    console.log(applied);

    const status = applied.length > 0 ? 201 : 200;
    return res.status(status).json(applied);
  } catch (err) {
    next(err);
  }
}

export const migrationsController = { get, post };

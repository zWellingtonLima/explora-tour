import { Request, Response } from "express";

import getMigrations from "models/getMigrations";

const getMigrationsController = async (req: Request, res: Response) => {
  const pendingMigrations = await getMigrations(true);

  return res.status(200).json(pendingMigrations);
};

const postMigrationsController = async (req: Request, res: Response) => {
  const migratedMigrations = await getMigrations(false);

  if (migratedMigrations.length > 0) {
    return res.status(201).json(migratedMigrations);
  }

  return res.status(200).json(migratedMigrations);
};

export = { getMigrationsController, postMigrationsController };

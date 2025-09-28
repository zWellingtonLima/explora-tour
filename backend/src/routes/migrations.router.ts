import express, { Request, Response } from "express";
import { resolve } from "node:path";
import { runner as migrationRunner } from "node-pg-migrate";
import { Client } from "pg";

import database from "infra/database";

const migrationsRouter = express.Router();

migrationsRouter.get("/", async (req: Request, res: Response) => {
  let dbClient: Client | null = null;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      dbClient: dbClient,
      dryRun: true,
      verbose: true,
      dir: resolve("src", "infra", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
    });

    return res.status(200).json(pendingMigrations);
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    await dbClient?.end();
  }
});

migrationsRouter.post("/", async (req: Request, res: Response) => {
  let dbClient: Client | null = null;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      dbClient: dbClient,
      dryRun: false,
      verbose: true,
      dir: resolve("src", "infra", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
    });

    if (migratedMigrations.length > 0) {
      return res.status(201).json(migratedMigrations);
    }

    return res.status(200).json(migratedMigrations);
  } catch (err) {
    console.log("Error: ", err);
    throw err;
  } finally {
    await dbClient?.end();
  }
});

export = migrationsRouter;

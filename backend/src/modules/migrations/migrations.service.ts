import { resolve } from "node:path";
import { runner as migrationRunner } from "node-pg-migrate";
import type { RunnerOption } from "node-pg-migrate";

import client from "infra/database/client.ts";

const migrationPath =
  process.env.NODE_ENV === "production"
    ? resolve("dist", "infra", "migrations")
    : resolve("src", "infra", "migrations");

async function getPendingMigrations() {
  return runMigrations(true);
}

async function applyMigrations() {
  return runMigrations(false);
}

async function runMigrations(dryRun: boolean) {
  const dbClient = await client.getNewClient();
  try {
    return await migrationRunner({
      dbClient,
      dryRun,
      verbose: true,
      dir: migrationPath,
      migrationsTable: "pgmigrations",
      direction: "up",
    } as RunnerOption);
  } catch (err) {
    console.error("[migrations]", err);
    throw err;
  } finally {
    await dbClient.end();
  }
}

export const migrationsService = { getPendingMigrations, applyMigrations };

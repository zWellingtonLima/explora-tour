import { resolve } from "node:path";
import { runner as migrationRunner } from "node-pg-migrate";
import { Client } from "pg";

import database from "infra/database.ts";

const getMigrations = async (dryRun: boolean) => {
  let dbClient: Client | null = null;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      dbClient: dbClient,
      dryRun, //true
      verbose: true,
      dir: resolve("src", "infra", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
    });

    return pendingMigrations;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    await dbClient?.end();
  }
};

export default getMigrations;

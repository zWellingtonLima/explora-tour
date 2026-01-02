import { resolve } from "node:path";
import { runner as migrationRunner } from "node-pg-migrate";
import { Client } from "pg";

import client from "infra/database/client.ts";

const getMigrations = async (dryRun: boolean) => {
  let dbClient: Client | null = null;

  try {
    dbClient = await client.getNewClient();

    const pendingMigrations = await migrationRunner({
      dbClient,
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

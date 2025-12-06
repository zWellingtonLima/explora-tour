import retry from "async-retry";
import { execSync } from "node:child_process";

import database from "infra/database.ts";

async function waitForAllServices() {
  await waitForServer();

  async function waitForServer() {
    return retry(fetchStatusEndpoint, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusEndpoint() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query({
    text: "drop schema public cascade; create schema public;",
  });
}

export async function setupDatabase(truncateTable: boolean) {
  console.log("Running migrations");
  execSync("npm run migrations:up");

  if (truncateTable) {
    await database.query({ text: "TRUNCATE users RESTART IDENTITY CASCADE;" });
  }
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  setupDatabase,
};

export default orchestrator;

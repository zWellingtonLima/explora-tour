import retry from "async-retry";

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

const orchestrator = {
  waitForAllServices,
  clearDatabase,
};

export default orchestrator;

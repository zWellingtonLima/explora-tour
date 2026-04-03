import retry from "async-retry";
import { execSync } from "node:child_process";
import { envConfig } from "envConfig.ts";

export async function setup() {
  await waitForServer();
  runMigrations();
  console.log("\n🟢 Ambiente de testes pronto.");
}

async function waitForServer() {
  process.stdout.write("\n🔴 Aguardando servidor HTTP...");
  await retry(
    async () => {
      const response = await fetch(`${envConfig.BASE_API_URL}/status`);
      if (response.status !== 200) throw new Error("Servidor não pronto");
    },
    { retries: 100, maxTimeout: 1000 },
  );
  console.log("\n🟢 Servidor pronto.");
}

function runMigrations() {
  execSync("npm run migrations:up", { stdio: "inherit" });
}

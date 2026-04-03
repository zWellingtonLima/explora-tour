import { execSync } from "node:child_process";

import client from "infra/database/client.ts";

beforeAll(async () => {
  await client.query({
    text: "drop schema public cascade; create schema public;",
  });
  execSync("npm run migrations:up", { stdio: "pipe" });
  // stdio pipe evita dezenas de linhas de log de migracao por arquivo
});

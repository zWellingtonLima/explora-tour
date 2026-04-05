import type { QueryResultRow } from "pg";

import client from "infra/database/client.ts";
import { envConfig } from "config/env.ts";

const api_url = envConfig.BASE_API_URL;

type UserCredentials = {
  email: string;
  password: string;
};

type DefaultUser = UserCredentials & {
  username: string;
  user_type: "driver" | "traveler";
};

const DEFAULT_USER: DefaultUser = {
  username: "Test User",
  email: "test@example.com",
  password: "password123",
  user_type: "traveler",
};

// Registra o usuário padrão e retorna o accessToken.
// Usar quando o teste precisa de autenticação mas não testa o fluxo de auth.
async function getAuthToken(user: DefaultUser = DEFAULT_USER): Promise<string> {
  const response = await fetch(`${api_url}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(
      `getAuthToken: falhou ao registrar usuário padrão — status ${response.status}`,
    );
  }

  const { data } = await response.json();
  return data.accessToken as string;
}

// Faz login com um usuário já existente no banco.
// Usar quando o teste criou o usuário manualmente e precisa autenticar.
async function loginAs(credentials: UserCredentials): Promise<string> {
  const response = await fetch(`${api_url}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(
      `loginAs: falhou ao autenticar ${credentials.email} — status ${response.status}`,
    );
  }

  const data = await response.json();
  return data.accessToken as string;
}

async function queryDatabase<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values?: unknown[],
) {
  return client.query<T>({ text, values });
}

async function resetDatabaseWithoutMigrations() {
  await client.query({
    text: "drop schema public cascade; create schema public;",
  });
}

const orchestrator = {
  getAuthToken,
  loginAs,
  queryDatabase,
  resetDatabaseWithoutMigrations,
};

export default orchestrator;

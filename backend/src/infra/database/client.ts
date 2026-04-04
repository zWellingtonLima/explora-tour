import { Client, QueryConfig, QueryResultRow } from "pg";
import { envConfig } from "envConfig.ts";

async function query<R extends QueryResultRow = QueryResultRow>(
  queryObject: QueryConfig,
) {
  let client: Client | null = null;
  try {
    client = await getNewClient();
    const result = await client.query<R>(queryObject);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    await client?.end();
  }
}

async function getNewClient() {
  const client = new Client({
    user: envConfig.POSTGRES_USER,
    password: envConfig.POSTGRES_PASSWORD,
    host: envConfig.POSTGRES_HOST,
    port: envConfig.POSTGRES_PORT,
    database: envConfig.POSTGRES_DB,
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });

  await client.connect();
  return client;
}

const client = {
  query,
  getNewClient,
};

export default client;

import { Pool, QueryConfig, QueryResultRow } from "pg";

import { envConfig } from "config/env.ts";

const pool = new Pool({
  user: envConfig.POSTGRES_USER,
  password: envConfig.POSTGRES_PASSWORD,
  host: envConfig.POSTGRES_HOST,
  port: envConfig.POSTGRES_PORT,
  database: envConfig.POSTGRES_DB,
  max: 10,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === "production" ? true : false,
});

async function query<R extends QueryResultRow = QueryResultRow>(
  queryObject: QueryConfig,
) {
  return pool.query<R>(queryObject);
}

export default query;

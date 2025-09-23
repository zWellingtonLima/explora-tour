import { Client, QueryConfig } from "pg";

async function query(queryObject: QueryConfig) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
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
    user: "postgres",
    password: "local_password",
    host: "localhost",
    port: 5432,
    database: "postgres",
  });

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;

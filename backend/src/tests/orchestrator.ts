import database from "infra/database";

async function clearDatabase() {
  await database.query({
    text: "drop schema public cascade; create schema public;",
  });
}

const orchestrator = {
  clearDatabase,
};

export default orchestrator;

import express, { Request, Response } from "express";

import database from "infra/database";

const statusRouter = express.Router();

statusRouter.get("/", async (req: Request, res: Response) => {
  const updatedAt = new Date().toISOString();

  const dbVersionResult = (
    await database.query({ text: "SHOW server_version;" })
  ).rows[0].server_version;

  const dbOpennedConnectionsResult = (
    await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname='postgres';",
    })
  ).rows[0].count;

  const dbMaxConnectionsResult = (
    await database.query({ text: "SHOW max_connections;" })
  ).rows[0].max_connections;

  return res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersionResult,
        max_connections: parseInt(dbMaxConnectionsResult),
        opened_connections: dbOpennedConnectionsResult,
      },
    },
  });
});

export = statusRouter;

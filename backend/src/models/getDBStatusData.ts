import * as z from "zod";

import database from "infra/database.ts";

const GetStatusControllerSchema = z.object({
  updated_at: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: "updated_at must be an ISO date string",
  }),
  dependencies: z.object({
    database: z.object({
      version: z.string(),
      max_connections: z.coerce.number().int().nonnegative(),
      opened_connections: z.coerce.number().int().nonnegative(),
    }),
  }),
});

type getStatusControllerType = z.infer<typeof GetStatusControllerSchema>;

const getStatusData = async (): Promise<getStatusControllerType> => {
  try {
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

    const rawData = {
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: dbVersionResult,
          max_connections: parseInt(dbMaxConnectionsResult),
          opened_connections: dbOpennedConnectionsResult,
        },
      },
    };

    const parsed = GetStatusControllerSchema.safeParse(rawData);

    if (!parsed.success) {
      throw new Error("Validation error building status response");
    }

    return parsed.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`getStatusData failed: ${message}`);
  }
};

export default getStatusData;

import orchestrator from "tests/orchestrator.ts";
import { envConfig } from "envConfig.ts";
const api_url = envConfig.BASE_API_URL;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch(`${api_url}/status`);
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
      expect(parsedUpdatedAt).toEqual(responseBody.updated_at);

      expect(responseBody.dependencies.database.version).toBe("17.6");

      expect(responseBody.dependencies.database.max_connections).toBe(100);
      expect(responseBody.dependencies.database.opened_connections).toBe(1);
    });
  });
});

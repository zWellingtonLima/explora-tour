import orchestrator from "tests/orchestrator.ts";
import { envConfig } from "envConfig.ts";

const api_url = `${envConfig.BASE_API_URL}/migrations`;

describe("GET /api/v1/migrations", () => {
  let token: string;

  beforeAll(async () => {
    token = await orchestrator.getAuthToken();
    await orchestrator.resetDatabaseWithoutMigrations();
  });

  describe("Authenticated user", () => {
    test("Retrieving pending migrations", async () => {
      const response = await fetch(api_url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    test("Returns empty list after all migrations are applied", async () => {
      await fetch(api_url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await fetch(api_url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    test("Rejects unauthenticated request", async () => {
      const response = await fetch(api_url, { method: "GET" });
      expect(response.status).toBe(401);
    });
  });
});

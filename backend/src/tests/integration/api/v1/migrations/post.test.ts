import orchestrator from "tests/orchestrator.ts";
import { envConfig } from "config/env.ts";

const api_url = `${envConfig.BASE_API_URL}/migrations`;

describe("POST /api/v1/migrations", () => {
  let token: string;

  beforeAll(async () => {
    token = await orchestrator.getAuthToken();
    await orchestrator.resetDatabaseWithoutMigrations();
  });

  describe("Authenticated user", () => {
    test("Rejects unauthenticated request", async () => {
      const response = await fetch(api_url, { method: "POST" });
      expect(response.status).toBe(401);
    });

    test("Applies pending migrations and returns them", async () => {
      const response = await fetch(api_url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    test("Returns empty list when no migrations are pending", async () => {
      // estado já tem migrations aplicadas do teste anterior
      const response = await fetch(api_url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });
  });
});

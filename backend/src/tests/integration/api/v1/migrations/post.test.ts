import orchestrator from "tests/orchestrator.ts";
import { envConfig } from "envConfig.ts";
const api_url = envConfig.BASE_API_URL;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", async () => {
      test("For the first time", async () => {
        const response = await fetch(`${api_url}/migrations`, {
          method: "POST",
        });
        expect(response.status).toBe(201);

        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);
      });

      test("For the second time", async () => {
        const response = await fetch(`${api_url}/migrations`, {
          method: "POST",
        });
        expect(response.status).toBe(200);

        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBe(0);
      });
    });
  });
});

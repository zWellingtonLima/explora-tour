import orchestrator from "tests/orchestrator.ts";
import { envConfig } from "envConfig.ts";
const api_url = envConfig.BASE_API_URL;

beforeAll(async () => {
  await orchestrator.setupDatabase(false);
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/users", () => {
  describe("Anonymous user", () => {
    describe("Retrieving an user data", () => {
      test("A traveler username and user_type", async () => {
        const response = await fetch(`${api_url}/users/1`);
        expect(response.status).toBe(200);

        const body = await response.json();
        expect(Object.keys(body)).toEqual(
          expect.arrayContaining(["username", "user_type"]),
        );
        expect(body).toHaveProperty("username", "Jesse Jacinto");
        expect(body).toHaveProperty("user_type", "traveler");
      });
    });
  });
});

//Implement Endpoint feature

import orchestrator from "tests/orchestrator.ts";
import { envConfig } from "envConfig.ts";
const api_url = `${envConfig.BASE_API_URL}/users/1`;
const get_user = "http://localhost:3000/api/v1/users";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.setupDatabase(false);
});

describe("GET /api/v1/users", () => {
  describe("Anonymous user", () => {
    describe("Retrieving an user data", () => {
      test.skip("A traveler username and user_type", async () => {
        const user = {
          user_type: "traveler",
          username: "jesse jacinto",
          email: "traveler@testemail.com",
          password: "travelerpassword",
        };

        await fetch(get_user, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        const response = await fetch(api_url);
        expect(response.status).toBe(200);

        const { data } = await response.json();

        expect(Object.keys(data)).toEqual(
          expect.arrayContaining(["username", "user_type"]),
        );
        expect(data).toHaveProperty("username", "jesse jacinto");
        expect(data).toHaveProperty("user_type", "traveler");
      });
    });
  });
});

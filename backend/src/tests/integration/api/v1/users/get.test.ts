import { envConfig } from "config/env.ts";
const api_url = `${envConfig.BASE_API_URL}/users/1`;
const get_user = "http://localhost:3000/api/v1/users";

describe.skip("GET /api/v1/users", () => {
  describe("Anonymous user", () => {
    describe("Retrieving an user data", () => {
      test.skip("A traveler name and role", async () => {
        const user = {
          role: "traveler",
          name: "jesse jacinto",
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
          expect.arrayContaining(["name", "role"]),
        );
        expect(data).toHaveProperty("name", "jesse jacinto");
        expect(data).toHaveProperty("role", "traveler");
      });
    });
  });
});

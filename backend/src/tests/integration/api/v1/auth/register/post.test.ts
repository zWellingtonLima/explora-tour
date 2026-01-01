import query from "infra/database/pool.ts";
import orchestrator from "tests/orchestrator.ts";
import { envConfig } from "envConfig.ts";

const api_url = `${envConfig.BASE_API_URL}/auth/register`;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.setupDatabase(true);
});

describe("POST /api/v1", () => {
  describe("Anonymous user", () => {
    describe("Creating an user", () => {
      test("A traveler user successfully", async () => {
        const user = {
          user_type: "traveler",
          username: "jesse jacinto",
          email: "traveler@testemail.com",
          password: "travelerpassword",
        };

        const response = await fetch(api_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        expect(response.status).toBe(201);

        const { data } = await response.json();
        expect(Object.keys(data)).toEqual(
          expect.arrayContaining(["id", "username", "email", "user_type"]),
        );

        expect(data).toHaveProperty("id");
        expect(data).toHaveProperty("email", "traveler@testemail.com");
        expect(data).toHaveProperty("username", "jesse jacinto");
        expect(data).toHaveProperty("user_type", "traveler");
        expect(data).not.toHaveProperty("password");
        expect(data).not.toHaveProperty("hashed_password");
      });

      test("An user_type not allowed", async () => {
        const driverWithoudRequiredInfo = {
          user_type: "admin",
          username: "Hacker",
          email: "user@withouthinfo.com",
          password: "12345678aa",
        };

        const response = await fetch(api_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(driverWithoudRequiredInfo),
        });

        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.error).toHaveProperty("message", "Validation error");
        expect(body.error.details).toHaveProperty("discriminator", "user_type");
      });
    });

    describe("Creating user with duplicate email", async () => {
      const user = {
        user_type: "traveler",
        username: "Someone",
        email: "duplicate@test.com",
        password: "password123",
      };

      test("Rejects duplicate email", async () => {
        await fetch(api_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        const response = await fetch(api_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        expect(response.status).toBe(409);
        const { error } = await response.json();
        expect(error.code).toEqual("EMAIL_ALREADY_REGISTERED");
      });
    });

    describe("Checking correct password hashing", () => {
      test("Is password stored hashed", async () => {
        const checkHashedPassUser = {
          user_type: "traveler",
          username: "Check Hash",
          email: "hash@test.com",
          password: "secretpass123",
        };

        const response = await fetch(api_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(checkHashedPassUser),
        });

        expect(response.status).toBe(201);

        const result = await query({
          text: "SELECT hashed_password FROM users WHERE email = $1;",
          values: ["hash@test.com"],
        });

        const hash = result.rows[0].hashed_password;
        expect(hash).not.toBe(checkHashedPassUser.password);
        expect(hash.length).toBeGreaterThan(20);
      });
    });
  });
});

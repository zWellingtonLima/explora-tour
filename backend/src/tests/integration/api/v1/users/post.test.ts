import database from "infra/database.ts";
import orchestrator from "tests/orchestrator.ts";
import { envConfig } from "envConfig.ts";
const api_url = envConfig.BASE_API_URL;

beforeAll(async () => {
  await orchestrator.setupDatabase(true);
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    describe("Creating an user", () => {
      test("A traveler user successfully", async () => {
        const user = {
          user_type: "traveler",
          username: "Jesse Jacinto",
          email: "traveler@testemail.com",
          password: "travelerpassword",
        };

        const response = await fetch(`${api_url}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        expect(response.status).toBe(201);

        const body = await response.json();
        expect(Object.keys(body)).toEqual(
          expect.arrayContaining(["id", "username", "email", "user_type"]),
        );

        expect(body).toHaveProperty("id");
        expect(body).toHaveProperty("email", "traveler@testemail.com");
        expect(body).toHaveProperty("username", "Jesse Jacinto");
        expect(body).toHaveProperty("user_type", "traveler");
        expect(body).not.toHaveProperty("password");
        expect(body).not.toHaveProperty("hashed_password");
      });

      test("A driver without vehicle and licence required", async () => {
        const driverWithoudRequiredInfo = {
          user_type: "driver",
          username: "Bad Driver",
          email: "driver@withouthinfo.com",
          password: "12345678",
        };

        const response = await fetch(`${api_url}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(driverWithoudRequiredInfo),
        });

        expect(response.status).toBe(400);
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
        await fetch(`${api_url}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        const response = await fetch(`${api_url}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        expect(response.status).toBe(409);
        const body = await response.json();
        expect(body).toEqual({ error: "email_already_taken" });
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

        const response = await fetch(`${api_url}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(checkHashedPassUser),
        });

        expect(response.status).toBe(201);

        const result = await database.query({
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

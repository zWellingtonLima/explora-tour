import query from "infra/database/pool.ts";
import { envConfig } from "config/env.ts";

const api_url = `${envConfig.BASE_API_URL}/auth/register`;

const createUser = {
  role: "traveler",
  name: "Jesse Jacinto",
  email: "traveler@testemail.com",
  password: "travelerpassword",
};

describe("POST /api/v1/auth/register", () => {
  describe(`User: ${createUser.name}`, () => {
    describe("Creating an user", () => {
      test(`A "${createUser.role}" user successfully`, async () => {
        const response = await fetch(api_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createUser),
        });
        expect(response.status).toBe(201);

        const { data } = await response.json();

        expect(data).toHaveProperty("accessToken");
        expect(typeof data.accessToken).toBe("string");
        expect(data).not.toHaveProperty("password");
        expect(data).not.toHaveProperty("password_hash");
      });

      test("A role not allowed", async () => {
        const driverWithoudRequiredInfo = {
          role: "admin",
          name: "Hacker",
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
        expect(body.error.details).toHaveProperty("discriminator", "role");
      });
    });

    describe("Creating user with duplicate email", () => {
      const user = {
        role: "traveler",
        name: "Someone",
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
        expect(error.code).toEqual("CONFLICT");
      });
    });

    describe("Checking correct password hashing", () => {
      test("Is password stored hashed", async () => {
        const checkHashedPassUser = {
          role: "traveler",
          name: "Check Hash",
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
          text: "SELECT password_hash FROM users WHERE email = $1;",
          values: ["hash@test.com"],
        });

        const hash = result.rows[0].password_hash;
        expect(hash).not.toBe(checkHashedPassUser.password);
        expect(hash.length).toBeGreaterThan(20);
      });
    });
  });
});

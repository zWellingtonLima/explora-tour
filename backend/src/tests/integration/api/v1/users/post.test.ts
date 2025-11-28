import orchestrator from "tests/orchestrator.ts";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("Posting an User", async () => {
      const mockUser = {
        user_type: "traveler",
        email: "test@email.com",
        password: "testpassword",
      };

      const request = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
        body: mockUser
      });

      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();
    });
  });
});

import database from "infra/database";

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Should return 200 status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      // const responseBody = await response.json();

      console.log(await database.query({ text: "SELECT 1 + 1;" }));

      expect(response.status).toBe(200);
    });
  });
});

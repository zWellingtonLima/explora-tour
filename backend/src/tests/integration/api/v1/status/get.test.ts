describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Should return 200 status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      // const responseBody = await response.json();

      expect(response.status).toBe(200);
    });
  });
});

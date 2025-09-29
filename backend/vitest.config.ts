import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    hookTimeout: 30000,
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
  },
});

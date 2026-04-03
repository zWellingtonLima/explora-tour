import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    globalSetup: "src/tests/global-setup.ts",
    setupFiles: ["src/tests/setup-file.ts"],
    include: ["src/tests/**/*.test.ts"],
    fileParallelism: false,
    env: { NODE_ENV: "development" },
  },
});

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import prettierPlugin from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    extends: [prettierPlugin],
  },
  {
    basePath: "backend",
    files: ["**/*.{ts, js}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  {
    basePath: "frontend",
    files: ["**/*.{ts, js, tsx, jsx}"],
    plugins: { pluginReact, js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
]);

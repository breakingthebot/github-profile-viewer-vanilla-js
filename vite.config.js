/**
 * File: vite.config.js
 * Purpose: Configures Vite and scopes Vitest to unit-style tests instead of browser end-to-end specs.
 * Connects to: package.json, tests/services/*.test.js, tests/utils/*.test.js
 * Created: 2026-06-27
 */

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    exclude: [
      "tests/e2e/**",
      "node_modules/**",
      "dist/**",
    ],
  },
});

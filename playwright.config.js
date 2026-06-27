/**
 * File: playwright.config.js
 * Purpose: Configures Playwright end-to-end test execution for the built local app.
 * Connects to: tests/e2e/*.spec.js, package.json
 * Created: 2026-06-27
 */

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 1,
  reporter: "list",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});

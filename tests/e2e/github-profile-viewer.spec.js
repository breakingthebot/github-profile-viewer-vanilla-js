/**
 * File: tests/e2e/github-profile-viewer.spec.js
 * Purpose: Verifies the core GitHub profile viewer flow in a real browser with mocked GitHub API responses.
 * Connects to: playwright.config.js, tests/e2e/fixtures/githubApiFixtures.js
 * Created: 2026-06-27
 */

import { expect, test } from "@playwright/test";
import { startStaticServer } from "../../scripts/static-server.js";
import { getGithubFixture } from "./fixtures/githubApiFixtures.js";

let staticServer;

/**
 * Stubs GitHub API requests used by the app.
 *
 * @param {import("@playwright/test").Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when routes are registered.
 */
async function mockGithubApi(page) {
  await page.route("https://api.github.com/users/**", async (route) => {
    const requestUrl = new URL(route.request().url());
    const [, , username, resource] = requestUrl.pathname.split("/");

    if (!username) {
      await route.abort();
      return;
    }

    const fixture = getGithubFixture(
      username,
      resource === "repos" ? "repos" : resource === "events" ? "events" : "profile",
    );

    if (!fixture) {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ message: "Not Found" }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(fixture),
    });
  });
}

test.describe("GitHub profile viewer", () => {
  test.beforeAll(async () => {
    staticServer = await startStaticServer();
  });

  test.afterAll(async () => {
    await staticServer?.stop();
  });

  /**
   * Verifies a user search, repository filtering, and URL state persistence.
   *
   * @returns {Promise<void>}
   */
  test("loads a profile, filters repositories, and persists state in the URL", async ({ page }) => {
    await mockGithubApi(page);
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "The Octocat" })).toBeVisible();

    await page.getByLabel("Search repositories").fill("docs");
    await page.getByLabel("Language").selectOption("TypeScript");
    await page.getByLabel("Sort by").selectOption("stars");

    await expect(page.getByRole("link", { name: "docs-site" })).toBeVisible();
    await expect(page.getByRole("link", { name: "api-service" })).toHaveCount(0);
    await expect(page).toHaveURL(/user=octocat/);
    await expect(page).toHaveURL(/repoQuery=docs/);
    await expect(page).toHaveURL(/language=TypeScript/);
    await expect(page).toHaveURL(/sort=stars/);

    await page.reload();

    await expect(page.getByRole("link", { name: "docs-site" })).toBeVisible();
    await expect(page.getByLabel("Search repositories")).toHaveValue("docs");
  });

  /**
   * Verifies browser navigation and the empty recent-activity state.
   *
   * @returns {Promise<void>}
   */
  test("rehydrates state from browser history and shows the no-activity message", async ({ page }) => {
    await mockGithubApi(page);
    await page.goto("/");

    await page.getByLabel("Load a public GitHub account").fill("vercel");
    await page.getByRole("button", { name: "Load profile" }).click();

    await expect(page.getByRole("heading", { name: "Vercel" })).toBeVisible();
    await expect(page.getByText("No recent public activity available.")).toBeVisible();

    await page.goBack();

    await expect(page.getByRole("heading", { name: "The Octocat" })).toBeVisible();
    await expect(page).toHaveURL(/user=octocat/);
  });

  /**
   * Verifies retry-friendly network error messaging.
   *
   * @returns {Promise<void>}
   */
  test("shows retry guidance when the GitHub API is unavailable", async ({ page }) => {
    await page.route("https://api.github.com/users/**", async (route) => {
      await route.abort("failed");
    });

    await page.goto("/");

    await expect(page.getByText("Unable to reach the GitHub API.")).toBeVisible();
    await expect(page.getByText("Check your internet connection or try again in a moment.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry request" })).toBeVisible();
  });
});

/**
 * File: tests/services/githubApi.test.js
 * Purpose: Verifies username sanitization and GitHub API error handling.
 * Connects to: src/services/githubApi.js
 * Created: 2026-06-27
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { GithubError } from "../../src/models/githubError.js";
import {
  createGithubHeaders,
  fetchGithubResource,
  sanitizeUsername,
} from "../../src/services/githubApi.js";

describe("sanitizeUsername", () => {
  /**
   * Verifies trimming and valid username handling.
   *
   * @returns {void}
   */
  it("returns a trimmed username for valid input", () => {
    expect(sanitizeUsername(" octocat ")).toBe("octocat");
  });

  /**
   * Verifies empty input rejection.
   *
   * @returns {void}
   */
  it("throws for an empty username", () => {
    expect(() => sanitizeUsername("   ")).toThrow("Enter a GitHub username.");
  });

  /**
   * Verifies invalid username rejection.
   *
   * @returns {void}
   */
  it("throws for invalid characters", () => {
    expect(() => sanitizeUsername("octo cat")).toThrow("Use a valid GitHub username.");
  });
});

describe("createGithubHeaders", () => {
  /**
   * Verifies the Accept header is always present.
   *
   * @returns {void}
   */
  it("includes the GitHub accept header", () => {
    expect(createGithubHeaders()).toMatchObject({
      Accept: "application/vnd.github+json",
    });
  });
});

describe("fetchGithubResource", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Verifies 404 responses become user-facing not-found errors.
   *
   * @returns {Promise<void>}
   */
  it("throws a not-found error for 404 responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    );

    await expect(fetchGithubResource("/users/missing")).rejects.toMatchObject({
      message: "GitHub user not found.",
      code: "not_found",
    });
  });

  /**
   * Verifies network failures become retryable GitHub errors.
   *
   * @returns {Promise<void>}
   */
  it("throws a retryable network error when fetch rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(fetchGithubResource("/users/octocat")).rejects.toMatchObject({
      message: "Unable to reach the GitHub API.",
      code: "network",
      retryable: true,
    });
  });

  /**
   * Verifies successful responses are parsed.
   *
   * @returns {Promise<void>}
   */
  it("returns parsed json for successful responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ login: "octocat" }),
      }),
    );

    await expect(fetchGithubResource("/users/octocat")).resolves.toEqual({ login: "octocat" });
  });
});

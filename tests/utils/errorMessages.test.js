/**
 * File: tests/utils/errorMessages.test.js
 * Purpose: Verifies user-facing status content for normalized GitHub errors.
 * Connects to: src/utils/errorMessages.js
 * Created: 2026-06-27
 */

import { describe, expect, it } from "vitest";
import { GithubError } from "../../src/models/githubError.js";
import { createStatusContentFromError } from "../../src/utils/errorMessages.js";

describe("createStatusContentFromError", () => {
  /**
   * Verifies rate-limit guidance is user friendly.
   *
   * @returns {void}
   */
  it("returns detail and retry copy for rate-limited requests", () => {
    expect(
      createStatusContentFromError(
        new GithubError({
          message: "GitHub API rate limit reached.",
          code: "rate_limited",
          retryable: true,
        }),
      ),
    ).toEqual({
      message: "GitHub API rate limit reached.",
      detail: "Add VITE_GITHUB_TOKEN in your local .env file to raise the API limit for development.",
      actionLabel: "Retry request",
    });
  });
});

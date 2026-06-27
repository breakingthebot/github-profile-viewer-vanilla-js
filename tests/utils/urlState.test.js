/**
 * File: tests/utils/urlState.test.js
 * Purpose: Verifies URL-state parsing and serialization for shareable app state.
 * Connects to: src/utils/urlState.js
 * Created: 2026-06-27
 */

import { describe, expect, it } from "vitest";
import { createUrlStateSearch, parseUrlState } from "../../src/utils/urlState.js";

describe("parseUrlState", () => {
  /**
   * Verifies URL params are normalized into app state.
   *
   * @returns {void}
   */
  it("parses user and repository explorer params", () => {
    expect(
      parseUrlState("?user=octocat&repoQuery=docs&language=JavaScript&sort=stars", "fallback"),
    ).toEqual({
      username: "octocat",
      repositoryExplorerState: {
        query: "docs",
        language: "JavaScript",
        sort: "stars",
      },
    });
  });

  /**
   * Verifies invalid usernames fall back safely.
   *
   * @returns {void}
   */
  it("falls back when the username is invalid", () => {
    expect(parseUrlState("?user=bad%20name", "octocat").username).toBe("octocat");
  });
});

describe("createUrlStateSearch", () => {
  /**
   * Verifies compact URL serialization.
   *
   * @returns {void}
   */
  it("omits default repository explorer values", () => {
    expect(
      createUrlStateSearch({
        username: "octocat",
        repositoryExplorerState: {
          query: "",
          language: "all",
          sort: "updated",
        },
      }),
    ).toBe("user=octocat");
  });

  /**
   * Verifies non-default values are included.
   *
   * @returns {void}
   */
  it("serializes non-default repository explorer values", () => {
    expect(
      createUrlStateSearch({
        username: "octocat",
        repositoryExplorerState: {
          query: "api",
          language: "TypeScript",
          sort: "stars",
        },
      }),
    ).toBe("user=octocat&repoQuery=api&language=TypeScript&sort=stars");
  });
});

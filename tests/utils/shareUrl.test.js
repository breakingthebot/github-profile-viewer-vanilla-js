/**
 * File: tests/utils/shareUrl.test.js
 * Purpose: Verifies absolute share-link generation for the current app state.
 * Connects to: src/utils/shareUrl.js
 * Created: 2026-06-27
 */

import { describe, expect, it } from "vitest";
import { createShareUrl } from "../../src/utils/shareUrl.js";

describe("createShareUrl", () => {
  /**
   * Verifies the current route and shareable state are preserved in the copied URL.
   *
   * @returns {void}
   */
  it("creates an absolute share URL with serialized app state", () => {
    expect(
      createShareUrl("https://example.com/app?old=value#anchor", {
        username: "octocat",
        repositoryExplorerState: {
          query: "docs",
          language: "TypeScript",
          sort: "stars",
        },
      }),
    ).toBe("https://example.com/app?user=octocat&repoQuery=docs&language=TypeScript&sort=stars");
  });
});

/**
 * File: tests/utils/formatters.test.js
 * Purpose: Verifies GitHub data formatting helpers.
 * Connects to: src/utils/formatters.js
 * Created: 2026-06-27
 */

import { describe, expect, it } from "vitest";
import { formatCount, formatDate, formatEventLabel } from "../../src/utils/formatters.js";

describe("formatCount", () => {
  /**
   * Verifies compact number formatting.
   *
   * @returns {void}
   */
  it("formats numbers in compact notation", () => {
    expect(formatCount(1400)).toBe("1.4K");
  });
});

describe("formatDate", () => {
  /**
   * Verifies date formatting for valid ISO input.
   *
   * @returns {void}
   */
  it("formats ISO dates into a readable value", () => {
    expect(formatDate("2026-06-27T00:00:00.000Z")).toBe("Jun 27, 2026");
  });
});

describe("formatEventLabel", () => {
  /**
   * Verifies known GitHub event label formatting.
   *
   * @returns {void}
   */
  it("formats push events into readable labels", () => {
    expect(
      formatEventLabel({
        type: "PushEvent",
        repo: { name: "octocat/hello-world" },
      }),
    ).toBe("Pushed commits to octocat/hello-world");
  });
});

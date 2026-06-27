/**
 * File: tests/utils/formatters.test.js
 * Purpose: Verifies GitHub data formatting helpers.
 * Connects to: src/utils/formatters.js
 * Created: 2026-06-27
 */

import { describe, expect, it } from "vitest";
import {
  formatCount,
  formatDate,
  formatDateTime,
  formatEventLabel,
  formatEventType,
} from "../../src/utils/formatters.js";

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

describe("formatDateTime", () => {
  /**
   * Verifies date-time formatting for valid ISO input.
   *
   * @returns {void}
   */
  it("formats ISO timestamps into a readable value", () => {
    expect(formatDateTime("2026-06-27T12:30:00.000Z")).toContain("Jun 27, 2026");
  });
});

describe("formatEventType", () => {
  /**
   * Verifies readable event type formatting.
   *
   * @returns {void}
   */
  it("formats camel-cased event names", () => {
    expect(formatEventType("PullRequestEvent")).toBe("Pull Request");
  });
});

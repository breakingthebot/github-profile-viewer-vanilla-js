/**
 * File: tests/utils/activitySummary.test.js
 * Purpose: Verifies activity summary helpers for grouped counts, active days, and top repositories.
 * Connects to: src/utils/activitySummary.js
 * Created: 2026-06-27
 */

import { describe, expect, it } from "vitest";
import { countActiveDays, getTopActivityRepository, summarizeEventTypes } from "../../src/utils/activitySummary.js";

const events = [
  {
    type: "PushEvent",
    created_at: "2026-06-27T12:00:00.000Z",
    repo: { name: "octocat/api" },
  },
  {
    type: "PushEvent",
    created_at: "2026-06-27T15:00:00.000Z",
    repo: { name: "octocat/api" },
  },
  {
    type: "WatchEvent",
    created_at: "2026-06-26T08:30:00.000Z",
    repo: { name: "octocat/site" },
  },
];

describe("countActiveDays", () => {
  /**
   * Verifies unique UTC day counting.
   *
   * @returns {void}
   */
  it("counts distinct active days", () => {
    expect(countActiveDays(events)).toBe(2);
  });
});

describe("summarizeEventTypes", () => {
  /**
   * Verifies grouped event counts sorted by frequency.
   *
   * @returns {void}
   */
  it("groups and sorts event types by count", () => {
    expect(summarizeEventTypes(events)).toEqual([
      { type: "PushEvent", count: 2 },
      { type: "WatchEvent", count: 1 },
    ]);
  });
});

describe("getTopActivityRepository", () => {
  /**
   * Verifies repository activity ranking.
   *
   * @returns {void}
   */
  it("returns the most frequently referenced repository", () => {
    expect(getTopActivityRepository(events)).toBe("octocat/api");
  });
});

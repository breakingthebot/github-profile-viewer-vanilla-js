/**
 * File: tests/utils/repositoryFilters.test.js
 * Purpose: Verifies repository search, sorting, language options, and summary metrics.
 * Connects to: src/utils/repositoryFilters.js
 * Created: 2026-06-27
 */

import { describe, expect, it } from "vitest";
import {
  buildLanguageOptions,
  buildRepositoryMetrics,
  filterRepositories,
  sortRepositories,
} from "../../src/utils/repositoryFilters.js";

const repositories = [
  {
    name: "zeta-app",
    description: "TypeScript dashboard",
    language: "TypeScript",
    stargazers_count: 12,
    forks_count: 4,
    updated_at: "2026-06-20T12:00:00.000Z",
  },
  {
    name: "alpha-api",
    description: "Node service",
    language: "JavaScript",
    stargazers_count: 42,
    forks_count: 8,
    updated_at: "2026-06-25T12:00:00.000Z",
  },
  {
    name: "docs",
    description: "Project writing",
    language: null,
    stargazers_count: 2,
    forks_count: 1,
    updated_at: "2026-06-10T12:00:00.000Z",
  },
];

describe("buildLanguageOptions", () => {
  /**
   * Verifies distinct language option generation.
   *
   * @returns {void}
   */
  it("returns sorted language options with an all option first", () => {
    expect(buildLanguageOptions(repositories)).toEqual(["all", "JavaScript", "TypeScript"]);
  });
});

describe("filterRepositories", () => {
  /**
   * Verifies query matching against name and description.
   *
   * @returns {void}
   */
  it("filters by query", () => {
    expect(filterRepositories(repositories, { query: "service", language: "all" })).toEqual([
      repositories[1],
    ]);
  });

  /**
   * Verifies language matching.
   *
   * @returns {void}
   */
  it("filters by language", () => {
    expect(filterRepositories(repositories, { query: "", language: "TypeScript" })).toEqual([
      repositories[0],
    ]);
  });
});

describe("sortRepositories", () => {
  /**
   * Verifies star-based sorting.
   *
   * @returns {void}
   */
  it("sorts by stars descending", () => {
    expect(sortRepositories(repositories, "stars").map((repository) => repository.name)).toEqual([
      "alpha-api",
      "zeta-app",
      "docs",
    ]);
  });
});

describe("buildRepositoryMetrics", () => {
  /**
   * Verifies summary metric calculations.
   *
   * @returns {void}
   */
  it("builds summary metrics from visible repositories", () => {
    expect(buildRepositoryMetrics(repositories, [repositories[0], repositories[1]])).toEqual({
      visibleCount: 2,
      totalCount: 3,
      totalStars: 54,
      topRepositoryName: "alpha-api",
      languageCount: 2,
    });
  });
});

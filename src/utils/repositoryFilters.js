/**
 * File: src/utils/repositoryFilters.js
 * Purpose: Provides pure helpers for repository search, filtering, sorting, and summary metrics.
 * Connects to: src/models/repositoryExplorer.js, tests/utils/repositoryFilters.test.js
 * Created: 2026-06-27
 */

/**
 * Builds language options from a repository collection.
 *
 * @param {Array<object>} repositories - Repository collection.
 * @returns {Array<string>} Distinct language options.
 */
export function buildLanguageOptions(repositories) {
  const uniqueLanguages = new Set();

  repositories.forEach((repository) => {
    if (repository.language) {
      uniqueLanguages.add(repository.language);
    }
  });

  return ["all", ...Array.from(uniqueLanguages).sort((first, second) => first.localeCompare(second))];
}

/**
 * Filters repositories by query and language.
 *
 * @param {Array<object>} repositories - Repository collection.
 * @param {{query?: string, language?: string}} filters - Active repository filters.
 * @returns {Array<object>} Filtered repositories.
 */
export function filterRepositories(repositories, filters = {}) {
  const normalizedQuery = typeof filters.query === "string" ? filters.query.trim().toLowerCase() : "";
  const normalizedLanguage = typeof filters.language === "string" ? filters.language : "all";

  return repositories.filter((repository) => {
    const matchesQuery =
      !normalizedQuery ||
      repository.name.toLowerCase().includes(normalizedQuery) ||
      (repository.description ?? "").toLowerCase().includes(normalizedQuery);

    const matchesLanguage =
      normalizedLanguage === "all" || repository.language === normalizedLanguage;

    return matchesQuery && matchesLanguage;
  });
}

/**
 * Sorts repositories by the selected sort order.
 *
 * @param {Array<object>} repositories - Repository collection.
 * @param {string} sortOrder - Selected sort order.
 * @returns {Array<object>} Sorted repositories.
 */
export function sortRepositories(repositories, sortOrder) {
  const sortedRepositories = [...repositories];

  const sortMap = {
    name: (first, second) => first.name.localeCompare(second.name),
    stars: (first, second) => second.stargazers_count - first.stargazers_count,
    updated: (first, second) => new Date(second.updated_at) - new Date(first.updated_at),
  };

  const sortComparator = sortMap[sortOrder] ?? sortMap.updated;

  return sortedRepositories.sort(sortComparator);
}

/**
 * Builds repository summary metrics for the explorer header.
 *
 * @param {Array<object>} allRepositories - Full repository collection.
 * @param {Array<object>} visibleRepositories - Filtered repository collection.
 * @returns {{visibleCount: number, totalCount: number, totalStars: number, topRepositoryName: string, languageCount: number}} Repository summary metrics.
 */
export function buildRepositoryMetrics(allRepositories, visibleRepositories) {
  const totalStars = visibleRepositories.reduce(
    (starCount, repository) => starCount + (repository.stargazers_count ?? 0),
    0,
  );

  const topRepository = sortRepositories(visibleRepositories, "stars")[0];

  return {
    visibleCount: visibleRepositories.length,
    totalCount: allRepositories.length,
    totalStars,
    topRepositoryName: topRepository?.name ?? "None",
    languageCount: buildLanguageOptions(visibleRepositories).filter((language) => language !== "all").length,
  };
}

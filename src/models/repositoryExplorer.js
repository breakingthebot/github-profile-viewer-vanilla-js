/**
 * File: src/models/repositoryExplorer.js
 * Purpose: Builds a view model for repository search, filtering, sorting, and summary metrics.
 * Connects to: src/main.js, src/utils/repositoryFilters.js, src/components/repositoryExplorer.js
 * Created: 2026-06-27
 */

import { APP_CONFIG } from "../config/appConfig.js";
import {
  buildLanguageOptions,
  buildRepositoryMetrics,
  filterRepositories,
  sortRepositories,
} from "../utils/repositoryFilters.js";

/**
 * Creates the initial repository explorer state.
 *
 * @returns {{query: string, language: string, sort: string}} Initial explorer state.
 */
export function createInitialRepositoryExplorerState() {
  return {
    query: "",
    language: "all",
    sort: APP_CONFIG.defaultRepositorySort,
  };
}

/**
 * Normalizes repository explorer state from an unknown input source.
 *
 * @param {Partial<{query: string, language: string, sort: string}> | null | undefined} state - Raw repository explorer state.
 * @returns {{query: string, language: string, sort: string}} Normalized explorer state.
 */
export function normalizeRepositoryExplorerState(state) {
  const initialState = createInitialRepositoryExplorerState();
  const supportedSorts = new Set(["updated", "stars", "name"]);

  return {
    query: typeof state?.query === "string" ? state.query.trim() : initialState.query,
    language:
      typeof state?.language === "string" && state.language.trim() ? state.language.trim() : initialState.language,
    sort:
      typeof state?.sort === "string" && supportedSorts.has(state.sort)
        ? state.sort
        : initialState.sort,
  };
}

/**
 * Builds the repository explorer model consumed by the UI.
 *
 * @param {Array<object>} repositories - Raw repository list.
 * @param {{query: string, language: string, sort: string}} state - Current explorer state.
 * @returns {{repositories: Array<object>, languageOptions: Array<string>, metrics: object, state: object}} Explorer view model.
 */
export function createRepositoryExplorerModel(repositories, state) {
  const filteredRepositories = filterRepositories(repositories, state);
  const sortedRepositories = sortRepositories(filteredRepositories, state.sort);

  return {
    repositories: sortedRepositories,
    languageOptions: buildLanguageOptions(repositories),
    metrics: buildRepositoryMetrics(repositories, sortedRepositories),
    state,
  };
}

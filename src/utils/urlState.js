/**
 * File: src/utils/urlState.js
 * Purpose: Reads and writes shareable URL state for the selected user and repository explorer controls.
 * Connects to: src/main.js, src/models/repositoryExplorer.js, tests/utils/urlState.test.js
 * Created: 2026-06-27
 */

import { sanitizeUsername } from "../services/githubApi.js";
import { normalizeRepositoryExplorerState } from "../models/repositoryExplorer.js";

/**
 * Builds a normalized application state object from a URL search string.
 *
 * @param {string} search - URL search string.
 * @param {string} fallbackUsername - Username to use when the URL is empty or invalid.
 * @returns {{username: string, repositoryExplorerState: {query: string, language: string, sort: string}}} Parsed URL state.
 */
export function parseUrlState(search, fallbackUsername) {
  const searchParams = new URLSearchParams(search);
  const rawUsername = searchParams.get("user");

  let username = fallbackUsername;

  if (rawUsername) {
    try {
      username = sanitizeUsername(rawUsername);
    } catch {
      username = fallbackUsername;
    }
  }

  return {
    username,
    repositoryExplorerState: normalizeRepositoryExplorerState({
      query: searchParams.get("repoQuery") ?? "",
      language: searchParams.get("language") ?? "all",
      sort: searchParams.get("sort") ?? undefined,
    }),
  };
}

/**
 * Creates a URL search string for the current application state.
 *
 * @param {{username: string, repositoryExplorerState: {query: string, language: string, sort: string}}} state - App state to serialize.
 * @returns {string} Serialized URL search string.
 */
export function createUrlStateSearch(state) {
  const searchParams = new URLSearchParams();
  const normalizedState = normalizeRepositoryExplorerState(state.repositoryExplorerState);
  const username = sanitizeUsername(state.username);

  searchParams.set("user", username);

  if (normalizedState.query) {
    searchParams.set("repoQuery", normalizedState.query);
  }

  if (normalizedState.language !== "all") {
    searchParams.set("language", normalizedState.language);
  }

  if (normalizedState.sort !== "updated") {
    searchParams.set("sort", normalizedState.sort);
  }

  return searchParams.toString();
}

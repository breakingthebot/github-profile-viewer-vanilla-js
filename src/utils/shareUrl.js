/**
 * File: src/utils/shareUrl.js
 * Purpose: Builds absolute share URLs for the current GitHub profile viewer state.
 * Connects to: src/main.js, src/utils/urlState.js, tests/utils/shareUrl.test.js
 * Created: 2026-06-27
 */

import { createUrlStateSearch } from "./urlState.js";

/**
 * Creates an absolute share URL for the current app state.
 *
 * @param {string} currentUrl - Current browser URL.
 * @param {{username: string, repositoryExplorerState: {query: string, language: string, sort: string}}} state - Serializable app state.
 * @returns {string} Absolute share URL.
 */
export function createShareUrl(currentUrl, state) {
  const nextUrl = new URL(currentUrl);

  nextUrl.search = createUrlStateSearch(state);
  nextUrl.hash = "";

  return nextUrl.toString();
}

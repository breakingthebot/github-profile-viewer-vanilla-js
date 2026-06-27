/**
 * File: src/components/repositoryControls.js
 * Purpose: Renders repository search and filter controls.
 * Connects to: src/components/repositoryExplorer.js, src/main.js
 * Created: 2026-06-27
 */

import { escapeHtml } from "../utils/sanitizers.js";

/**
 * Creates repository control markup.
 *
 * @param {{query: string, language: string, sort: string}} state - Current repository explorer state.
 * @param {Array<string>} languageOptions - Available language filters.
 * @returns {string} Repository controls markup.
 */
export function renderRepositoryControls(state, languageOptions) {
  const languageOptionsMarkup = languageOptions
    .map(
      (language) => `
        <option value="${escapeHtml(language)}" ${state.language === language ? "selected" : ""}>
          ${language === "all" ? "All languages" : escapeHtml(language)}
        </option>
      `,
    )
    .join("");

  return `
    <div class="repository-controls">
      <label class="repository-controls__field">
        <span>Search repositories</span>
        <input
          class="repository-controls__input"
          type="search"
          name="repository-query"
          value="${escapeHtml(state.query)}"
          placeholder="Filter by name or description"
          data-repository-query
        />
      </label>
      <label class="repository-controls__field">
        <span>Language</span>
        <select class="repository-controls__select" name="repository-language" data-repository-language>
          ${languageOptionsMarkup}
        </select>
      </label>
      <label class="repository-controls__field">
        <span>Sort by</span>
        <select class="repository-controls__select" name="repository-sort" data-repository-sort>
          <option value="updated" ${state.sort === "updated" ? "selected" : ""}>Recently updated</option>
          <option value="stars" ${state.sort === "stars" ? "selected" : ""}>Stars</option>
          <option value="name" ${state.sort === "name" ? "selected" : ""}>Name</option>
        </select>
      </label>
    </div>
  `;
}

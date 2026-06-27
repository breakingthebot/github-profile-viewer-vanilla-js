/**
 * File: src/components/repositoryList.js
 * Purpose: Renders the repository list section.
 * Connects to: src/main.js, src/utils/formatters.js
 * Created: 2026-06-27
 */

import { formatCount, formatDate } from "../utils/formatters.js";

/**
 * Creates the markup for a repository list.
 *
 * @param {Array<object>} repositories - GitHub repositories.
 * @returns {string} Repository list markup.
 */
export function renderRepositoryList(repositories) {
  const repositoryItems = repositories.length
    ? repositories
        .map(
          (repository) => `
            <li class="repository-list__item">
              <a class="repository-list__name" href="${repository.html_url}" target="_blank" rel="noreferrer">
                ${repository.name}
              </a>
              <p class="repository-list__description">${repository.description ?? "No description provided."}</p>
              <div class="repository-list__meta">
                <span>★ ${formatCount(repository.stargazers_count)}</span>
                <span>${repository.language ?? "Unknown language"}</span>
                <span>Updated ${formatDate(repository.updated_at)}</span>
              </div>
            </li>
          `,
        )
        .join("")
    : `<li class="repository-list__item repository-list__item--empty">No repositories available.</li>`;

  return `
    <section class="panel">
      <div class="panel__header">
        <h3>Recent repositories</h3>
      </div>
      <ul class="repository-list">${repositoryItems}</ul>
    </section>
  `;
}

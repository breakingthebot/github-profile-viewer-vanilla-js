/**
 * File: src/components/repositoryList.js
 * Purpose: Renders the repository list items for the repository explorer.
 * Connects to: src/components/repositoryExplorer.js, src/utils/formatters.js
 * Created: 2026-06-27
 */

import { formatCount, formatDate } from "../utils/formatters.js";
import { escapeHtml, sanitizeUrl } from "../utils/sanitizers.js";

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
          (repository) => {
            const repositoryUrl = sanitizeUrl(repository.html_url);

            return `
            <li class="repository-list__item">
              <div class="repository-list__topline">
                <a class="repository-list__name" href="${repositoryUrl}" target="_blank" rel="noreferrer">
                  ${escapeHtml(repository.name)}
                </a>
                <span class="repository-list__language">${escapeHtml(repository.language ?? "Unknown language")}</span>
              </div>
              <p class="repository-list__description">${escapeHtml(repository.description ?? "No description provided.")}</p>
              <div class="repository-list__meta">
                <span>Stars ${formatCount(repository.stargazers_count)}</span>
                <span>Forks ${formatCount(repository.forks_count)}</span>
                <span>Updated ${formatDate(repository.updated_at)}</span>
              </div>
            </li>
          `;
          },
        )
        .join("")
    : `<li class="repository-list__item repository-list__item--empty">No repositories available.</li>`;

  return `
    <ul
      aria-label="Visible repositories"
      class="repository-list"
      data-repository-list
    >
      ${repositoryItems}
    </ul>
  `;
}

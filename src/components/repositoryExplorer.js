/**
 * File: src/components/repositoryExplorer.js
 * Purpose: Composes repository controls, insights, and the repository list into one panel.
 * Connects to: src/components/repositoryControls.js, src/components/repositoryInsights.js, src/components/repositoryList.js
 * Created: 2026-06-27
 */

import { renderRepositoryControls } from "./repositoryControls.js";
import { renderRepositoryInsights } from "./repositoryInsights.js";
import { renderRepositoryList } from "./repositoryList.js";

/**
 * Creates repository explorer markup.
 *
 * @param {{repositories: Array<object>, languageOptions: Array<string>, metrics: object, state: object}} explorer - Repository explorer view model.
 * @returns {string} Repository explorer markup.
 */
export function renderRepositoryExplorer(explorer) {
  return `
    <section class="panel">
      <div class="panel__header panel__header--stacked">
        <div>
          <p class="panel__eyebrow">Repositories</p>
          <h3>Repository explorer</h3>
          <p class="panel__copy">Search, sort, and filter the latest public repositories for this account.</p>
        </div>
      </div>
      ${renderRepositoryControls(explorer.state, explorer.languageOptions)}
      ${renderRepositoryInsights(explorer.metrics)}
      ${renderRepositoryList(explorer.repositories)}
    </section>
  `;
}

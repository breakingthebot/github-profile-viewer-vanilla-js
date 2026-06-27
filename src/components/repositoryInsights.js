/**
 * File: src/components/repositoryInsights.js
 * Purpose: Renders repository summary metrics alongside the repository explorer.
 * Connects to: src/components/repositoryExplorer.js, src/utils/formatters.js
 * Created: 2026-06-27
 */

import { formatCount } from "../utils/formatters.js";
import { escapeHtml } from "../utils/sanitizers.js";

/**
 * Creates repository insights markup.
 *
 * @param {{visibleCount: number, totalCount: number, totalStars: number, topRepositoryName: string, languageCount: number}} metrics - Repository summary metrics.
 * @returns {string} Repository insights markup.
 */
export function renderRepositoryInsights(metrics) {
  return `
    <dl class="repository-insights">
      <div class="repository-insights__item">
        <dt>Visible repos</dt>
        <dd>${formatCount(metrics.visibleCount)} / ${formatCount(metrics.totalCount)}</dd>
      </div>
      <div class="repository-insights__item">
        <dt>Total stars</dt>
        <dd>${formatCount(metrics.totalStars)}</dd>
      </div>
      <div class="repository-insights__item">
        <dt>Languages</dt>
        <dd>${formatCount(metrics.languageCount)}</dd>
      </div>
      <div class="repository-insights__item">
        <dt>Top repo</dt>
        <dd>${escapeHtml(metrics.topRepositoryName)}</dd>
      </div>
    </dl>
  `;
}

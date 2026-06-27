/**
 * File: src/components/activityBreakdown.js
 * Purpose: Renders grouped public-activity counts by event type.
 * Connects to: src/components/activityPanel.js, src/utils/formatters.js, src/utils/sanitizers.js
 * Created: 2026-06-27
 */

import { formatCount, formatEventType } from "../utils/formatters.js";
import { escapeHtml } from "../utils/sanitizers.js";

/**
 * Creates activity breakdown markup.
 *
 * @param {Array<{type: string, count: number}>} eventTypes - Grouped activity counts.
 * @returns {string} Activity breakdown markup.
 */
export function renderActivityBreakdown(eventTypes) {
  const breakdownItems = eventTypes.length
    ? eventTypes
        .map(
          (eventType) => `
            <li class="activity-breakdown__item">
              <span>${escapeHtml(formatEventType(eventType.type))}</span>
              <strong>${formatCount(eventType.count)}</strong>
            </li>
          `,
        )
        .join("")
    : `<li class="activity-breakdown__item activity-breakdown__item--empty">No activity types to summarize yet.</li>`;

  return `
    <section class="activity-breakdown">
      <div class="panel__header panel__header--stacked">
        <div>
          <h3>Activity breakdown</h3>
          <p class="panel__copy">Recent public event counts grouped by activity type.</p>
        </div>
      </div>
      <ul class="activity-breakdown__list">${breakdownItems}</ul>
    </section>
  `;
}

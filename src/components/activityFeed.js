/**
 * File: src/components/activityFeed.js
 * Purpose: Renders the recent public activity feed.
 * Connects to: src/main.js, src/utils/formatters.js
 * Created: 2026-06-27
 */

import { formatDate, formatEventLabel } from "../utils/formatters.js";

/**
 * Creates the markup for the activity feed.
 *
 * @param {Array<object>} events - GitHub public events.
 * @returns {string} Activity feed markup.
 */
export function renderActivityFeed(events) {
  const activityItems = events.length
    ? events
        .map(
          (event) => `
            <li class="activity-feed__item">
              <p class="activity-feed__title">${formatEventLabel(event)}</p>
              <p class="activity-feed__date">${formatDate(event.created_at)}</p>
            </li>
          `,
        )
        .join("")
    : `<li class="activity-feed__item activity-feed__item--empty">No recent public activity available.</li>`;

  return `
    <section class="panel">
      <div class="panel__header">
        <h3>Recent activity</h3>
      </div>
      <ul class="activity-feed">${activityItems}</ul>
    </section>
  `;
}

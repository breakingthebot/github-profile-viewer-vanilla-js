/**
 * File: src/components/activityFeed.js
 * Purpose: Renders the recent public activity feed list.
 * Connects to: src/components/activityPanel.js, src/utils/formatters.js
 * Created: 2026-06-27
 */

import { formatDate, formatEventLabel } from "../utils/formatters.js";
import { escapeHtml } from "../utils/sanitizers.js";

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
              <p class="activity-feed__title">${escapeHtml(formatEventLabel(event))}</p>
              <p class="activity-feed__date">${formatDate(event.created_at)}</p>
            </li>
          `,
        )
        .join("")
    : `
      <li class="activity-feed__item activity-feed__item--empty">
        <p class="activity-feed__title">No recent public activity available.</p>
        <p class="activity-feed__date">Try another account or check back after this user has new public events.</p>
      </li>
    `;

  return `<ul class="activity-feed">${activityItems}</ul>`;
}

/**
 * File: src/components/activityPanel.js
 * Purpose: Composes activity insights, grouped counts, and the recent activity feed.
 * Connects to: src/components/activityBreakdown.js, src/components/activityFeed.js, src/components/activityInsights.js
 * Created: 2026-06-27
 */

import { renderActivityBreakdown } from "./activityBreakdown.js";
import { renderActivityFeed } from "./activityFeed.js";
import { renderActivityInsights } from "./activityInsights.js";

/**
 * Creates the full activity panel markup.
 *
 * @param {{events: Array<object>, metrics: object, eventTypes: Array<object>, hasEvents: boolean}} activity - Activity insights model.
 * @returns {string} Activity panel markup.
 */
export function renderActivityPanel(activity) {
  return `
    <section
      class="panel"
      aria-describedby="activity-panel-copy"
      aria-labelledby="activity-panel-title"
      data-results-panel="activity"
    >
      <div class="panel__header panel__header--stacked">
        <div>
          <p class="panel__eyebrow">Activity</p>
          <h3 id="activity-panel-title">Recent activity</h3>
          <p class="panel__copy" id="activity-panel-copy">
            ${
              activity.hasEvents
                ? "Recent public events pulled from the GitHub API."
                : "This account has no recent public events available through the GitHub API."
            }
          </p>
        </div>
      </div>
      ${renderActivityInsights(activity.metrics)}
      ${renderActivityBreakdown(activity.eventTypes)}
      ${renderActivityFeed(activity.events)}
    </section>
  `;
}

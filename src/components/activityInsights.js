/**
 * File: src/components/activityInsights.js
 * Purpose: Renders high-level summary metrics for recent public activity.
 * Connects to: src/components/activityPanel.js, src/utils/formatters.js, src/utils/sanitizers.js
 * Created: 2026-06-27
 */

import { formatCount, formatDateTime, formatEventType } from "../utils/formatters.js";
import { escapeHtml } from "../utils/sanitizers.js";

/**
 * Creates activity insight metric markup.
 *
 * @param {{totalEvents: number, activeDays: number, topRepositoryName: string, latestEvent: object | null}} metrics - Activity insight metrics.
 * @returns {string} Activity insights markup.
 */
export function renderActivityInsights(metrics) {
  const latestEventType = metrics.latestEvent?.type ? formatEventType(metrics.latestEvent.type) : "No activity";
  const latestEventTime = metrics.latestEvent?.created_at ? formatDateTime(metrics.latestEvent.created_at) : "No recent timestamp";

  return `
    <dl class="activity-insights">
      <div class="activity-insights__item">
        <dt>Total events</dt>
        <dd>${formatCount(metrics.totalEvents)}</dd>
      </div>
      <div class="activity-insights__item">
        <dt>Active days</dt>
        <dd>${formatCount(metrics.activeDays)}</dd>
      </div>
      <div class="activity-insights__item">
        <dt>Top repository</dt>
        <dd>${escapeHtml(metrics.topRepositoryName)}</dd>
      </div>
      <div class="activity-insights__item">
        <dt>Latest event</dt>
        <dd>${escapeHtml(latestEventType)}</dd>
        <p class="activity-insights__note">${escapeHtml(latestEventTime)}</p>
      </div>
    </dl>
  `;
}

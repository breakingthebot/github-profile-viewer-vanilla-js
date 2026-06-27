/**
 * File: src/models/activityInsights.js
 * Purpose: Normalizes recent public activity into a UI-ready insight model.
 * Connects to: src/main.js, src/utils/activitySummary.js, src/components/activityPanel.js
 * Created: 2026-06-27
 */

import { countActiveDays, getTopActivityRepository, summarizeEventTypes } from "../utils/activitySummary.js";

/**
 * Builds the activity insights model consumed by the activity panel.
 *
 * @param {Array<object>} events - GitHub public events.
 * @returns {{events: Array<object>, metrics: object, eventTypes: Array<object>, hasEvents: boolean}} Activity insight model.
 */
export function createActivityInsightsModel(events) {
  const eventTypes = summarizeEventTypes(events);
  const latestEvent = events[0] ?? null;

  return {
    events,
    eventTypes,
    hasEvents: events.length > 0,
    metrics: {
      totalEvents: events.length,
      activeDays: countActiveDays(events),
      topRepositoryName: getTopActivityRepository(events),
      latestEvent,
    },
  };
}

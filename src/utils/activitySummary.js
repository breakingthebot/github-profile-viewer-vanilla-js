/**
 * File: src/utils/activitySummary.js
 * Purpose: Builds summary insights from recent GitHub public activity events.
 * Connects to: src/models/activityInsights.js, tests/utils/activitySummary.test.js
 * Created: 2026-06-27
 */

/**
 * Counts distinct UTC calendar days represented in the event list.
 *
 * @param {Array<object>} events - GitHub public events.
 * @returns {number} Distinct active day count.
 */
export function countActiveDays(events) {
  const activeDays = new Set(
    events
      .map((event) => (typeof event.created_at === "string" ? event.created_at.slice(0, 10) : ""))
      .filter(Boolean),
  );

  return activeDays.size;
}

/**
 * Groups activity events by GitHub event type.
 *
 * @param {Array<object>} events - GitHub public events.
 * @returns {Array<{type: string, count: number}>} Sorted activity counts by type.
 */
export function summarizeEventTypes(events) {
  const countsByType = new Map();

  events.forEach((event) => {
    const eventType = event?.type ?? "UnknownEvent";
    countsByType.set(eventType, (countsByType.get(eventType) ?? 0) + 1);
  });

  return Array.from(countsByType.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((first, second) => second.count - first.count || first.type.localeCompare(second.type));
}

/**
 * Returns the repository name that appears most often in the event list.
 *
 * @param {Array<object>} events - GitHub public events.
 * @returns {string} Most frequently referenced repository name.
 */
export function getTopActivityRepository(events) {
  const countsByRepository = new Map();

  events.forEach((event) => {
    const repositoryName = event?.repo?.name;

    if (repositoryName) {
      countsByRepository.set(repositoryName, (countsByRepository.get(repositoryName) ?? 0) + 1);
    }
  });

  return Array.from(countsByRepository.entries()).sort(
    (first, second) => second[1] - first[1] || first[0].localeCompare(second[0]),
  )[0]?.[0] ?? "No repository activity";
}

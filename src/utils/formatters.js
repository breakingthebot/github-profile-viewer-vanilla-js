/**
 * File: src/utils/formatters.js
 * Purpose: Formats GitHub data for presentation.
 * Connects to: src/components/profileCard.js, src/components/repositoryList.js, src/components/activityFeed.js
 * Created: 2026-06-27
 */

/**
 * Formats a numeric value using compact notation.
 *
 * @param {number | null | undefined} value - Numeric value to format.
 * @returns {string} Human-readable number string.
 */
export function formatCount(value) {
  const safeValue = typeof value === "number" ? value : 0;

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(safeValue);
}

/**
 * Formats an ISO date string into a readable date.
 *
 * @param {string | null | undefined} value - Date string to format.
 * @returns {string} Human-readable date string.
 */
export function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

/**
 * Formats an ISO date string into a readable date and time.
 *
 * @param {string | null | undefined} value - Date string to format.
 * @returns {string} Human-readable date and time string.
 */
export function formatDateTime(value) {
  if (!value) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(value));
}

/**
 * Formats a GitHub event type into a readable label.
 *
 * @param {string | null | undefined} eventType - GitHub event type.
 * @returns {string} Human-readable event type.
 */
export function formatEventType(eventType) {
  if (!eventType) {
    return "Unknown activity";
  }

  return eventType.replace(/Event$/, "").replace(/([a-z])([A-Z])/g, "$1 $2");
}

/**
 * Builds a readable activity label from a GitHub event payload.
 *
 * @param {object} event - GitHub public event.
 * @returns {string} Human-readable activity label.
 */
export function formatEventLabel(event) {
  if (!event?.type) {
    return "GitHub activity";
  }

  const repoName = event.repo?.name ?? "a repository";
  const actionMap = {
    PushEvent: `Pushed commits to ${repoName}`,
    WatchEvent: `Starred ${repoName}`,
    CreateEvent: `Created ${repoName}`,
    IssuesEvent: `Updated issues in ${repoName}`,
    PullRequestEvent: `Worked on pull requests in ${repoName}`,
  };

  return actionMap[event.type] ?? `${formatEventType(event.type)} in ${repoName}`;
}

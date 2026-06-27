/**
 * File: src/utils/logger.js
 * Purpose: Provides small structured logging helpers for browser-side diagnostics.
 * Connects to: src/main.js, src/services/githubApi.js
 * Created: 2026-06-27
 */

/**
 * Logs an informational message with structured context.
 *
 * @param {string} eventName - Event label for the log.
 * @param {object} context - Additional log context.
 * @returns {void}
 */
export function logInfo(eventName, context = {}) {
  console.info(JSON.stringify({ level: "INFO", eventName, context }));
}

/**
 * Logs an error message with structured context.
 *
 * @param {string} eventName - Event label for the log.
 * @param {object} context - Additional log context.
 * @returns {void}
 */
export function logError(eventName, context = {}) {
  console.error(JSON.stringify({ level: "ERROR", eventName, context }));
}

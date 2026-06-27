/**
 * File: src/config/env.js
 * Purpose: Reads and sanitizes Vite environment variables for the app.
 * Connects to: src/config/appConfig.js, src/services/githubApi.js, src/main.js
 * Created: 2026-06-27
 */

/**
 * Returns a trimmed environment variable or an empty string.
 *
 * @param {string | undefined} value - Raw environment variable value.
 * @returns {string} Sanitized environment variable value.
 */
export function sanitizeEnvValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

export const ENV_CONFIG = {
  githubToken: sanitizeEnvValue(import.meta.env.VITE_GITHUB_TOKEN),
  defaultUsername: sanitizeEnvValue(import.meta.env.VITE_DEFAULT_USERNAME),
};

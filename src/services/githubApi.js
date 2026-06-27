/**
 * File: src/services/githubApi.js
 * Purpose: Fetches GitHub profile, repository, and activity data from the GitHub API.
 * Connects to: src/config/appConfig.js, src/config/env.js, src/main.js
 * Created: 2026-06-27
 */

import { APP_CONFIG } from "../config/appConfig.js";
import { ENV_CONFIG } from "../config/env.js";
import { logInfo, logError } from "../utils/logger.js";

const USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/;

/**
 * Sanitizes a GitHub username and rejects invalid values.
 *
 * @param {string} username - User-provided GitHub username.
 * @returns {string} Sanitized username.
 * @throws {Error} When the username is empty or invalid.
 */
export function sanitizeUsername(username) {
  const sanitizedUsername = typeof username === "string" ? username.trim() : "";

  if (!sanitizedUsername) {
    throw new Error("Enter a GitHub username.");
  }

  if (!USERNAME_PATTERN.test(sanitizedUsername)) {
    throw new Error("Use a valid GitHub username.");
  }

  return sanitizedUsername;
}

/**
 * Builds request headers for GitHub API calls.
 *
 * @returns {HeadersInit} HTTP headers for GitHub API requests.
 */
export function createGithubHeaders() {
  return ENV_CONFIG.githubToken
    ? {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${ENV_CONFIG.githubToken}`,
      }
    : {
        Accept: "application/vnd.github+json",
      };
}

/**
 * Fetches a single GitHub API resource and handles common API errors.
 *
 * @param {string} path - Relative GitHub API path.
 * @returns {Promise<unknown>} Parsed JSON response.
 * @throws {Error} When the request fails.
 */
export async function fetchGithubResource(path) {
  const response = await fetch(`${APP_CONFIG.apiBaseUrl}${path}`, {
    headers: createGithubHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("GitHub user not found.");
    }

    if (response.status === 403) {
      throw new Error("GitHub API rate limit reached. Add a token and try again.");
    }

    throw new Error(`GitHub request failed with status ${response.status}.`);
  }

  return response.json();
}

/**
 * Fetches a user's profile, repositories, and recent public events in parallel.
 *
 * @param {string} username - GitHub username to fetch.
 * @returns {Promise<{profile: object, repositories: Array<object>, events: Array<object>}>} Aggregated GitHub data.
 */
export async function fetchGithubProfileBundle(username) {
  const sanitizedUsername = sanitizeUsername(username);

  logInfo("github.fetch.start", { username: sanitizedUsername });

  try {
    const [profile, repositories, events] = await Promise.all([
      fetchGithubResource(`/users/${sanitizedUsername}`),
      fetchGithubResource(`/users/${sanitizedUsername}/repos?sort=updated&per_page=8`),
      fetchGithubResource(`/users/${sanitizedUsername}/events/public?per_page=6`),
    ]);

    logInfo("github.fetch.success", {
      username: sanitizedUsername,
      repositories: repositories.length,
      events: events.length,
    });

    return { profile, repositories, events };
  } catch (error) {
    logError("github.fetch.failure", {
      username: sanitizedUsername,
      message: error instanceof Error ? error.message : "Unknown error",
    });

    throw error;
  }
}

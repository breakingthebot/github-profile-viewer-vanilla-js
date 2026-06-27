/**
 * File: src/config/appConfig.js
 * Purpose: Centralizes static application configuration values.
 * Connects to: src/main.js, src/services/githubApi.js
 * Created: 2026-06-27
 */

export const APP_CONFIG = {
  apiBaseUrl: "https://api.github.com",
  defaultUsername: "octocat",
  maxReposToShow: 24,
  maxEventsToShow: 6,
  defaultRepositorySort: "updated",
};

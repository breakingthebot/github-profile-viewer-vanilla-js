/**
 * File: src/utils/errorMessages.js
 * Purpose: Maps normalized GitHub errors into richer UI status panel content.
 * Connects to: src/main.js, src/components/statusPanel.js, tests/utils/errorMessages.test.js
 * Created: 2026-06-27
 */

import { GithubError } from "../models/githubError.js";

/**
 * Builds UI-facing status data from an unknown error.
 *
 * @param {unknown} error - Unknown application error.
 * @returns {{message: string, detail: string, actionLabel: string}} UI-ready error content.
 */
export function createStatusContentFromError(error) {
  if (error instanceof GithubError) {
    const contentMap = {
      invalid_username: {
        message: error.message,
        detail: "Usernames can include letters, numbers, and hyphens only.",
        actionLabel: "Try another username",
      },
      not_found: {
        message: error.message,
        detail: "Check the spelling and make sure the account is public.",
        actionLabel: "Search again",
      },
      rate_limited: {
        message: error.message,
        detail: "Add VITE_GITHUB_TOKEN in your local .env file to raise the API limit for development.",
        actionLabel: "Retry request",
      },
      network: {
        message: error.message,
        detail: "Check your internet connection or try again in a moment.",
        actionLabel: "Retry request",
      },
      request_failed: {
        message: error.message,
        detail: "GitHub returned an unexpected response. Try again shortly.",
        actionLabel: "Retry request",
      },
    };

    return contentMap[error.code] ?? {
      message: error.message,
      detail: "Something went wrong while loading the profile.",
      actionLabel: "Retry request",
    };
  }

  return {
    message: "Unable to load profile.",
    detail: "Something unexpected happened while loading the requested account.",
    actionLabel: "Retry request",
  };
}

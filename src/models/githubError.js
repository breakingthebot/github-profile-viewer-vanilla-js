/**
 * File: src/models/githubError.js
 * Purpose: Defines a normalized GitHub error shape for UI-friendly handling.
 * Connects to: src/services/githubApi.js, src/main.js
 * Created: 2026-06-27
 */

/**
 * Structured error for GitHub API and network failures.
 */
export class GithubError extends Error {
  /**
   * Creates a normalized GitHub error.
   *
   * @param {{message: string, code: string, retryable?: boolean}} options - Error details.
   */
  constructor({ message, code, retryable = false }) {
    super(message);
    this.name = "GithubError";
    this.code = code;
    this.retryable = retryable;
  }
}

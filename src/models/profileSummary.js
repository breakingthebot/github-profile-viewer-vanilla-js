/**
 * File: src/models/profileSummary.js
 * Purpose: Normalizes GitHub API responses into a view-friendly shape.
 * Connects to: src/main.js, src/components/*
 * Created: 2026-06-27
 */

import { APP_CONFIG } from "../config/appConfig.js";

/**
 * Creates a normalized profile view model from GitHub API payloads.
 *
 * @param {object} payload - Raw GitHub API payloads.
 * @param {object} payload.profile - User profile data.
 * @param {Array<object>} payload.repositories - Repository data.
 * @param {Array<object>} payload.events - Public event data.
 * @returns {object} Normalized view model.
 */
export function createProfileSummary({ profile, repositories, events }) {
  return {
    profile,
    repositories: repositories.slice(0, APP_CONFIG.maxReposToShow),
    events: events.slice(0, APP_CONFIG.maxEventsToShow),
  };
}

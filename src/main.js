/**
 * File: src/main.js
 * Purpose: Boots the app, handles user interactions, and coordinates data loading and rendering.
 * Connects to: src/components/*, src/config/*, src/models/*, src/services/githubApi.js
 * Created: 2026-06-27
 */

import "./styles/main.css";
import { renderActivityPanel } from "./components/activityPanel.js";
import { renderProfileCard } from "./components/profileCard.js";
import { renderRepositoryExplorer } from "./components/repositoryExplorer.js";
import { renderSearchForm } from "./components/searchForm.js";
import { renderStatusPanel } from "./components/statusPanel.js";
import { APP_CONFIG } from "./config/appConfig.js";
import { ENV_CONFIG } from "./config/env.js";
import { createProfileSummary } from "./models/profileSummary.js";
import { createActivityInsightsModel } from "./models/activityInsights.js";
import {
  createInitialRepositoryExplorerState,
  createRepositoryExplorerModel,
  normalizeRepositoryExplorerState,
} from "./models/repositoryExplorer.js";
import { fetchGithubProfileBundle } from "./services/githubApi.js";
import { logError, logInfo } from "./utils/logger.js";
import { createUrlStateSearch, parseUrlState } from "./utils/urlState.js";

const appRoot = document.querySelector("#app");
const fallbackUsername = ENV_CONFIG.defaultUsername || APP_CONFIG.defaultUsername;
const initialUrlState = parseUrlState(window.location.search, fallbackUsername);
const initialUsername = initialUrlState.username;
let currentSummary = null;
let currentUsername = initialUsername;
let repositoryExplorerState = initialUrlState.repositoryExplorerState;

/**
 * Renders the static application shell.
 *
 * @returns {void}
 */
function renderShell() {
  appRoot.innerHTML = `
    <main class="app-shell">
      <section class="hero">
        <p class="hero__eyebrow">Async GitHub API Viewer</p>
        <h1 class="hero__title">Explore profiles, repos, and public activity.</h1>
        <p class="hero__copy">
          Search for any public GitHub account and review the profile summary, recently updated repositories,
          and recent public activity in one place.
        </p>
      </section>
      ${renderSearchForm(initialUsername)}
      <section data-status-region></section>
      <section data-results-region></section>
    </main>
  `;
}

/**
 * Returns the app regions used during updates.
 *
 * @returns {{statusRegion: HTMLElement, resultsRegion: HTMLElement, form: HTMLFormElement, input: HTMLInputElement}} App DOM references.
 */
function getAppRegions() {
  return {
    statusRegion: document.querySelector("[data-status-region]"),
    resultsRegion: document.querySelector("[data-results-region]"),
    form: document.querySelector("[data-search-form]"),
    input: document.querySelector("#username"),
  };
}

/**
 * Updates the search input to match the current username state.
 *
 * @param {string} username - Username to display in the search input.
 * @returns {void}
 */
function syncSearchInput(username) {
  const { input } = getAppRegions();

  if (input) {
    input.value = username;
  }
}

/**
 * Writes the current app state into the browser URL.
 *
 * @param {"replace" | "push"} mode - History update mode.
 * @returns {void}
 */
function syncUrlState(mode = "replace") {
  const search = createUrlStateSearch({
    username: currentUsername,
    repositoryExplorerState,
  });
  const nextUrl = `${window.location.pathname}?${search}`;

  if (mode === "push") {
    window.history.pushState(null, "", nextUrl);
    return;
  }

  window.history.replaceState(null, "", nextUrl);
}

/**
 * Updates the status panel region.
 *
 * @param {string} variant - Status type.
 * @param {string} message - Status message.
 * @returns {void}
 */
function updateStatus(variant, message) {
  const { statusRegion } = getAppRegions();
  statusRegion.innerHTML = renderStatusPanel(variant, message);
}

/**
 * Clears the current status panel.
 *
 * @returns {void}
 */
function clearStatus() {
  const { statusRegion } = getAppRegions();
  statusRegion.innerHTML = "";
}

/**
 * Renders the fetched GitHub data.
 *
 * @param {object} summary - Normalized summary payload.
 * @returns {void}
 */
function renderResults(summary) {
  const { resultsRegion } = getAppRegions();
  const repositoryExplorer = createRepositoryExplorerModel(summary.repositories, repositoryExplorerState);
  const activityInsights = createActivityInsightsModel(summary.events);

  resultsRegion.innerHTML = `
    ${renderProfileCard(summary.profile)}
    <section class="content-grid">
      ${renderRepositoryExplorer(repositoryExplorer)}
      <div class="side-column">
        ${renderActivityPanel(activityInsights)}
      </div>
    </section>
  `;

  registerRepositoryExplorerControls();
}

/**
 * Handles repository explorer input changes and re-renders the current results.
 *
 * @returns {void}
 */
function registerRepositoryExplorerControls() {
  const repositoryQueryInput = document.querySelector("[data-repository-query]");
  const repositoryLanguageSelect = document.querySelector("[data-repository-language]");
  const repositorySortSelect = document.querySelector("[data-repository-sort]");

  if (!repositoryQueryInput || !repositoryLanguageSelect || !repositorySortSelect || !currentSummary) {
    return;
  }

  repositoryQueryInput.addEventListener("input", (event) => {
    repositoryExplorerState = normalizeRepositoryExplorerState({
      ...repositoryExplorerState,
      query: event.target.value,
    });
    syncUrlState();
    renderResults(currentSummary);
  });

  repositoryLanguageSelect.addEventListener("change", (event) => {
    repositoryExplorerState = normalizeRepositoryExplorerState({
      ...repositoryExplorerState,
      language: event.target.value,
    });
    syncUrlState();
    renderResults(currentSummary);
  });

  repositorySortSelect.addEventListener("change", (event) => {
    repositoryExplorerState = normalizeRepositoryExplorerState({
      ...repositoryExplorerState,
      sort: event.target.value,
    });
    syncUrlState();
    renderResults(currentSummary);
  });
}

/**
 * Loads GitHub data and updates the UI state.
 *
 * @param {string} username - GitHub username to load.
 * @param {{historyMode?: "replace" | "push"}} options - Load behavior options.
 * @returns {Promise<void>} Resolves when rendering completes.
 */
async function loadProfile(username, options = {}) {
  updateStatus("loading", `Loading ${username}...`);

  try {
    currentUsername = username;
    const profileBundle = await fetchGithubProfileBundle(username);
    const summary = createProfileSummary(profileBundle);
    currentSummary = summary;
    syncSearchInput(summary.profile.login);
    currentUsername = summary.profile.login;
    syncUrlState(options.historyMode ?? "replace");
    clearStatus();
    renderResults(summary);
    logInfo("ui.render.success", { username: currentUsername });
  } catch (error) {
    updateStatus("error", error instanceof Error ? error.message : "Unable to load profile.");
    logError("ui.render.failure", {
      username,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * Wires the search form submit handler.
 *
 * @returns {void}
 */
function registerSearch() {
  const { form, input } = getAppRegions();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await loadProfile(input.value, { historyMode: "push" });
  });
}

/**
 * Rehydrates app state from browser navigation events.
 *
 * @returns {void}
 */
function registerHistoryNavigation() {
  window.addEventListener("popstate", async () => {
    const nextUrlState = parseUrlState(window.location.search, fallbackUsername);

    repositoryExplorerState = nextUrlState.repositoryExplorerState;
    syncSearchInput(nextUrlState.username);
    await loadProfile(nextUrlState.username);
  });
}

renderShell();
registerSearch();
registerHistoryNavigation();
loadProfile(initialUsername);

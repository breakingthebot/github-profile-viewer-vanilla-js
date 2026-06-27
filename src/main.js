/**
 * File: src/main.js
 * Purpose: Boots the app, handles user interactions, and coordinates data loading and rendering.
 * Connects to: src/components/*, src/config/*, src/models/*, src/services/githubApi.js
 * Created: 2026-06-27
 */

import "./styles/main.css";
import { renderActivityFeed } from "./components/activityFeed.js";
import { renderProfileCard } from "./components/profileCard.js";
import { renderRepositoryExplorer } from "./components/repositoryExplorer.js";
import { renderSearchForm } from "./components/searchForm.js";
import { renderStatusPanel } from "./components/statusPanel.js";
import { APP_CONFIG } from "./config/appConfig.js";
import { ENV_CONFIG } from "./config/env.js";
import { createProfileSummary } from "./models/profileSummary.js";
import {
  createInitialRepositoryExplorerState,
  createRepositoryExplorerModel,
} from "./models/repositoryExplorer.js";
import { fetchGithubProfileBundle } from "./services/githubApi.js";
import { logError, logInfo } from "./utils/logger.js";

const appRoot = document.querySelector("#app");
const initialUsername = ENV_CONFIG.defaultUsername || APP_CONFIG.defaultUsername;
let currentSummary = null;
let repositoryExplorerState = createInitialRepositoryExplorerState();

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

  resultsRegion.innerHTML = `
    ${renderProfileCard(summary.profile)}
    <section class="content-grid">
      ${renderRepositoryExplorer(repositoryExplorer)}
      <div class="side-column">
        ${renderActivityFeed(summary.events)}
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
    repositoryExplorerState = {
      ...repositoryExplorerState,
      query: event.target.value,
    };
    renderResults(currentSummary);
  });

  repositoryLanguageSelect.addEventListener("change", (event) => {
    repositoryExplorerState = {
      ...repositoryExplorerState,
      language: event.target.value,
    };
    renderResults(currentSummary);
  });

  repositorySortSelect.addEventListener("change", (event) => {
    repositoryExplorerState = {
      ...repositoryExplorerState,
      sort: event.target.value,
    };
    renderResults(currentSummary);
  });
}

/**
 * Loads GitHub data and updates the UI state.
 *
 * @param {string} username - GitHub username to load.
 * @returns {Promise<void>} Resolves when rendering completes.
 */
async function loadProfile(username) {
  updateStatus("loading", `Loading ${username}...`);

  try {
    repositoryExplorerState = createInitialRepositoryExplorerState();
    const profileBundle = await fetchGithubProfileBundle(username);
    const summary = createProfileSummary(profileBundle);
    currentSummary = summary;
    clearStatus();
    renderResults(summary);
    logInfo("ui.render.success", { username });
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
    await loadProfile(input.value);
  });
}

renderShell();
registerSearch();
loadProfile(initialUsername);

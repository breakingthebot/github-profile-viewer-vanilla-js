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
import { GithubError } from "./models/githubError.js";
import {
  createInitialRepositoryExplorerState,
  createRepositoryExplorerModel,
  normalizeRepositoryExplorerState,
} from "./models/repositoryExplorer.js";
import { fetchGithubProfileBundle } from "./services/githubApi.js";
import { createStatusContentFromError } from "./utils/errorMessages.js";
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
      <a class="skip-link" data-skip-link href="#results-heading">Skip to loaded profile</a>
      <section class="hero">
        <div class="hero__content">
          <p class="hero__eyebrow">Editorial GitHub Explorer</p>
          <h1 class="hero__title">See the shape of a GitHub account, not just the raw profile.</h1>
          <p class="hero__copy">
            Search any public GitHub username and scan the profile story in one calm interface: identity,
            repositories, recent public activity, and shareable state that survives refreshes.
          </p>
        </div>
        <dl class="hero__highlights" aria-label="Product highlights">
          <div>
            <dt>Profile snapshot</dt>
            <dd>Bio, location, company, website, and audience signals.</dd>
          </div>
          <div>
            <dt>Repository lens</dt>
            <dd>Filter, sort, and compare recent repos without leaving the page.</dd>
          </div>
          <div>
            <dt>Activity pulse</dt>
            <dd>Public event trends, top repositories, and recent momentum.</dd>
          </div>
        </dl>
      </section>
      ${renderSearchForm(initialUsername)}
      <section data-status-region></section>
      <section
        aria-labelledby="results-heading"
        data-results-region
        id="results"
      >
        <h2 class="sr-only" id="results-heading" tabindex="-1">Loaded profile results</h2>
      </section>
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
    statusAction: document.querySelector("[data-status-action]"),
    profileHeading: document.querySelector("[data-profile-heading]"),
  };
}

/**
 * Focuses an element without scrolling the page unexpectedly.
 *
 * @param {HTMLElement | null} element - Target element.
 * @returns {void}
 */
function focusElement(element) {
  element?.focus({ preventScroll: true });
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
 * @param {string} [detail] - Additional status detail.
 * @param {string} [actionLabel] - Optional button label.
 * @returns {void}
 */
function updateStatus(variant, message, detail = "", actionLabel = "") {
  const { statusRegion } = getAppRegions();
  statusRegion.innerHTML = renderStatusPanel(variant, message, detail, actionLabel);
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
 * Registers the optional status panel action button.
 *
 * @returns {void}
 */
function registerStatusAction() {
  const { statusAction } = getAppRegions();

  if (!statusAction || !currentUsername) {
    return;
  }

  statusAction.addEventListener("click", async () => {
    await loadProfile(currentUsername);
  });
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
    <h2 class="sr-only" id="results-heading" tabindex="-1">Loaded profile results</h2>
    ${renderProfileCard(summary.profile)}
    <section class="content-grid">
      ${renderRepositoryExplorer(repositoryExplorer)}
      <div class="side-column">
        ${renderActivityPanel(activityInsights)}
      </div>
    </section>
  `;

  registerRepositoryExplorerControls();
  registerStatusAction();
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
 * @param {{historyMode?: "replace" | "push", focusTarget?: "none" | "results" | "status"}} options - Load behavior options.
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
    if ((options.focusTarget ?? "none") === "results") {
      const { profileHeading } = getAppRegions();
      focusElement(profileHeading);
    }
    logInfo("ui.render.success", { username: currentUsername });
  } catch (error) {
    const statusContent = createStatusContentFromError(error);
    updateStatus("error", statusContent.message, statusContent.detail, statusContent.actionLabel);
    registerStatusAction();
    if ((options.focusTarget ?? "status") === "status") {
      const { statusAction, statusRegion } = getAppRegions();
      focusElement(statusAction ?? statusRegion);
    }
    logError("ui.render.failure", {
      username,
      message: error instanceof Error ? error.message : "Unknown error",
      code: error instanceof GithubError ? error.code : "unknown",
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
    await loadProfile(input.value, { historyMode: "push", focusTarget: "results" });
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
    await loadProfile(nextUrlState.username, { focusTarget: "none" });
  });
}

/**
 * Registers explicit focus behavior for the skip link target.
 *
 * @returns {void}
 */
function registerSkipLink() {
  const skipLink = document.querySelector("[data-skip-link]");

  skipLink?.addEventListener("click", (event) => {
    event.preventDefault();
    const { profileHeading, resultsRegion } = getAppRegions();
    const resultsHeading = resultsRegion?.querySelector("#results-heading");
    focusElement(profileHeading ?? resultsHeading);
  });
}

/**
 * Adds global keyboard shortcuts for the profile viewer.
 *
 * @returns {void}
 */
function registerKeyboardShortcuts() {
  window.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTypingTarget =
      target instanceof HTMLElement &&
      (target.matches("input, textarea, select, button") || target.isContentEditable);

    if (event.key === "/" && !isTypingTarget && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const { input } = getAppRegions();
      focusElement(input);
      input?.select();
    }
  });
}

renderShell();
registerSearch();
registerHistoryNavigation();
registerSkipLink();
registerKeyboardShortcuts();
loadProfile(initialUsername, { focusTarget: "none" });

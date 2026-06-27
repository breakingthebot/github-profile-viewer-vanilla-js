/**
 * File: src/components/searchForm.js
 * Purpose: Renders the username search form for the viewer.
 * Connects to: src/main.js
 * Created: 2026-06-27
 */

import { escapeHtml } from "../utils/sanitizers.js";

/**
 * Creates the markup for the search form.
 *
 * @param {string} defaultUsername - Default username value for the input.
 * @returns {string} Search form markup.
 */
export function renderSearchForm(defaultUsername) {
  const safeDefaultUsername = escapeHtml(defaultUsername);

  return `
    <form class="search-form" data-search-form>
      <div class="search-form__heading">
        <p class="search-form__eyebrow">Profile lookup</p>
        <label class="search-form__label" for="username">Load a public GitHub account</label>
      </div>
      <div class="search-form__controls">
        <input
          class="search-form__input"
          id="username"
          name="username"
          type="text"
          placeholder="Enter a GitHub username"
          value="${safeDefaultUsername}"
          autocomplete="off"
          spellcheck="false"
          aria-describedby="username-hint"
        />
        <div class="search-form__actions">
          <button class="search-form__button" type="submit">Load profile</button>
          <button class="search-form__button search-form__button--secondary" data-share-button type="button">
            Copy share link
          </button>
        </div>
      </div>
      <p class="search-form__hint" id="username-hint">Try <span>octocat</span>, <span>vercel</span>, or any public GitHub username.</p>
      <p aria-live="polite" class="search-form__share-feedback" data-share-feedback></p>
    </form>
  `;
}

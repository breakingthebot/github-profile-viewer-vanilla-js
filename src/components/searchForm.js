/**
 * File: src/components/searchForm.js
 * Purpose: Renders the username search form for the viewer.
 * Connects to: src/main.js
 * Created: 2026-06-27
 */

/**
 * Creates the markup for the search form.
 *
 * @param {string} defaultUsername - Default username value for the input.
 * @returns {string} Search form markup.
 */
export function renderSearchForm(defaultUsername) {
  return `
    <form class="search-form" data-search-form>
      <label class="search-form__label" for="username">GitHub username</label>
      <div class="search-form__controls">
        <input
          class="search-form__input"
          id="username"
          name="username"
          type="text"
          placeholder="Enter a GitHub username"
          value="${defaultUsername}"
          autocomplete="off"
          spellcheck="false"
        />
        <button class="search-form__button" type="submit">Load profile</button>
      </div>
    </form>
  `;
}

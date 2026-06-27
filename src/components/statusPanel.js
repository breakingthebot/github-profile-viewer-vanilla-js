/**
 * File: src/components/statusPanel.js
 * Purpose: Renders status messages for loading, error, and empty states.
 * Connects to: src/main.js
 * Created: 2026-06-27
 */

/**
 * Creates status markup for the app shell.
 *
 * @param {string} variant - Status variant class name.
 * @param {string} message - Status message to display.
 * @returns {string} Status panel markup.
 */
export function renderStatusPanel(variant, message) {
  return `
    <section class="status-panel status-panel--${variant}" aria-live="polite">
      <p>${message}</p>
    </section>
  `;
}

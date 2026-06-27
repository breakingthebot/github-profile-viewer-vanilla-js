/**
 * File: src/components/statusPanel.js
 * Purpose: Renders status messages for loading, error, and empty states.
 * Connects to: src/main.js
 * Created: 2026-06-27
 */

import { escapeHtml } from "../utils/sanitizers.js";

/**
 * Creates status markup for the app shell.
 *
 * @param {string} variant - Status variant class name.
 * @param {string} message - Status message to display.
 * @param {string} [detail] - Additional status detail text.
 * @param {string} [actionLabel] - Optional action button label.
 * @returns {string} Status panel markup.
 */
export function renderStatusPanel(variant, message, detail = "", actionLabel = "") {
  return `
    <section class="status-panel status-panel--${variant}" aria-live="polite">
      <div class="status-panel__content">
        <p class="status-panel__message">${escapeHtml(message)}</p>
        ${detail ? `<p class="status-panel__detail">${escapeHtml(detail)}</p>` : ""}
      </div>
      ${
        actionLabel
          ? `<button class="status-panel__action" type="button" data-status-action>${escapeHtml(actionLabel)}</button>`
          : ""
      }
    </section>
  `;
}

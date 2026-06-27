/**
 * File: src/utils/sanitizers.js
 * Purpose: Escapes text and restricts URLs before untrusted values are rendered into the DOM.
 * Connects to: src/components/*, tests/utils/sanitizers.test.js
 * Created: 2026-06-27
 */

const HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escapes a value for safe HTML insertion.
 *
 * @param {unknown} value - Untrusted value.
 * @returns {string} Escaped string value.
 */
export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => HTML_ESCAPE_MAP[character]);
}

/**
 * Restricts URLs to http and https values.
 *
 * @param {unknown} value - Untrusted URL value.
 * @returns {string} Safe URL value.
 */
export function sanitizeUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  const trimmedValue = value.trim();

  try {
    const parsedUrl = new URL(trimmedValue.startsWith("http") ? trimmedValue : `https://${trimmedValue}`);

    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:" ? parsedUrl.toString() : "";
  } catch {
    return "";
  }
}

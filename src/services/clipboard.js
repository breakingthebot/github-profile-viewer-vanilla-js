/**
 * File: src/services/clipboard.js
 * Purpose: Copies text to the user's clipboard with a browser API path and document fallback.
 * Connects to: src/main.js, tests/services/clipboard.test.js
 * Created: 2026-06-27
 */

/**
 * Copies text to the clipboard.
 *
 * @param {string} text - Text to copy.
 * @param {{clipboard?: {writeText?: (value: string) => Promise<void>}, document?: Document}} [dependencies] - Optional test doubles.
 * @returns {Promise<void>} Resolves when the copy succeeds.
 */
export async function copyTextToClipboard(text, dependencies = {}) {
  const clipboard = dependencies.clipboard ?? globalThis.navigator?.clipboard;
  const documentRef = dependencies.document ?? globalThis.document;

  if (clipboard?.writeText) {
    await clipboard.writeText(text);
    return;
  }

  if (!documentRef?.body || typeof documentRef.createElement !== "function") {
    throw new Error("Clipboard unavailable.");
  }

  const helperField = documentRef.createElement("textarea");
  helperField.value = text;
  helperField.setAttribute("readonly", "true");
  helperField.setAttribute("aria-hidden", "true");
  helperField.style.position = "absolute";
  helperField.style.left = "-9999px";

  documentRef.body.append(helperField);
  helperField.select();

  const didCopy = typeof documentRef.execCommand === "function" && documentRef.execCommand("copy");

  helperField.remove();

  if (!didCopy) {
    throw new Error("Clipboard unavailable.");
  }
}

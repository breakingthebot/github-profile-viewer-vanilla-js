/**
 * File: tests/utils/sanitizers.test.js
 * Purpose: Verifies HTML escaping and URL sanitization helpers.
 * Connects to: src/utils/sanitizers.js
 * Created: 2026-06-27
 */

import { describe, expect, it } from "vitest";
import { escapeHtml, sanitizeUrl } from "../../src/utils/sanitizers.js";

describe("escapeHtml", () => {
  /**
   * Verifies HTML escaping for untrusted strings.
   *
   * @returns {void}
   */
  it("escapes reserved HTML characters", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;",
    );
  });
});

describe("sanitizeUrl", () => {
  /**
   * Verifies safe URL normalization.
   *
   * @returns {void}
   */
  it("normalizes valid URLs", () => {
    expect(sanitizeUrl("example.com")).toBe("https://example.com/");
  });

  /**
   * Verifies rejection of unsupported protocols.
   *
   * @returns {void}
   */
  it("rejects unsupported protocols", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
  });
});

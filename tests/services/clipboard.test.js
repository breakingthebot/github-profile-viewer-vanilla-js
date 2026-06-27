/**
 * File: tests/services/clipboard.test.js
 * Purpose: Verifies clipboard writes across direct browser support and document fallback paths.
 * Connects to: src/services/clipboard.js
 * Created: 2026-06-27
 */

import { describe, expect, it, vi } from "vitest";
import { copyTextToClipboard } from "../../src/services/clipboard.js";

describe("copyTextToClipboard", () => {
  /**
   * Verifies the browser clipboard API is used when available.
   *
   * @returns {Promise<void>}
   */
  it("uses navigator clipboard support when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    await copyTextToClipboard("https://example.com", {
      clipboard: { writeText },
    });

    expect(writeText).toHaveBeenCalledWith("https://example.com");
  });

  /**
   * Verifies the legacy document copy fallback path.
   *
   * @returns {Promise<void>}
   */
  it("falls back to document execCommand when clipboard support is unavailable", async () => {
    const appendedNodes = [];
    const helperField = {
      value: "",
      style: {},
      setAttribute: vi.fn(),
      select: vi.fn(),
      remove: vi.fn(),
    };
    const documentStub = {
      body: {
        append: vi.fn((node) => {
          appendedNodes.push(node);
        }),
      },
      createElement: vi.fn(() => helperField),
      execCommand: vi.fn(() => true),
    };

    await copyTextToClipboard("https://example.com", {
      document: documentStub,
    });

    expect(documentStub.createElement).toHaveBeenCalledWith("textarea");
    expect(appendedNodes).toHaveLength(1);
    expect(helperField.select).toHaveBeenCalled();
    expect(documentStub.execCommand).toHaveBeenCalledWith("copy");
    expect(helperField.remove).toHaveBeenCalled();
  });
});

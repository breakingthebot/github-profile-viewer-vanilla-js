/**
 * File: scripts/static-server.js
 * Purpose: Starts and stops a static HTTP server for the built dist directory during browser-based tests.
 * Connects to: tests/e2e/github-profile-viewer.spec.js
 * Created: 2026-06-27
 */

import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

/**
 * Returns a safe absolute path inside the dist directory.
 *
 * @param {string} distDirectory - Absolute dist directory path.
 * @param {string} requestPath - Incoming HTTP request path.
 * @returns {string} Absolute file path inside dist.
 */
function resolveAssetPath(distDirectory, requestPath) {
  const normalizedPath = normalize(requestPath === "/" ? "/index.html" : requestPath).replace(/^(\.\.[/\\])+/, "");

  return join(distDirectory, normalizedPath);
}

/**
 * Returns the content type for a static asset.
 *
 * @param {string} filePath - Absolute asset path.
 * @returns {string} HTTP content type value.
 */
function getContentType(filePath) {
  return CONTENT_TYPES[extname(filePath)] ?? "application/octet-stream";
}

/**
 * Sends a basic text response.
 *
 * @param {import("node:http").ServerResponse} response - HTTP response object.
 * @param {number} statusCode - HTTP status code.
 * @param {string} body - Response body text.
 * @returns {void}
 */
function sendText(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(body);
}

/**
 * Starts a static server for the built dist directory.
 *
 * @param {{host?: string, port?: number, distDirectory?: string}} options - Server options.
 * @returns {Promise<{url: string, stop: () => Promise<void>}>} Running server controls.
 */
export async function startStaticServer(options = {}) {
  const host = options.host ?? "127.0.0.1";
  const port = options.port ?? 4173;
  const distDirectory = options.distDirectory ?? join(process.cwd(), "dist");

  const server = createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? "/", `http://${host}:${port}`);
    const assetPath = resolveAssetPath(distDirectory, requestUrl.pathname);

    if (!assetPath.startsWith(distDirectory)) {
      sendText(response, 403, "Forbidden");
      return;
    }

    if (!existsSync(assetPath)) {
      sendText(response, 404, "Not Found");
      return;
    }

    const assetStats = await stat(assetPath);

    if (assetStats.isDirectory()) {
      sendText(response, 404, "Not Found");
      return;
    }

    response.writeHead(200, { "Content-Type": getContentType(assetPath) });
    createReadStream(assetPath).pipe(response);
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, resolve);
  });

  return {
    url: `http://${host}:${port}`,
    stop: () =>
      new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      }),
  };
}

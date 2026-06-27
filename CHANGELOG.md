# Changelog

## [0.1.0] - 2026-06-27

### Added
- Initial Vite-based vanilla JavaScript project scaffold.
- GitHub profile viewer foundation with profile, repositories, and recent activity sections.
- Loading, error, and empty states in the UI.
- API service and utility tests with Vitest.

## [0.2.0] - 2026-06-27

### Added
- Repository explorer controls for search, language filtering, and sorting.
- Repository insight metrics for visible repos, stars, languages, and the top-starred repo.
- Expanded profile metadata including company, location, website, and join date.
- Unit tests for repository filtering and summary logic.

## [0.3.0] - 2026-06-27

### Added
- GitHub Actions CI workflow for install, test, and build checks on Node.js 22.
- Local `npm run check` script that mirrors the CI verification steps.

## [0.4.0] - 2026-06-27

### Added
- Activity insight metrics for total events, active days, top repository, and latest event timing.
- Activity breakdown counts grouped by GitHub event type.
- A clearer empty state for users without recent public activity.
- Unit tests for activity summary helpers and new formatter behavior.

## [0.5.0] - 2026-06-27

### Added
- URL-state persistence for username, repository query, language filter, and sort mode.
- Back and forward browser navigation support that rehydrates app state from the URL.
- Unit tests for URL-state parsing and serialization.

## [0.6.0] - 2026-06-27

### Added
- Vercel deployment configuration for the static Vite build.
- A `.vercelignore` file aligned with local development artifacts.
- Deployment scripts for preview and production Vercel releases.
- Workspace settings for consistent local editor behavior.
- First live Vercel deployment for the project.

## [0.7.0] - 2026-06-27

### Added
- Playwright end-to-end browser tests for the core profile-viewer flow.
- Deterministic GitHub API fixtures for browser tests.
- CI coverage for headless Chromium end-to-end verification.

## [0.8.0] - 2026-06-27

### Added
- Editorial-style visual redesign across the hero, search form, profile, repository, and activity sections.
- Stronger typography, spacing, panel hierarchy, and badge treatments for clearer scanning.
- Mobile-friendly layout refinements that preserve the existing functionality.

## [0.9.0] - 2026-06-27

### Added
- Tightened profile-card spacing and wrapping behavior for long names and metadata values.
- Stronger separation between the identity block and the Directory details column.

## [0.10.0] - 2026-06-27

### Added
- Normalized GitHub/network error handling with clearer UI messages.
- Retry action in the status panel for recoverable failures.
- Unit and browser test coverage for the improved failure states.

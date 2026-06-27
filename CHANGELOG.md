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

# GitHub Profile Viewer

[![Continuous Integration](https://github.com/breakingthebot/github-profile-viewer-vanilla-js/actions/workflows/ci.yml/badge.svg?branch=feature/github-profile-viewer-foundation)](https://github.com/breakingthebot/github-profile-viewer-vanilla-js/actions/workflows/ci.yml)

A vanilla JavaScript app that fetches a GitHub user's profile, repositories, and recent public activity from the GitHub API, then lets you explore repositories with search, sort, and language filters.

## Stack
- JavaScript (ES modules)
- Vite
- Vitest
- GitHub REST API

## Setup
1. Install Node.js 22 or later.
2. Clone the repository.
3. Copy `.env.example` to `.env`.
4. Optionally add `VITE_GITHUB_TOKEN` to increase the GitHub API rate limit.
5. Install dependencies with `npm install`.

## Environment Variables
- `VITE_DEFAULT_USERNAME`
- `VITE_GITHUB_TOKEN`

## Running Locally
```bash
npm install
npm run dev
```

## Running Tests
```bash
npm run test
```

## Running Full Checks
```bash
npm run check
```

## Building
```bash
npm run build
```

## Deployed
Not deployed in this iteration.

## Architecture Notes
This build starts with a clean, framework-free frontend that is split by responsibility instead of collecting everything into one file. The app has a small configuration layer, a GitHub API service, pure formatting and normalization helpers, and separate rendering modules for the profile card, repository list, activity feed, search form, and status panel. That structure keeps the async fetching logic testable and makes the UI easy to extend in later iterations without rewriting the foundation.

The initial experience is meant to be dependable rather than flashy: the page shows a clear loading state, surfaces API and validation failures, and handles missing data without blank sections. The optional token is read from environment variables so the repo stays safe to publish.

The second iteration turns the repository area into an actual explorer instead of a static list. Search, language filtering, and sorting are modeled as separate UI state so the controls stay predictable and easy to extend. The profile card also now includes company, location, website, and join date to make the viewer more useful without leaving the app.

The third iteration adds release hygiene around the code that already exists. A single `npm run check` command now mirrors the GitHub Actions workflow, and CI runs install, test, and build validation on Node.js 22 for pushes and pull requests. That keeps the branch history cleaner because each pushed iteration is verified the same way locally and remotely.

## Notes
- GitHub's unauthenticated API has strict rate limits; a personal token is optional but recommended for local development.
- Public activity depends on the target account having recent public events available through the API.

/**
 * File: tests/e2e/fixtures/githubApiFixtures.js
 * Purpose: Provides deterministic GitHub API fixtures for Playwright browser tests.
 * Connects to: tests/e2e/github-profile-viewer.spec.js
 * Created: 2026-06-27
 */

const userProfiles = {
  octocat: {
    login: "octocat",
    name: "The Octocat",
    bio: "Mascot account",
    avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
    html_url: "https://github.com/octocat",
    followers: 100,
    following: 12,
    public_repos: 3,
    company: "@github",
    location: "San Francisco",
    created_at: "2020-01-01T00:00:00.000Z",
    blog: "https://github.blog",
  },
  vercel: {
    login: "vercel",
    name: "Vercel",
    bio: "Develop. Preview. Ship.",
    avatar_url: "https://avatars.githubusercontent.com/u/14985020?v=4",
    html_url: "https://github.com/vercel",
    followers: 2500,
    following: 3,
    public_repos: 4,
    company: "@vercel",
    location: "Remote",
    created_at: "2015-10-01T00:00:00.000Z",
    blog: "https://vercel.com",
  },
};

const repositoryCollections = {
  octocat: [
    {
      name: "docs-site",
      description: "Documentation site",
      html_url: "https://github.com/octocat/docs-site",
      stargazers_count: 20,
      forks_count: 4,
      language: "TypeScript",
      updated_at: "2026-06-27T12:00:00.000Z",
    },
    {
      name: "api-service",
      description: "Internal API service",
      html_url: "https://github.com/octocat/api-service",
      stargazers_count: 40,
      forks_count: 8,
      language: "JavaScript",
      updated_at: "2026-06-26T12:00:00.000Z",
    },
    {
      name: "cli-tool",
      description: "A command line helper",
      html_url: "https://github.com/octocat/cli-tool",
      stargazers_count: 15,
      forks_count: 3,
      language: "TypeScript",
      updated_at: "2026-06-25T12:00:00.000Z",
    },
  ],
  vercel: [
    {
      name: "next.js",
      description: "The React framework",
      html_url: "https://github.com/vercel/next.js",
      stargazers_count: 120000,
      forks_count: 26000,
      language: "JavaScript",
      updated_at: "2026-06-27T10:00:00.000Z",
    },
    {
      name: "ai",
      description: "AI SDK",
      html_url: "https://github.com/vercel/ai",
      stargazers_count: 20000,
      forks_count: 2200,
      language: "TypeScript",
      updated_at: "2026-06-27T09:00:00.000Z",
    },
    {
      name: "swr",
      description: "React hooks for data fetching",
      html_url: "https://github.com/vercel/swr",
      stargazers_count: 35000,
      forks_count: 1900,
      language: "TypeScript",
      updated_at: "2026-06-24T09:00:00.000Z",
    },
    {
      name: "edge-runtime",
      description: "Tools for edge execution",
      html_url: "https://github.com/vercel/edge-runtime",
      stargazers_count: 8000,
      forks_count: 600,
      language: "Rust",
      updated_at: "2026-06-22T09:00:00.000Z",
    },
  ],
};

const activityCollections = {
  octocat: [
    {
      type: "PushEvent",
      created_at: "2026-06-27T12:30:00.000Z",
      repo: { name: "octocat/api-service" },
    },
    {
      type: "WatchEvent",
      created_at: "2026-06-26T12:30:00.000Z",
      repo: { name: "octocat/docs-site" },
    },
  ],
  vercel: [],
};

/**
 * Returns a fixture payload for a GitHub user path.
 *
 * @param {string} username - GitHub username requested in the route.
 * @param {"profile" | "repos" | "events"} resource - Requested resource type.
 * @returns {object | Array<object> | undefined} Fixture payload.
 */
export function getGithubFixture(username, resource) {
  if (resource === "profile") {
    return userProfiles[username];
  }

  if (resource === "repos") {
    return repositoryCollections[username] ?? [];
  }

  return activityCollections[username] ?? [];
}

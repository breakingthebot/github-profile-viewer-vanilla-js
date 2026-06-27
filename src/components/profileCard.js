/**
 * File: src/components/profileCard.js
 * Purpose: Renders the GitHub user profile summary card.
 * Connects to: src/main.js, src/utils/formatters.js
 * Created: 2026-06-27
 */

import { formatCount } from "../utils/formatters.js";

/**
 * Creates the markup for the GitHub profile summary.
 *
 * @param {object} profile - GitHub user profile.
 * @returns {string} Profile card markup.
 */
export function renderProfileCard(profile) {
  return `
    <article class="profile-card">
      <img
        class="profile-card__avatar"
        src="${profile.avatar_url}"
        alt="${profile.login} avatar"
        width="96"
        height="96"
      />
      <div class="profile-card__content">
        <p class="profile-card__eyebrow">@${profile.login}</p>
        <h2 class="profile-card__title">${profile.name ?? profile.login}</h2>
        <p class="profile-card__bio">${profile.bio ?? "No public bio available."}</p>
        <dl class="profile-card__stats">
          <div>
            <dt>Followers</dt>
            <dd>${formatCount(profile.followers)}</dd>
          </div>
          <div>
            <dt>Following</dt>
            <dd>${formatCount(profile.following)}</dd>
          </div>
          <div>
            <dt>Public repos</dt>
            <dd>${formatCount(profile.public_repos)}</dd>
          </div>
        </dl>
        <a class="profile-card__link" href="${profile.html_url}" target="_blank" rel="noreferrer">
          View on GitHub
        </a>
      </div>
    </article>
  `;
}

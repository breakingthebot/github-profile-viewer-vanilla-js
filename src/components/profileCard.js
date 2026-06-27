/**
 * File: src/components/profileCard.js
 * Purpose: Renders the GitHub user profile summary card.
 * Connects to: src/main.js, src/utils/formatters.js
 * Created: 2026-06-27
 */

import { formatCount, formatDate } from "../utils/formatters.js";
import { escapeHtml, sanitizeUrl } from "../utils/sanitizers.js";

/**
 * Creates the markup for the GitHub profile summary.
 *
 * @param {object} profile - GitHub user profile.
 * @returns {string} Profile card markup.
 */
export function renderProfileCard(profile) {
  const websiteUrl = sanitizeUrl(profile.blog);
  const profileUrl = sanitizeUrl(profile.html_url);

  return `
    <article class="profile-card">
      <div class="profile-card__identity">
        <img
          class="profile-card__avatar"
          src="${sanitizeUrl(profile.avatar_url)}"
          alt="${escapeHtml(profile.login)} avatar"
          width="112"
          height="112"
        />
        <div class="profile-card__identity-copy">
          <p class="profile-card__eyebrow">@${escapeHtml(profile.login)}</p>
          <h2 class="profile-card__title">${escapeHtml(profile.name ?? profile.login)}</h2>
          <p class="profile-card__bio">${escapeHtml(profile.bio ?? "No public bio available.")}</p>
        </div>
      </div>
      <div class="profile-card__content">
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
        <div class="profile-card__section-label">Directory</div>
        <dl class="profile-card__details">
          <div>
            <dt>Company</dt>
            <dd>${escapeHtml(profile.company ?? "Not listed")}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>${escapeHtml(profile.location ?? "Not listed")}</dd>
          </div>
          <div>
            <dt>Joined</dt>
            <dd>${formatDate(profile.created_at)}</dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd>
              ${
                websiteUrl
                  ? `<a href="${websiteUrl}" target="_blank" rel="noreferrer">${escapeHtml(profile.blog)}</a>`
                  : "Not listed"
              }
            </dd>
          </div>
        </dl>
        <a class="profile-card__link" href="${profileUrl}" target="_blank" rel="noreferrer">
          Open full GitHub profile
        </a>
      </div>
    </article>
  `;
}

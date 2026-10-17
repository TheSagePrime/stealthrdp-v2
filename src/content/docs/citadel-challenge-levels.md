---
order: 32
title: Citadel challenge levels explained
sidebarTitle: Challenge levels
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/challenge-levels
summary: Choose Off, Cookie, JS, Interaction, Auto, or Lockdown for the situation.
relatedSlugs:
  - citadel-security
  - citadel-allowlists
  - citadel-branding
---
## Why challenge levels stop Layer 7 attacks

A Layer 7 attack sends HTTP requests that look like normal visitors: repeated page loads, login attempts, searches or API calls. Each request is small, so the attack hides inside ordinary traffic. A challenge asks the client to prove it is a real browser or a real person before Citadel forwards the request to your origin. Bots that cannot pass the challenge never reach the server.

## Choose the right level

- Start public websites on Auto (Balanced). It begins at a calmer baseline and escalates under attack.
- Use Interaction during active abuse when Auto is insufficient, and allowlist APIs first.
- Use Lockdown only for emergencies; pair it with specific IP or path allowlists for administrators and integrations.
- Off can suit a private app already gated elsewhere; proxy logs and configured rate limits still apply.

Cookie and JS are lighter browser checks between Off and Interaction.

## Recovery behavior

After a proxy restart, Auto heals an elevated level to its calm baseline. Fixed saved levels, including Interaction, remain as configured.

:::warn
Higher friction can interrupt APIs and headless monitors without allowlists.
:::

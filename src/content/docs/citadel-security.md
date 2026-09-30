---
order: 31
title: Configure Citadel security
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/security
summary: Choose challenge levels and review allowlists, blocklists, and rate limits.
relatedSlugs:
  - citadel-allowlists
  - citadel-challenge-levels
  - citadel-branding
  - citadel-cache
illustration:
  src: /citadel-docs/security-challenge.svg
  alt: Citadel challenge-level selector
  caption: Save a challenge level and allowlist APIs that cannot complete human interaction.
  width: 960
  height: 280
---
## Set a challenge level
Open a domain's Security page, choose Off, Cookie, JS, Interaction, Auto or Lockdown, then select Save level. Existing browser sessions must verify again after a level change. Balanced and Strict protection profiles provide preset bundles.
- Off applies no browser challenge while configured rate limits and blocklists can still apply.
- Cookie and JS use lightweight browser checks.
- Interaction requires a human click.
- Auto escalates during an attack and heals when traffic calms.
- Lockdown passes only allowlisted clients.
## Protect machine clients
APIs and webhooks cannot complete a human click. Add specific [path, IP or User-Agent allowlists](/citadel/docs/allowlists), especially before using Interaction or Lockdown. Review rate limits, blocklists and incident controls on the same Security surface.
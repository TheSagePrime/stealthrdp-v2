---
order: 33
title: Brand Citadel challenge and error pages
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/branding
summary: Customize visual HTML shells while Citadel supplies the mitigation controls.
relatedSlugs:
  - citadel-security
  - citadel-challenge-levels
  - citadel-allowlists
---
## Customizable pages
Citadel supports visual shells for JS challenge, Interaction, Lockdown, blocked 403, rate-limited 429, and origin/gateway errors 502, 503 and 504. Cookie challenge silently sets a pass cookie and redirects, so it has no branded page. A normal application 500 from a working origin is left as the application returned it.
## Save a shell
1. Open the domain's Branding page and select a page type.
2. Paste HTML or insert the sample shell. Optional markers are `{{BRAND}}` and `{{MESSAGE}}`.
3. Select Save custom shell. The status changes to Custom.
4. Use Restore this default or Restore all defaults to return to Citadel's stock pages.
Citadel injects its real proof-of-work, human button, and status controls before `</body>`. Do not add your own verification form or post solutions outside `/__l7/`. External `javascript:` attribute URLs are stripped on save. Keep shells below approximately 150 KB; inline CSS and HTTPS images are supported. Branding does not change proof-of-work difficulty or verification endpoints.
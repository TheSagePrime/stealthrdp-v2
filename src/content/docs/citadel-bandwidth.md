---
order: 39
title: Track Citadel bandwidth and speed limits
category: "Citadel: Traffic"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/bandwidth
summary: Review clean-traffic quota, live transfer, and per-domain outbound caps.
relatedSlugs:
  - citadel-cache
  - citadel-overview
illustration:
  src: /citadel-docs/bandwidth-limits.svg
  alt: Citadel speed-limit rule for zip files
  caption: Illustrative 5 MB/s per-connection limit for matching downloads.
  width: 960
  height: 220
---
## Understand usage
Bandwidth counts clean traffic passed toward the origin against the plan quota. Live charts display outbound and inbound MB/s.
## Set a speed limit
1. Select the domain in the scope control.
2. Add or edit a rule for an extension, path, subdomain, or domain.
3. Set the MB/s value and per-connection mode where appropriate.
4. Select Save speed limits.
Only one rule per type is supported. Edit an existing rule instead of stacking duplicates; remove a rule and save again to clear it. For example, cap `.zip` downloads at 5 MB/s per connection.
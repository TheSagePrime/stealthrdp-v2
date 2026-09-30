---
order: 35
title: Use Citadel cache and purge
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/cache
summary: Cache eligible static responses and bypass dynamic paths.
relatedSlugs:
  - citadel-bandwidth
  - citadel-security
---
## Configure cache
1. Open the domain's Cache page and enable caching.
2. Select eligible extensions such as CSS, JavaScript, images or fonts.
3. Add bypass prefixes for dynamic routes such as `/api/` and `/admin/`.
4. Save cache settings.
The cache reduces repeated origin work for eligible static responses. After a release that changes static assets, use Purge all or Purge path as needed.
Outbound visitor speed caps are configured in [Bandwidth](/citadel/docs/bandwidth), not Cache.
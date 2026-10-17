---
order: 27
title: Understand a Citadel domain's status
sidebarTitle: Domain status
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/domain-overview
summary: "Find a domain's Citadel ingress IP, see when its status changes from awaiting DNS to Active, and jump to Origin, Health, Security, Cache and Insights."
relatedSlugs:
  - citadel-cloudflare-setup
  - citadel-origin
  - citadel-security
---
## Connection status

A domain starts in awaiting DNS. Copy the Citadel ingress IP into a proxied Cloudflare A record. Citadel automatically checks the connection about every minute, or you can select Check connection.

Once a protected hostname routes through Citadel, the status becomes Active. A proxied subdomain can satisfy this check even if the apex is not proxied.

## Next steps

The domain overview links to Origin, Health, Security, Cache, and Insights. Use Origin to verify the backend and Health to test reachability.

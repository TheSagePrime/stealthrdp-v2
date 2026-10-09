---
order: 28
title: Configure Citadel origins and hostnames
sidebarTitle: Origin and hostnames
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/origin
summary: "Configure the backend Citadel forwards clean traffic to: apex host, port and TLS-to-origin, plus protected subdomains that share or override it."
relatedSlugs:
  - citadel-health
  - citadel-cloudflare-setup
  - citadel-allowlists
illustration:
  src: /citadel-docs/origin-setup.svg
  alt: Citadel origin host, port, TLS and subdomain settings
  caption: The origin settings determine where Citadel forwards clean traffic.
  width: 960
  height: 260
---
## Configure the backend

The origin is the real server Citadel sends clean traffic to. Set the apex host, port and TLS-to-origin option, then add protected subdomains. A subdomain can share the apex backend or override it.

1. Confirm the apex origin URL reaches a working server.
2. Add every hostname you want Citadel to protect.
3. Give each hostname a proxied Cloudflare DNS record pointing at the Citadel ingress IP.
4. Save, then use [Origin health](/citadel/docs/health) to test the connection.

## API and SSO redirects

If the origin redirects HTTP to HTTPS, enable TLS-to-origin or use an HTTPS backend. This helps prevent POST requests to `/api/*` from being turned into 301 redirects.

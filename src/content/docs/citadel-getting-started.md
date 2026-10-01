---
order: 23
title: Getting started with Citadel
category: "Citadel: Start here"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/getting-started
summary: "Set up Citadel step by step: add your domain and origin, point proxied Cloudflare DNS records at the ingress IP, set SSL to Full, and pick a challenge mode."
relatedSlugs:
  - citadel-cloudflare-setup
  - citadel-domains
  - citadel-security
  - citadel-allowlists
illustration:
  src: /citadel-docs/flow-cloudflare-citadel.svg
  alt: Cloudflare to Citadel to origin flow
  caption: "Traffic path: visitor → Cloudflare (proxied) → Citadel → origin."
  width: 960
  height: 320
---
## How traffic reaches your site
Visitors reach Cloudflare through a proxied orange-cloud DNS record. Cloudflare forwards web traffic to Citadel, which checks requests before clean traffic reaches your origin server.
## First-time setup
1. In Citadel, add your root domain with the origin IP or hostname, port, and TLS-to-origin setting.
2. Copy the Citadel ingress IP from the domain page.
3. In Cloudflare DNS, point a proxied A record for the apex and each protected hostname to that IP.
4. Set Cloudflare SSL/TLS to Full, or Full (strict) when the origin has a trusted certificate.
5. Wait about a minute for Citadel to detect the connection, or select Check connection.
6. Open Security and start with Auto (Balanced) challenge mode.
7. Allowlist machine-facing paths such as `/api/` and webhooks before using human interaction challenges.
## Check protection
The domain should show Active / Proxied. A grey-cloud DNS-only record bypasses Citadel and does not provide Layer 7 protection.
See [Cloudflare setup](/citadel/docs/cloudflare-setup) and [Security levels](/citadel/docs/challenge-levels).
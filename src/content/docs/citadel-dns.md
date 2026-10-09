---
order: 30
title: Citadel DNS stays in Cloudflare
sidebarTitle: DNS in Cloudflare
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/dns
summary: Keep Cloudflare nameservers and point protected web records at Citadel.
relatedSlugs:
  - citadel-cloudflare-setup
  - citadel-domain-overview
---
## A-record mode

Citadel does not host your DNS zone. Manage DNS in Cloudflare and point proxied orange-cloud web records to the Citadel ingress IP.

- Do not grey-cloud hostnames you expect Citadel to protect.
- Apex and `www` can both point to the same ingress IP.
- Mail, TXT, and other non-web records can stay as they are.

See [Cloudflare setup](/citadel/docs/cloudflare-setup).

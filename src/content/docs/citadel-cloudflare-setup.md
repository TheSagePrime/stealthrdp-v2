---
order: 25
title: Set up Cloudflare for Citadel
category: "Citadel: Start here"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/cloudflare-setup
summary: Point orange-cloud A records at Citadel without moving your DNS zone.
relatedSlugs:
  - citadel-domain-overview
  - citadel-origin
  - citadel-dns
illustration:
  src: /citadel-docs/flow-cloudflare-citadel.svg
  alt: Proxied Cloudflare DNS sends traffic to Citadel before the origin
  caption: Proxied A records point to Citadel. Grey-cloud records bypass protection.
  width: 960
  height: 320
---
## Configure DNS and SSL
1. Open your domain in Citadel and copy its ingress IP from the A record chip.
2. In Cloudflare DNS, set the apex (`@`) and every hostname you want protected to that IP.
3. Turn on Proxied (orange cloud) for each protected record.
4. In Cloudflare SSL/TLS Overview, select Full or Full (strict) if the origin certificate is trusted.
5. Return to Citadel. It checks awaiting domains about every minute; Check connection refreshes immediately.
## Troubleshoot activation
A grey-cloud record, the wrong ingress IP, or Flexible SSL can leave a domain awaiting DNS or cause browser errors. DNS-only records skip Citadel entirely. Mail, TXT, and other non-web records remain in Cloudflare.
See [DNS stays in Cloudflare](/citadel/docs/dns) and [Origin and hostnames](/citadel/docs/origin).
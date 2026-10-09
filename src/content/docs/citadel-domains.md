---
order: 26
title: Manage Citadel domains
sidebarTitle: Manage domains
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/domains
summary: "Add a domain to Citadel with its root name, origin host, port and TLS setting, check its connection, search the Domains list, or remove protection."
relatedSlugs:
  - citadel-getting-started
  - citadel-cloudflare-setup
  - citadel-domain-overview
illustration:
  src: /citadel-docs/domains-list.svg
  alt: Citadel add-domain form with domain, origin host and port
  caption: Add the root domain with a working origin host and port.
  width: 960
  height: 280
---
## Add a domain

1. Enter the root domain, such as `example.com`.
2. Enter the apex origin host, using a working IP address or hostname.
3. Set the origin port, usually 443, and choose whether Citadel should use TLS to the origin.
4. Select **Add domain** and complete the [Cloudflare setup](/citadel/docs/cloudflare-setup).

Citadel checks awaiting domains automatically about every minute. **Check connection** is available for an immediate test. After the apex is healthy, add protected subdomains from the Origin page.

## Manage existing domains

Use the Domains list to search for a site or remove a domain you no longer protect.

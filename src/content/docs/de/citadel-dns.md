---
order: 30
title: Cloudflare-DNS für Citadel
sidebarTitle: DNS bei Cloudflare
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/dns
summary: "Behalten Sie Ihr Cloudflare-DNS bei, also die Cloudflare-Nameserver, und zeigen Sie geschützte Web-Einträge auf die Citadel-Ingress-IP."
relatedSlugs:
  - citadel-cloudflare-setup
  - citadel-domain-overview
translationOf: citadel-dns
locale: de
publishAt: 2026-10-18
primaryKeyword: cloudflare dns
---
## A-Record-Modus

Citadel hostet Ihre DNS-Zone nicht. Verwalten Sie Ihr Cloudflare-DNS und zeigen Sie Web-Einträge mit aktiviertem Proxy („Proxied“, orange Wolke) auf die Citadel-Ingress-IP.

- Stellen Sie Hostnamen, die Citadel schützen soll, nicht auf graue Wolke um.
- Root-Domain (Apex) und `www` können auf dieselbe Ingress-IP zeigen.
- E-Mail-, TXT- und andere Nicht-Web-Einträge können unverändert bleiben.

Siehe [Cloudflare-Einrichtung](/de/citadel/docs/cloudflare-setup).

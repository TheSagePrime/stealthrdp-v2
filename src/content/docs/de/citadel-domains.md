---
order: 26
title: Citadel-Domains hinzufügen und verwalten
sidebarTitle: Domains verwalten
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/domains
summary: "Fügen Sie eine Domain für den DDoS-Schutz von Citadel hinzu, legen Sie Origin-Host, Port und TLS fest, prüfen Sie die Verbindung oder entfernen Sie den Schutz."
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
translationOf: citadel-domains
locale: de
publishAt: 2026-10-18
primaryKeyword: domain ddos schutz hinzufügen
---
## Domain zum DDoS-Schutz hinzufügen

1. Geben Sie die Root-Domain ein, zum Beispiel `example.com`.
2. Geben Sie den Origin-Host der Apex-Domain ein, als funktionierende IP-Adresse oder als Hostname.
3. Legen Sie den Origin-Port fest (meist 443) und entscheiden Sie, ob Citadel für die Verbindung zum Origin TLS verwenden soll.
4. Wählen Sie „Add domain“ und schließen Sie die [Cloudflare-Einrichtung](/de/citadel/docs/cloudflare-setup) ab.

Citadel prüft wartende Domains automatisch etwa jede Minute. Mit „Check connection“ starten Sie einen sofortigen Test. Sobald die Apex-Domain funktionsfähig ist, fügen Sie geschützte Subdomains auf der Seite „Origin“ hinzu.

## Bestehende Domains verwalten

Mit der Liste „Domains“ suchen Sie eine Website oder entfernen eine Domain, die Sie nicht mehr schützen lassen möchten.

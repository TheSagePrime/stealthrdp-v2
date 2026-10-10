---
order: 27
title: Citadel-Domain-Status verstehen
sidebarTitle: Domain-Status
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/domain-overview
summary: "Citadel-Domain-Status prüfen: Ingress-IP finden, „awaiting DNS“ bis „Active“ verfolgen und zu Origin, Health, Security, Cache und Insights springen."
relatedSlugs:
  - citadel-cloudflare-setup
  - citadel-origin
  - citadel-security
translationOf: citadel-domain-overview
locale: de
publishAt: 2026-10-21
primaryKeyword: citadel domain status
---
## Citadel-Domain-Status und Verbindung

Der Citadel-Domain-Status einer Domain beginnt mit „awaiting DNS“. Kopieren Sie die Citadel-Ingress-IP in einen Cloudflare-A-Eintrag mit aktiviertem Proxy. Citadel prüft die Verbindung etwa jede Minute automatisch, oder Sie wählen „Check connection“.

Sobald ein geschützter Hostname über Citadel geleitet wird, wechselt der Status zu „Active“. Eine Subdomain mit aktiviertem Proxy kann diese Prüfung erfüllen, auch wenn die Root-Domain (Apex) nicht über den Proxy läuft.

## Nächste Schritte

Die Domain-Übersicht verlinkt auf „Origin“, „Health“, „Security“, „Cache“ und „Insights“. Nutzen Sie „Origin“, um das Backend zu prüfen, und „Health“, um die Erreichbarkeit zu testen.

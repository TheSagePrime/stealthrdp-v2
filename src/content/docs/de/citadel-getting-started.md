---
order: 23
title: "Citadel: DDoS-Schutz für Websites einrichten"
sidebarTitle: Erste Schritte
category: "Citadel: Start here"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/getting-started
summary: "DDoS-Schutz für Ihre Website einrichten: Domain und Origin anlegen, Cloudflare-DNS auf die Ingress-IP setzen, SSL auf Full stellen."
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
translationOf: citadel-getting-started
locale: de
publishAt: 2026-10-15
primaryKeyword: ddos schutz website einrichten
---
## So erreicht der Datenverkehr Ihre Website

Mit Citadel als DDoS-Schutz für Ihre Website laufen Besucher zuerst über Cloudflare: Ein proxied DNS-Eintrag (orange Wolke) leitet den Webverkehr an Citadel weiter. Citadel prüft die Anfragen, bevor sauberer Datenverkehr Ihren Origin-Server erreicht.

## DDoS-Schutz für Ihre Website einrichten

1. Fügen Sie in Citadel Ihre Root-Domain hinzu und geben Sie die Origin-IP oder den Hostnamen, den Port und die TLS-Einstellung zum Origin an.
2. Kopieren Sie die Citadel-Ingress-IP von der Domain-Seite.
3. Richten Sie in Cloudflare DNS für die Apex-Domain und jeden geschützten Hostnamen einen A-Eintrag mit aktiviertem Proxy (orange Wolke) auf diese IP ein.
4. Setzen Sie den SSL/TLS-Modus in Cloudflare auf „Full“ oder, wenn der Origin ein vertrauenswürdiges Zertifikat hat, auf „Full (strict)“.
5. Warten Sie etwa eine Minute, bis Citadel die Verbindung erkennt, oder wählen Sie „Check connection“.
6. Öffnen Sie „Security“ und starten Sie mit dem Challenge-Modus „Auto (Balanced)“.
7. Nehmen Sie maschinell genutzte Pfade wie `/api/` und Webhooks in die Allowlist auf, bevor Sie interaktive Challenges für Menschen einsetzen.

## Schutz prüfen

Die Domain sollte „Active / Proxied“ anzeigen. Ein DNS-Eintrag mit grauer Wolke (nur DNS) umgeht Citadel und bietet keinen Layer-7-Schutz.

Lesen Sie [Cloudflare-Einrichtung](/de/citadel/docs/cloudflare-setup) und [Sicherheitsstufen](/de/citadel/docs/challenge-levels).

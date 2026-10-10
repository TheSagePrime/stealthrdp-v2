---
order: 28
title: "Origin-Server und Hostnamen in Citadel"
sidebarTitle: Origin und Hostnamen
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/origin
summary: "Origin-Server konfigurieren: Apex-Host, Port und TLS-to-origin sowie geschützte Subdomains, die das Backend übernehmen oder überschreiben."
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
translationOf: citadel-origin
locale: de
publishAt: 2026-10-17
primaryKeyword: origin server konfigurieren
---
## Origin-Server konfigurieren

Der Origin-Server ist der echte Server, an den Citadel bereinigten Datenverkehr weiterleitet. Wenn Sie den Origin-Server konfigurieren, legen Sie Apex-Host, Port und die Option „TLS-to-origin“ fest und fügen danach die geschützten Subdomains hinzu. Eine Subdomain kann dasselbe Backend wie der Apex-Host nutzen oder mit einem eigenen Backend überschrieben werden.

1. Vergewissern Sie sich, dass die Origin-URL des Apex-Hosts einen funktionierenden Server erreicht.
2. Fügen Sie jeden Hostnamen hinzu, den Citadel schützen soll.
3. Legen Sie für jeden Hostnamen einen Cloudflare-DNS-Eintrag mit aktiviertem Proxy („Proxied“) an, der auf die IP-Adresse des Citadel-Ingress zeigt.
4. Speichern Sie die Einstellungen und testen Sie danach die Verbindung mit [Origin-Health](/de/citadel/docs/health).

## API- und SSO-Weiterleitungen

Leitet der Origin-Server HTTP auf HTTPS weiter, aktivieren Sie die Option „TLS-to-origin“ oder verwenden Sie ein HTTPS-Backend. Das hilft zu verhindern, dass POST-Anfragen an `/api/*` durch eine 301-Weiterleitung umgeleitet werden.

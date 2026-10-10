---
order: 25
title: Cloudflare für Citadel einrichten
sidebarTitle: Cloudflare einrichten
category: "Citadel: Start here"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/cloudflare-setup
summary: "Cloudflare für Citadel einrichten: Proxy-A-Records (orange Wolke) auf die Ingress-IP setzen, SSL/TLS auf Full stellen und Domains beheben, die auf DNS warten."
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
translationOf: citadel-cloudflare-setup
locale: de
publishAt: 2026-10-15
primaryKeyword: cloudflare für citadel einrichten
---
Diese Anleitung zeigt Ihnen, wie Sie Cloudflare für Citadel einrichten. Sie setzen die DNS-Einträge Ihrer Domain auf die Ingress-IP von Citadel und stellen SSL/TLS ein.

## Cloudflare-DNS und SSL für Citadel konfigurieren

1. Öffnen Sie Ihre Domain in Citadel und kopieren Sie die Ingress-IP aus dem Badge „A record“.
2. Setzen Sie in Cloudflare DNS die Root-Domain (Apex, `@`) und jeden Hostnamen, den Sie schützen möchten, auf diese IP-Adresse.
3. Aktivieren Sie **Proxied** (orange Wolke) für jeden geschützten Eintrag.
4. Wählen Sie unter „SSL/TLS Overview“ in Cloudflare **Full** oder **Full (strict)**, sofern das Origin-Zertifikat vertrauenswürdig ist.
5. Kehren Sie zu Citadel zurück. Domains mit dem Status „awaiting DNS“ prüft Citadel etwa jede Minute. Mit **„Check connection“** startet die Prüfung sofort neu.

## Probleme bei der Aktivierung beheben

Ein Eintrag mit grauer Wolke, eine falsche Ingress-IP oder Flexible SSL kann dazu führen, dass eine Domain weiter auf DNS wartet oder Browserfehler auftreten. Einträge mit „DNS only“ umgehen Citadel vollständig. Mail-, TXT- und andere Nicht-Web-Einträge bleiben in Cloudflare.

## Cloudflare-DDoS-Schutz und Citadel

Bei Einträgen mit Proxy läuft der Datenverkehr zuerst durch Cloudflare. Der DDoS-Schutz von Cloudflare greift daher weiterhin. Anschließend prüft Citadel die HTTP-Anfragen, die bei Citadel ankommen, mit Challenge-Stufen, Ratenlimits und Logs pro Domain. Erst danach leitet Citadel den bereinigten Datenverkehr an Ihren Origin-Server weiter.

Siehe [DNS bleibt in Cloudflare](/de/citadel/docs/dns) und [Origin und Hostnamen](/de/citadel/docs/origin).

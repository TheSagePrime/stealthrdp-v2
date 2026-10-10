---
order: 29
title: 'Origin-Health in Citadel prüfen'
sidebarTitle: Origin-Health prüfen
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/health
summary: "Prüfen Sie mit Citadel-Health-Checks Latenz, Status und Fehler Ihres Origin-Servers, finden Sie die Ursache von 502-Fehlern und korrigieren Sie Host, Port, TLS oder Firewall-Regeln."
relatedSlugs:
  - citadel-origin
  - citadel-security
translationOf: citadel-health
locale: de
publishAt: 2026-10-12
primaryKeyword: citadel origin health
---
## Health-Prüfung ausführen

Öffnen Sie die Domain und wählen Sie „Health“. Prüfen Sie Latenz, Status und Fehlertext der letzten Prüfung, oder starten Sie eine neue Prüfung, nachdem Sie die „Origin“-Einstellungen geändert haben.

## Wenn eine Prüfung fehlschlägt

Prüfen Sie die IP-Adresse oder den Hostnamen des Origins, den Port, die TLS-Einstellung und die Firewall-Regeln, die den ausgehenden Datenverkehr von Citadel zulassen müssen. Speichern Sie die Korrekturen unter „Origin“ und prüfen Sie danach erneut unter „Health“. Sehen Besucher einen 502-Fehler (Bad Gateway), ist der Origin häufig nicht erreichbar.

Die Origin-Health-Überwachung ändert eine feste Challenge-Stufe nicht stillschweigend auf „Interaction“. Unter „Security“ bleibt die Stufe, die Sie gespeichert haben.

---
order: 37
title: "Citadel-Domain-Logs durchsuchen und filtern"
sidebarTitle: Domain-Logs durchsuchen
category: "Citadel: Traffic"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/logs
summary: "Citadel-Domain-Logs durchsuchen: 15 Tage Zugriffs-, Sicherheits- und Fehlerlogs nach IP, Pfad, Host oder Request-ID, mit Filtern, Sortierung, ASN und Land."
relatedSlugs:
  - citadel-insights
  - citadel-security
  - citadel-analytics
translationOf: citadel-logs
locale: de
publishAt: 2026-10-18
primaryKeyword: citadel logs durchsuchen
---
## Log-Typen und Aufbewahrung

- Zugriffseinträge (Access-Logs) enthalten Methode, Pfad, Status, Besucher-IP, ASN, Land, User-Agent, Latenz, Bytes und Request-ID.
- Sicherheitseinträge zeigen Challenges, Sperren, Ratenbegrenzungen und durch die Allowlist zugelassene Anfragen.
- Fehlereinträge zeigen nicht erreichbare Origin-Server, Timeouts und Gateway-Fehler 502, 503 oder 504.

Logs werden 15 Tage lang in S3-basiertem Speicher aufbewahrt. Vollständige Anfrage- und Antwortinhalte werden in dieser Ansicht nicht gespeichert, und sensible Werte in Query-Parametern werden vor der Speicherung unkenntlich gemacht.

## Eine Anfrage in den Logs finden

Öffnen Sie die „Logs“-Seite einer Domain. Jede Seite zeigt bis zu 200 Zeilen; mit „Previous“ und „Next“ blättern Sie weiter. Filtern Sie nach Typ, Methode oder Status, suchen Sie nach Besucher-IP, URL-Pfad, Host oder Request-ID, und sortieren Sie nach Zeitpunkt, älteste oder neueste zuerst. Erweitern Sie „Show details“, um strukturierte Entscheidungs- und Besucherdetails zu sehen. Ältere Zeilen mit leeren Detailobjekten werden aus ihren sichtbaren Feldern nachträglich ergänzt.

## Geo- und IP-Details

ASN bevorzugt `CF-ASN` oder `CF-IPASNUM`, sofern vorhanden; andernfalls löst Citadel die Besucher-IP über Team Cymru DNS auf. Das Land bevorzugt das bekannte Betriebsland des ASN-Betreibers (zum Beispiel AS135407 Transworld → Pakistan), danach `CF-IPCountry`. Der Ländercode von Team Cymru dient nur als letzte Option, weil er das Registrierungsland statt des Standorts des Besuchers beschreiben kann. Neue Besucher-IPs werden beim Eintreffen des Traffics erfasst, und wenn Sie ältere Seiten öffnen, werden diese Zeilen für spätere IP-Suchen nachträglich ergänzt.

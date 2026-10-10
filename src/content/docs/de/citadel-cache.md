---
order: 35
title: 'Citadel-Cache leeren und konfigurieren'
sidebarTitle: 'Cache leeren'
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/cache
summary: "Citadel-Cache leeren und konfigurieren: CSS, JavaScript, Bilder und Schriften cachen, dynamische Pfade wie /api/ ausnehmen und nach einem Release leeren."
relatedSlugs:
  - citadel-bandwidth
  - citadel-security
translationOf: citadel-cache
locale: de
publishAt: 2026-10-18
primaryKeyword: citadel cache leeren
---
## Citadel-Cache konfigurieren

1. Öffnen Sie die Seite „Cache“ der Domain und aktivieren Sie das Caching.
2. Wählen Sie die passenden Dateiendungen aus, zum Beispiel CSS, JavaScript, Bilder oder Schriften.
3. Fügen Sie Bypass-Präfixe für dynamische Pfade hinzu, zum Beispiel `/api/` und `/admin/`.
4. Speichern Sie die Cache-Einstellungen.

Der Citadel-Cache reduziert wiederholte Anfragen an den Origin-Server für geeignete statische Antworten. Nach einem Release, das statische Dateien ändert, leeren Sie den Cache je nach Bedarf mit „Purge all“ oder „Purge path“.

:::info
Die Geschwindigkeitsbegrenzung für ausgehende Verbindungen zu Besuchern wird unter [Bandbreite](/de/citadel/docs/bandwidth) konfiguriert, nicht im Cache.
:::

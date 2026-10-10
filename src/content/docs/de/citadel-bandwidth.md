---
order: 39
title: Citadel-Bandbreite und Speed-Limits prüfen
sidebarTitle: Bandbreite und Speed-Limits
category: "Citadel: Traffic"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/bandwidth
summary: Prüfen Sie in Citadel das Kontingent für sauberen Datenverkehr, die Live-Übertragung und die ausgehenden Bandbreitenlimits pro Domain.
relatedSlugs:
  - citadel-cache
  - citadel-overview
illustration:
  src: /citadel-docs/bandwidth-limits.svg
  alt: Citadel speed-limit rule for zip files
  caption: Illustrative 5 MB/s per-connection limit for matching downloads.
  width: 960
  height: 220
translationOf: citadel-bandwidth
locale: de
publishAt: 2026-10-21
primaryKeyword: bandbreite limit
---
## Verbrauch verstehen

Auf das Kontingent Ihres Tarifs wird sauberer Datenverkehr angerechnet, der an den Origin-Server weitergeleitet wird. Live-Diagramme zeigen ausgehende und eingehende MB/s.

## Ein Bandbreitenlimit setzen

1. Wählen Sie die Domain über die Scope-Auswahl aus.
2. Fügen Sie eine Regel für eine Dateiendung, einen Pfad, eine Subdomain oder eine Domain hinzu oder bearbeiten Sie eine bestehende.
3. Geben Sie den Wert in MB/s ein und wählen Sie bei Bedarf den Modus pro Verbindung.
4. Klicken Sie auf „Save speed limits“.

:::info
Pro Regeltyp ist nur eine Regel möglich. Bearbeiten Sie eine bestehende Regel, statt Duplikate anzulegen. Um eine Regel zu löschen, entfernen Sie sie und speichern Sie erneut.
:::

Beispiel: Begrenzen Sie `.zip`-Downloads auf 5 MB/s pro Verbindung.

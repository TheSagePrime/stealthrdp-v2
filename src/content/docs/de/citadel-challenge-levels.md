---
order: 32
title: Citadel-Challenge-Stufen erklärt
sidebarTitle: Challenge-Stufen
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/challenge-levels
summary: "Die Citadel-Challenge-Stufen im Überblick: Wählen Sie für Ihre Situation „Off“, „Cookie“, „JS“, „Interaction“, „Auto“ oder „Lockdown“."
relatedSlugs:
  - citadel-security
  - citadel-allowlists
  - citadel-branding
translationOf: citadel-challenge-levels
locale: de
publishAt: 2026-10-10
primaryKeyword: citadel challenge-stufen
---
## Warum Citadel-Challenge-Stufen Layer-7-Angriffe stoppen

Ein Layer-7-Angriff sendet HTTP-Anfragen, die wie normale Besucher aussehen: wiederholte Seitenaufrufe, Anmeldeversuche, Suchanfragen oder API-Aufrufe. Jede einzelne Anfrage ist klein, sodass sich der Angriff im normalen Datenverkehr verbirgt. Hier setzen die Citadel-Challenge-Stufen an: Eine Challenge verlangt vom Client den Nachweis, dass er ein echter Browser oder ein echter Mensch ist, bevor Citadel die Anfrage an Ihren Origin-Server weiterleitet. Bots, die die Challenge nicht bestehen, erreichen den Server nie.

## Die richtige Stufe wählen

- Starten Sie öffentliche Websites mit „Auto“ (Balanced). Sie beginnt auf einem ruhigeren Ausgangsniveau und steigt bei einem Angriff an.
- Verwenden Sie „Interaction“ während eines aktiven Missbrauchs, wenn „Auto“ nicht ausreicht, und nehmen Sie APIs zuerst in die Allowlist auf.
- Verwenden Sie „Lockdown“ nur in Notfällen und kombinieren Sie es mit gezielten IP- oder Pfad-Allowlists für Administratoren und Integrationen.
- „Off“ eignet sich für eine private App, die bereits anderweitig abgesichert ist. Proxy-Logs und konfigurierte Rate-Limits bleiben trotzdem aktiv.

„Cookie“ und „JS“ sind leichtere Browserprüfungen zwischen „Off“ und „Interaction“.

## Verhalten nach einem Neustart

Nach einem Neustart des Proxys setzt eine erhöhte Stufe auf das ruhige Ausgangsniveau zurück. Feste gespeicherte Stufen, einschließlich „Interaction“, bleiben so erhalten, wie Sie sie konfiguriert haben.

:::warn
Strengere Prüfungen können APIs und Headless-Monitoring-Tools ohne Allowlists unterbrechen.
:::

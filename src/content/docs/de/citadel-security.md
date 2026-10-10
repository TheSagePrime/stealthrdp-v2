---
order: 31
title: Citadel-Sicherheit konfigurieren
sidebarTitle: Sicherheit konfigurieren
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/security
summary: "Citadel-Sicherheit konfigurieren: Wählen Sie Challenge-Stufen und prüfen Sie Allowlists, Blocklists und Ratenbegrenzungen."
relatedSlugs:
  - citadel-allowlists
  - citadel-challenge-levels
  - citadel-branding
  - citadel-cache
illustration:
  src: /citadel-docs/security-challenge.svg
  alt: Citadel challenge-level selector
  caption: Save a challenge level and allowlist APIs that cannot complete human interaction.
  width: 960
  height: 280
translationOf: citadel-security
locale: de
publishAt: 2026-10-15
primaryKeyword: citadel sicherheit konfigurieren
---
## Challenge-Stufe festlegen

Um die Citadel-Sicherheit zu konfigurieren, öffnen Sie die „Security“-Seite einer Domain, wählen Sie eine Stufe („Off“, „Cookie“, „JS“, „Interaction“, „Auto“ oder „Lockdown“) aus und wählen Sie „Save level“. Bestehende Browsersitzungen müssen nach einer Änderung der Stufe erneut verifiziert werden. Die Schutzprofile „Balanced“ und „Strict“ bieten vorkonfigurierte Pakete.

- „Off“ wendet keine Browser-Challenge an, während konfigurierte Ratenbegrenzungen (Rate Limiting) und Blocklists weiterhin greifen können.
- „Cookie“ und „JS“ nutzen leichtgewichtige Browserprüfungen.
- „Interaction“ verlangt einen Klick durch einen Menschen.
- „Auto“ verschärft sich während eines Angriffs automatisch und kehrt zur Normalstufe zurück, sobald der Datenverkehr nachlässt.
- „Lockdown“ lässt nur Clients passieren, die auf der Allowlist stehen.

## Maschinelle Clients schützen

APIs und Webhooks können keinen Klick durch einen Menschen ausführen. Fügen Sie gezielt [Allowlists für Pfade, IP-Adressen oder User-Agents](/de/citadel/docs/allowlists) hinzu, besonders bevor Sie „Interaction“ oder „Lockdown“ verwenden. Prüfen Sie Ratenbegrenzungen, Blocklists und Incident-Kontrollen auf derselben „Security“-Seite.

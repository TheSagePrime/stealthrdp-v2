---
order: 19
title: 'VPS neu installieren: Rebuild im Kundenbereich'
sidebarTitle: Server neu aufsetzen
category: Server management
date: Mar 13, 2025
sourceTitle: How to Rebuild a Server
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1740916941-how-to-rebuild-a-server
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'VPS neu installieren: Im Kundenbereich Rebuild starten, Name und Betriebssystem wählen, 3-5 Minuten warten, dann per RDP (Windows) oder SSH verbinden.'
relatedSlugs: []
translationOf: 1740916941-how-to-rebuild-a-server
locale: de
publishAt: 2026-10-13
primaryKeyword: vps neu installieren
---
Um **Ihren VPS neu zu installieren**, gehen Sie mit diesen Schritten vor:

### 1. Den „Client Area“ öffnen

_(Überspringen Sie diesen Schritt, wenn Sie bereits im „Control Panel“ sind.)_

### 2. Das „Dashboard“ Ihres Servers öffnen

### 3. Auf „Rebuild“ klicken

### 4. Einen Namen festlegen

_(Sie können einen eigenen Namen eingeben oder einen zufälligen Namen generieren lassen.)_

### 5. „Hostname / Timezone“ ausfüllen

_(Optional.)_

### 6. Das gewünschte Betriebssystem aus der Liste auswählen

## Betriebssystem-Auswahl und Verbindung

- Wenn Sie **Windows** als Betriebssystem wählen, wird der Server mit **RDP** eingerichtet. Sie verbinden sich dann mit einem **Remotedesktop-Client** (Remote Desktop Client).
- Für **alle anderen Betriebssysteme** außer Windows verbinden Sie sich mit einem **SSH-Client**.

## Ablauf und Wartezeit

- Warten Sie **3-5 Minuten**, bis die Installation abgeschlossen ist.
- **Starten Sie den Server nicht neu und lösen Sie kein weiteres Rebuild aus**, bis der Vorgang abgeschlossen ist.
- Sobald der Vorgang abgeschlossen ist, erhalten Sie eine E-Mail-Benachrichtigung:
  - **„Your Windows Server is Nearly Ready!“** _(für Windows)_
  - **„Your Server is Nearly Ready!“** _(für andere Linux-basierte Distributionen)_

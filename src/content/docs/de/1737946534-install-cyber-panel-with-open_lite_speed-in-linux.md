---
order: 18
title: 'CyberPanel installieren mit OpenLiteSpeed'
sidebarTitle: CyberPanel installieren
category: Web panels
date: Jan 27, 2025
sourceTitle: Install Cyber Panel With OpenLiteSpeed in Linux
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946534-install-cyber-panel-with-open_lite_speed-in-linux
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'CyberPanel installieren mit OpenLiteSpeed auf einem frischen Linux-VPS über SSH. Danach verwalten Sie Websites, E-Mails und Datenbanken im Panel.'
relatedSlugs: []
translationOf: 1737946534-install-cyber-panel-with-open_lite_speed-in-linux
locale: de
publishAt: 2026-10-16
primaryKeyword: cyberpanel installieren
---
Diese Anleitung zeigt Ihnen, wie Sie CyberPanel installieren. Die Installation erfolgt auf einem Linux-Server, und wir halten die Schritte so einfach wie möglich. Dabei verwenden wir den kostenlosen Plan, der folgende Funktionen bietet:

- Unbegrenzte Domains
- Unbegrenzte Subdomains
- Unbegrenzte Datenbanken
- Mehrere PHP-Versionen
- Let's Encrypt SSL
- LSCache für WordPress
- Community-Support
- OpenLiteSpeed-Server

CyberPanel benötigt eine frische Installation eines dieser Systeme mit mindestens 1024 MB RAM und 10 GB Speicherplatz:

- Ubuntu 18.04, 20.04 oder 22.04
- AlmaLinux 8 oder 9
- CloudLinux 8

Die Installationsanleitung von CyberPanel führt Ubuntu 24.04 und AlmaLinux 10 nicht auf. Wählen Sie deshalb bei der Bestellung eines der oben genannten Systeme.

### 1. Paketlisten aktualisieren

Öffnen Sie ein Terminal-Fenster und geben Sie Folgendes ein:

```bash tab="Ubuntu" title="Paketlisten aktualisieren"
sudo apt update
```

```bash tab="AlmaLinux 8 oder 9" title="Paketlisten aktualisieren"
sudo yum update
```

### 2. CyberPanel installieren

Jetzt können Sie CyberPanel installieren. Geben Sie diesen einzelnen Befehl ein und folgen Sie anschließend dem Installationsprogramm Schritt für Schritt:

```bash title="CyberPanel-Installationsprogramm starten"
sh <(curl https://cyberpanel.net/install.sh || wget -O - https://cyberpanel.net/install.sh)
```

:::tip
Wenn Sie nicht wissen, wie Sie SQL-Fehler beheben, installieren Sie ohne Remote-SQL. So vermeiden Sie technische Fehler in Zukunft.
:::

## Zugang zum Panel

Nach der erfolgreichen Installation können Sie CyberPanel mit den folgenden Angaben aufrufen, bis Sie bei der Installation eigene Zugangsdaten festgelegt haben. Ändern Sie diese Angaben unbedingt.

- Adresse: `https://YOUR-SERVER-IP:8090`
- Benutzername: `admin`
- Passwort: `1234567` (ändern Sie es nach der ersten Anmeldung)

## 503-Fehler nach der Installation

Wenn nach der Installation von CyberPanel ein 503-Fehler angezeigt wird, können Sie die folgenden Schritte ausführen.

### LSCPD-Status prüfen

```bash title="LSCPD-Status prüfen"
systemctl status lscpd
```

Wenn LSCPD nicht läuft, starten Sie es:

```bash title="LSCPD starten"
systemctl start lscpd
```

### Virtuelle Umgebung manuell einrichten

```bash title="CyberCP-Umgebung neu aufbauen"
source /usr/local/CyberCP/bin/activate
pip install --ignore-installed -r /usr/local/CyberCP/requirments.txt
deactivate
virtualenv --system-site-packages /usr/local/CyberCP
systemctl restart lscpd
```

### Installationsprotokoll prüfen

Wenn weiterhin Probleme auftreten, suchen Sie im Installationsprotokoll unter `/var/log/installLogs.txt` nach Fehlern.

---
order: 16
title: 'DirectAdmin installieren auf Linux-Servern'
sidebarTitle: DirectAdmin installieren
category: Web panels
date: Jan 27, 2025
sourceTitle: How to install Direct admin in a Linux server?
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946490-how-to-install-direct-admin-in-a-linux-server
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'So installieren Sie DirectAdmin auf einem sauberen Linux-VPS: Systemvoraussetzungen, Lizenzprüfung und Vergleich mit cPanel vor dem Lizenzkauf.'
relatedSlugs: []
translationOf: 1737946490-how-to-install-direct-admin-in-a-linux-server
locale: de
publishAt: 2026-10-16
primaryKeyword: directadmin installieren
---
Diese Anleitung zeigt Ihnen, wie Sie DirectAdmin installieren.

### 1. Systemvoraussetzungen prüfen

Stellen Sie sicher, dass Sie die Systemvoraussetzungen erfüllen: eine saubere Betriebssystem-Installation und mindestens eine externe IP-Adresse.

- Mindestens 4 GB Arbeitsspeicher und 4 GB Swap-Speicher sowie 2 GB freier Speicherplatz nach der Installation des Betriebssystems.

#### Unterstützte Betriebssysteme

- **Red Hat Enterprise Linux und seine Derivate:** CentOS Stream, Rocky Linux und AlmaLinux
- **Debian**
- **Ubuntu**

DirectAdmin listet die unterstützten Versionen und ihre End-of-Life-Daten auf seiner Seite zu den Systemvoraussetzungen. Verwenden Sie ein 64-Bit-System (amd64 oder arm64).

### 2. Lizenzdaten prüfen

Melden Sie sich in Ihrem Kundenkonto an und klicken Sie neben Ihrer Lizenz auf den Link „view“: [https://www.directadmin.com/clients/](https://www.directadmin.com/clients/)

Prüfen Sie, ob die IP-Adresse des Servers und das Betriebssystem stimmen. Achten Sie außerdem darauf, dass die Lizenz den Status Active und Verified hat. Ist das nicht der Fall, hat das Abrechnungssystem von DirectAdmin Ihre Bestellung noch nicht verarbeitet.

### 3. DirectAdmin installieren

Melden Sie sich als root auf Ihrem Server an, laden Sie das Installationsskript herunter und führen Sie es aus:

```bash title="Run the DirectAdmin web-based installer"
sh <(curl -fsSL https://download.directadmin.com/setup.sh)
```

Das Skript führt die Ersteinrichtung des Systems durch und gibt eine URL aus. Öffnen Sie diese URL in Ihrem Browser, um die Installation abzuschließen. Für die Installation über die Kommandozeile geben Sie stattdessen Ihren Lizenzschlüssel an. Dabei werden die Standardoptionen verwendet:

```bash title="Run the DirectAdmin command-line installer"
sh <(curl -fsSL https://download.directadmin.com/setup.sh) 'YOUR-LICENSE-KEY'
```

:::warn
Der Hostname sollte nicht mit dem primären Domainnamen identisch sein. Zum Beispiel ist gary.com kein guter Hostname, server.gary.com dagegen schon. Wenn Hostname und Hauptdomain gleich sind, kommt es zu Problemen mit E-Mail und FTP. Achten Sie außerdem darauf, dass der Hostname nach der DNS-Einrichtung auflösbar ist.
:::

## Zugriff auf das Control Panel

DirectAdmin erreichen Sie unter `http://server.ip.address:2222`. Verwenden Sie den Admin-Benutzernamen und das Passwort aus den Angaben, die setup.sh ausgibt. Dieselben Angaben stehen in der Datei `/usr/local/directadmin/conf/setup.txt`.

## DirectAdmin im Vergleich zu cPanel

Beide sind kommerzielle Control Panels, und beide benötigen eine kostenpflichtige Lizenz. cPanel arbeitet mit WHM für die Verwaltung auf Serverebene. DirectAdmin nutzt eine einzige Oberfläche mit den Ebenen Admin, Reseller und Benutzer. Vergleichen Sie vor der Entscheidung die aktuellen Lizenzpreise und die unterstützten Betriebssysteme auf der Website des jeweiligen Anbieters. Wenn Sie ein kostenloses Panel suchen, lesen Sie [CyberPanel](/de/docs/install-cyber-panel-with-open-lite-speed-in-linux) oder [CentOS Web Panel](/de/docs/how-to-install-centos-web-panel-cwp-free-web-panel).

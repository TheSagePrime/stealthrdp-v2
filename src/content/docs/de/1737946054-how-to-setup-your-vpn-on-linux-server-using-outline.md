---
order: 2
title: Outline-VPN-Server einrichten mit Docker
sidebarTitle: Outline VPN mit Docker
category: VPN and networking
date: Jan 27, 2025
sourceTitle: How to Setup your VPN on Linux Server using outline?
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946054-how-to-setup-your-vpn-on-linux-server-using-outline
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Outline-VPN-Server auf einem Linux-VPS einrichten: Docker installieren, das Installationsskript ausführen, Ports öffnen und mit Outline Manager verbinden."
relatedSlugs: []
translationOf: 1737946054-how-to-setup-your-vpn-on-linux-server-using-outline
locale: de
publishAt: 2026-10-24
primaryKeyword: outline vpn server einrichten
---
Outline ist ein Open-Source-VPN von Jigsaw, das als Docker-Container auf Ihrem eigenen Server läuft. Sie verwalten es mit der Desktop-App Outline Manager und teilen Zugangsschlüssel mit Ihren Nutzern, die sich mit dem Outline Client verbinden. Diese Anleitung zeigt Ihnen, wie Sie einen Outline-VPN-Server auf einem Linux-VPS einrichten.

## Was Sie benötigen

- Einen Linux-VPS mit Root- oder sudo-Zugang, zum Beispiel einen [StealthRDP Linux-VPS](/de/linux-vps).
- Einen lokalen Computer mit installiertem [Outline Manager](https://getoutline.org/get-started/) (Windows, macOS oder Linux).
- Die Nutzung eines VPN muss den geltenden Gesetzen Ihres Landes entsprechen und den [Nutzungsbedingungen von StealthRDP](/de/docs/use-of-service) folgen.

### 1. Docker installieren

Outline läuft in Docker. Falls Docker nicht installiert ist, installieren Sie es mit dem Convenience-Skript von Docker:

```bash title="Docker installieren und starten"
curl -fsSL https://get.docker.com | sudo sh
sudo systemctl enable --now docker
```

Prüfen Sie, ob Docker läuft:

```bash title="Docker-Status prüfen"
sudo systemctl status docker
```

Die Ausgabe muss `active (running)` anzeigen. Wenn Sie diesen Schritt überspringen, bietet das Outline-Installationsskript an, Docker für Sie zu installieren.

### 2. Outline-VPN-Server mit dem Installationsskript einrichten

Öffnen Sie Outline Manager, wählen Sie **Set up Outline anywhere** und kopieren Sie den angezeigten Installationsbefehl. Zum Zeitpunkt des Verfassens dieser Anleitung lautet er:

```bash title="Outline-Installationsbefehl"
sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/OutlineFoundation/outline-apps/master/server_manager/install_scripts/install_server.sh)"
```

Führen Sie ihn auf dem Server aus. Das Skript erzeugt geheime Schlüssel und startet zwei Container: `shadowbox` (der VPN-Server) und `watchtower` (hält ihn aktuell).

### 3. Firewall-Ports öffnen

Wenn das Skript fertig ist, gibt es die zwei Ports aus, die es verwendet:

- einen **Management-Port** (TCP) für Outline Manager;
- einen **Zugangsschlüssel-Port** (TCP und UDP) für die VPN-Clients.

Wenn Sie `ufw` verwenden, erlauben Sie beide Ports. Ersetzen Sie die Nummern durch die Ports, die das Skript ausgegeben hat:

```bash title="Outline-Ports freigeben"
sudo ufw allow 12345/tcp
sudo ufw allow 23456/tcp
sudo ufw allow 23456/udp
```

### 4. Outline Manager verbinden

Das Skript endet mit einer Zeile wie dieser:

```json title="Ausgabe des Installationsskripts"
{ "apiUrl": "https://[your-server-ip]:12345/xxxxxxxx", "certSha256": "xxxxxxxx" }
```

Kopieren Sie die gesamte Zeile in Outline Manager und klicken Sie auf **Done**.

:::warn
Bewahren Sie diese Zeile privat auf. Wer sie hat, kann Ihren Server verwalten.
:::

### 5. Zugangsschlüssel teilen

Outline Manager erstellt einen ersten Schlüssel mit dem Namen **My access key**. Erstellen Sie einen Schlüssel pro Person, klicken Sie auf **Share** und senden Sie den Schlüssel. Jeder Nutzer installiert den Outline Client auf seinem Gerät und fügt den Schlüssel hinzu, um sich zu verbinden.

## Fehlerbehebung

- **Outline Manager kann keine Verbindung herstellen:** Prüfen Sie, ob der Management-Port in jeder Firewall geöffnet ist und ob der Container `shadowbox` mit `sudo docker ps` läuft.
- **Clients verbinden sich, haben aber kein Internet:** Prüfen Sie, ob der Zugangsschlüssel-Port sowohl für TCP als auch für UDP geöffnet ist.

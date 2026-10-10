---
order: 3
title: 'FASTPANEL installieren auf Linux'
sidebarTitle: FASTPANEL installieren
category: Web panels
date: Jan 27, 2025
sourceTitle: Install Fast Panel in Linux (Good Web Hosting Free Panel)
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946569-install-fast-panel-in-linux-good-web-hosting-free-panel
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "FASTPANEL installieren: Richten Sie das kostenlose Webhosting-Panel per SSH auf einem neuen Linux-VPS ein und melden Sie sich über Port 8888 an."
relatedSlugs: []
translationOf: 1737946569-install-fast-panel-in-linux-good-web-hosting-free-panel
locale: de
publishAt: 2026-10-17
primaryKeyword: fastpanel installieren
---
Mit dieser Anleitung installieren Sie FASTPANEL, ein kostenloses Webhosting-Panel. Damit erstellen Sie Websites, verwalten E-Mail, Datenbanken, Backups und geplante Aufgaben und sehen Traffic-Statistiken direkt im Browser. Sie können außerdem anderen Benutzern Zugriff auf deren eigene Websites geben. Offizielle Website: [fastpanel.direct](https://fastpanel.direct/).

## Bevor Sie FASTPANEL installieren

- **Ein frischer Server.** Installieren Sie FASTPANEL nur auf einem neu installierten Betriebssystem. Auf einem Server, auf dem bereits ein Webstack läuft, kann die Installation bestehende Websites beschädigen. Bei StealthRDP können Sie den [Server neu aufsetzen](/de/docs/how-to-rebuild-a-server), um mit einem sauberen System zu starten.
- **Ein unterstütztes 64-Bit-Betriebssystem.** FASTPANEL unterstützt Debian 9 bis 12, Ubuntu 18.04, 20.04, 22.04 und 24.04, CentOS 7, AlmaLinux 8 und Rocky Linux 8. Prüfen Sie die aktuelle Liste auf der offiziellen Website.
- **Root-Zugang per SSH.**

### 1. Per SSH verbinden

```bash title="Mit dem Server verbinden"
ssh root@your_server_ip
```

### 2. wget installieren, falls es fehlt

```bash tab="Debian oder Ubuntu" title="wget auf Debian oder Ubuntu installieren"
apt-get update && apt-get install -y wget
```

```bash tab="CentOS, AlmaLinux oder Rocky Linux" title="wget auf CentOS, AlmaLinux oder Rocky Linux installieren"
yum makecache && yum install -y wget
```

### 3. Den FASTPANEL-Installer ausführen

```bash title="Den FASTPANEL-Installer ausführen"
wget http://repo.fastpanel.direct/install_fastpanel.sh -O - | bash -
```

Der Installer richtet den Webserver, PHP, die Datenbank und die E-Mail-Dienste ein. Am Ende zeigt er die Zugangsdaten an.

### 4. Am Panel anmelden

FASTPANEL verwendet Port **8888**. Öffnen Sie diese Adresse in Ihrem Browser: `https://your_server_ip:8888`

- **Benutzername:** `fastuser`
- **Passwort:** das Passwort, das am Ende der Installation angezeigt wird.

Beim ersten Login fragt das Panel nach einer Lizenz. Geben Sie Ihre E-Mail-Adresse ein; die kostenlose Lizenz wird Ihnen dann per E-Mail zugeschickt. Ändern Sie das Passwort von `fastuser` nach der Anmeldung.

## Nächste Schritte

- Richten Sie den A-Eintrag Ihrer Domain im DNS auf die Server-IP und fügen Sie danach die Website in FASTPANEL hinzu.
- Stellen Sie für die Website ein kostenloses Let's-Encrypt-Zertifikat aus und [erzwingen Sie HTTPS](/de/docs/how-to-force-https-using-htaccess).
- Wenn Port 8888 nicht erreichbar ist, erlauben Sie ihn in Ihrer Firewall, zum Beispiel mit `ufw allow 8888/tcp`.

Sie vergleichen Panels? Lesen Sie [CyberPanel](/de/docs/install-cyber-panel-with-open-lite-speed-in-linux), [CentOS Web Panel](/de/docs/how-to-install-centos-web-panel-cwp-free-web-panel) und [DirectAdmin](/de/docs/how-to-install-direct-admin-in-a-linux-server).

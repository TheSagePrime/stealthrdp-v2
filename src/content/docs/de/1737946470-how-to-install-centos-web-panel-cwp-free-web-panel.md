---
order: 5
title: 'Control Web Panel installieren (CWP auf Linux)'
sidebarTitle: CWP installieren
category: Web panels
date: Jan 27, 2025
sourceTitle: How to install Centos Web Panel (CWP) (Free Web Panel)
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946470-how-to-install-centos-web-panel-cwp-free-web-panel
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'Control Web Panel installieren: Installieren Sie das kostenlose CWP per SSH auf einem AlmaLinux-8- oder 9-VPS und verwalten Sie danach Websites, E-Mail und DNS.'
relatedSlugs: []
translationOf: 1737946470-how-to-install-centos-web-panel-cwp-free-web-panel
locale: de
publishAt: 2026-10-24
primaryKeyword: control web panel installieren
---
In dieser Anleitung erfahren Sie, wie Sie Control Web Panel (CWP) auf einem Linux-Server mit AlmaLinux installieren. Wir halten jeden Schritt so einfach wie möglich. Die kostenlose Version bietet folgende Funktionen:

- Apache-Webserver (ModSecurity + automatisch aktualisierte Regeln optional)
- PHP-Versionswechsler (auf AlmaLinux 9: PHP 7.4 bis 8.4 und neuer)
- MySQL/MariaDB + phpMyAdmin
- Postfix + Dovecot + Roundcube-Webmail (Virenschutz, SpamAssassin optional)
- CSF-Firewall
- Dateisystem-Sperre (Ihre Dateien sind vor Änderungen gesperrt, was Website-Hacks erschwert)
- Backups (optional)
- AutoFixer für die Serverkonfiguration
- CloudLinux + CageFS + PHP Selector
- Softaculous
- Skriptinstallationsprogramm (kostenlos und Premium)
- LiteSpeed Enterprise (Webserver)
- Richtet den Server für Webhosting ein (Websites wie WordPress)
- API für die einfachere Kontoverwaltung und eine Abrechnungs-API
- NAT-Version, Unterstützung für NAT-IP-Adressen

:::info
Einige Funktionen sind nur in CWP Pro verfügbar, einem kostenpflichtigen Upgrade.
:::

## Hinweise

:::warn
- Für CWP gibt es kein Deinstallationsprogramm. Nach der Installation von CWP müssen Sie den Server neu aufsetzen, um CWP wieder zu entfernen.
- CWP unterstützt nur statische IP-Adressen. Dynamische, Sticky- oder interne IP-Adressen werden nicht unterstützt.
- Installieren Sie CWP nur auf einem frisch installierten Betriebssystem ohne Konfigurationsänderungen.
:::

Um mit einem unterstützten System zu beginnen, wählen Sie bei der Bestellung auf einem [StealthRDP Linux-VPS](/de/plans) AlmaLinux 8 oder 9.

## Systemanforderungen

Stellen Sie sicher, dass Sie die folgenden Aufgaben erledigt haben, bevor Sie mit der Installation beginnen.

### Hostname

Legen Sie einen vollständig qualifizierten Hostnamen fest, der mit keiner Domain auf dem Server übereinstimmt:

```bash title="Hostname festlegen"
hostname srv1.example.com
```

### Softwareanforderungen

Sie benötigen eine saubere, frische Installation eines unterstützten Betriebssystems:

- **AlmaLinux 8 oder 9, minimal (empfohlen):** die für CWP am besten unterstützte Wahl. AlmaLinux 10 steht nicht auf der CWP-Liste.
- **Rocky Linux 8 oder 9, minimal:** unterstützt, doch CWP meldet einige Probleme und bevorzugt AlmaLinux.
- **CentOS 7:** nicht empfohlen. CentOS 7 hat das Ende seiner Lebensdauer im Juni 2024 erreicht. Verwenden Sie es deshalb nicht für einen neuen CWP-Server.

### Hardwareanforderungen

64-Bit-Systeme benötigen mindestens 2 GB RAM.

**Empfohlenes System:** 4 GB+ RAM, damit der volle Funktionsumfang zur Verfügung steht, zum Beispiel das Virenscannen von E-Mails.

## Server vorbereiten

### 1. EPEL und wget installieren

```bash title="EPEL und wget installieren"
dnf install epel-release -y
dnf -y install wget
```

### 2. Server aktualisieren

```bash title="Pakete aktualisieren"
yum -y update
```

### 3. Server neu starten

```bash title="Neustart"
reboot
```

## Control Web Panel installieren

Jetzt sind Sie bereit, mit der Installation von CWP zu beginnen. Das CWP-Installationsprogramm kann länger als 30 Minuten dauern, weil es Apache und PHP aus dem Quellcode kompilieren muss.

```bash tab="AlmaLinux 9 (EL9-Installationsprogramm)" title="CWP auf AlmaLinux 9 installieren"
cd /usr/local/src
wget http://centos-webpanel.com/cwp-el9-latest
sh cwp-el9-latest
```

```bash tab="AlmaLinux 8 (EL8-Installationsprogramm)" title="CWP auf AlmaLinux 8 installieren"
cd /usr/local/src
wget http://centos-webpanel.com/cwp-el8-latest
sh cwp-el8-latest
```

Rocky Linux 8 und 9 verwenden dieselben Installationsprogramme: `cwp-el8-latest` und `cwp-el9-latest`.

## Optionale Argumente

Verfügbare Argumente mit langen Namen:

- `--restart yes` für einen automatischen Neustart nach einer erfolgreichen Installation
- `--phpfpm <version>` (Sie können nur eine Version angeben). Beim EL9-Installationsprogramm werden PHP 7.4 bis 8.4 und neuer unterstützt.
- `--softaculous yes`, um Softaculous, das Skriptinstallationsprogramm, zu installieren

Verfügbare Argumente mit kurzen Namen:

- `-r yes` für einen automatischen Neustart nach einer erfolgreichen Installation
- `-p <version>` (Sie können nur eine Version angeben)
- `-s yes`, um Softaculous, das Skriptinstallationsprogramm, zu installieren

Beispiel für AlmaLinux 9 (Sie können kurze und lange Argumente kombinieren):

```bash title="CWP auf AlmaLinux 9 mit Optionen installieren"
sh cwp-el9-latest -r yes -s yes
```

Alle diese Zusatzkomponenten können Sie auch später über die CWP-Oberfläche (GUI) installieren.

## Server neu starten

Starten Sie Ihren Server neu, damit alle Updates wirksam werden und CWP gestartet wird.

```bash title="Neustart"
reboot
```

## CloudLinux (optional)

Für CloudLinux benötigen Sie eine Lizenz.

```bash title="CloudLinux installieren"
wget https://repo.cloudlinux.com/cloudlinux/sources/cln/cldeploy
sh cldeploy -k YOUR-KEY
cd /usr/local/src/
wget https://dl1.centos-webpanel.com/files/c_scripts/cloudlinux.sh
sh cloudlinux.sh
```

:::warn
Nachdem das CloudLinux-Installationsprogramm abgeschlossen ist, startet es den Server automatisch neu.
:::

Nach dem Neustart müssen Sie CageFS erstellen und aktivieren:

```bash title="CageFS erstellen und aktivieren"
/usr/sbin/cagefsctl --init
cagefsctl --enable-all
```

## Konfiguration

Melden Sie sich mit dem Link, den das Installationsprogramm auf Ihrem Server ausgibt, bei Ihrem CWP-Server an:

- Control WebPanel-Admin-GUI: `http://SERVER-IP:2030/`
- Benutzername: `root`
- Passwort: Ihr Root-Passwort

Richten Sie danach die Root-E-Mail-Adresse ein, legen Sie mindestens ein Hosting-Paket an (oder bearbeiten Sie das Standardpaket) und setzen Sie die gemeinsame IP-Adresse. Diese muss Ihre öffentliche IP-Adresse sein.

## Nameserver einrichten

Jetzt können Sie Domains hosten.

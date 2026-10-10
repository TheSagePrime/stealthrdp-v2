---
order: 6
title: OpenVPN TUN/TAP auf dem VPS einrichten
sidebarTitle: TUN/TAP einrichten
category: VPN and networking
date: Jan 27, 2025
sourceTitle: Setup Tun/Tap For OpenVPN
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946390-setup-tun-tap-for-open_vpn
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "OpenVPN TUN/TAP einrichten: Folgen Sie den Schritten, um den Fehler „tun needs to be installed“ zu beheben."
relatedSlugs: []
translationOf: 1737946390-setup-tun-tap-for-open_vpn
locale: de
publishAt: 2026-10-19
primaryKeyword: openvpn tun/tap
---
Folgen Sie den nachstehenden Schritten, um den Fehler „tun needs to be installed“ bei OpenVPN TUN/TAP zu beheben.

### 1. Per SSH mit Ihrem VPS verbinden

### 2. System aktualisieren

```bash title="System aktualisieren"
sudo apt-get update && sudo apt-get upgrade -y
```

### 3. Die folgenden Befehle ausführen

```bash title="TUN-Gerät erstellen"
mkdir /dev/net
mknod /dev/net/tun c 10 200
chmod 666 /dev/net/tun
```

Nachdem Sie diese Befehle ausgeführt haben, installieren Sie OpenVPN wie gewohnt.

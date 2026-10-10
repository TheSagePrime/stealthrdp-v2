---
order: 6
title: Configurar TUN/TAP para OpenVPN en tu VPS
sidebarTitle: Activar TUN/TAP
category: VPN and networking
date: Jan 27, 2025
sourceTitle: Setup Tun/Tap For OpenVPN
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946390-setup-tun-tap-for-open_vpn
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Sigue estos pasos para solucionar el error de OpenVPN «tun needs to be installed» creando el dispositivo TUN en tu VPS."
relatedSlugs: []
translationOf: 1737946390-setup-tun-tap-for-open_vpn
locale: es
publishAt: 2026-10-19
primaryKeyword: openvpn tun tap
---
Sigue estos pasos para solucionar el error de OpenVPN «tun needs to be installed».

### 1. Conéctate a tu VPS por SSH

### 2. Actualiza el sistema

```bash title="Actualizar el sistema"
sudo apt-get update && sudo apt-get upgrade -y
```

### 3. Ejecuta los comandos para crear el dispositivo TUN

```bash title="Crear el dispositivo TUN"
mkdir /dev/net
mknod /dev/net/tun c 10 200
chmod 666 /dev/net/tun
```

Tras ejecutar estos comandos, instala OpenVPN como lo harías normalmente.

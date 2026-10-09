---
order: 6
title: Setup Tun/Tap For OpenVPN
sidebarTitle: Set up TUN/TAP
category: VPN and networking
date: Jan 27, 2025
sourceTitle: Setup Tun/Tap For OpenVPN
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946390-setup-tun-tap-for-open_vpn
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Please follow the steps below to fix the error: tun needs to be installed"
relatedSlugs: []
---
Follow the steps below to fix the error: tun needs to be installed.

1. SSH into your VPS.

2. Update the system:

   ```bash title="Update the system"
   sudo apt-get update && sudo apt-get upgrade -y
   ```

3. Run the following commands:

   ```bash title="Create the TUN device"
   mkdir /dev/net
   mknod /dev/net/tun c 10 200
   chmod 666 /dev/net/tun
   ```

After running those commands, install your OpenVPN as normal.

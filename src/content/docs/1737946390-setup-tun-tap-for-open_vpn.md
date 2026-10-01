---
order: 6
title: Setup Tun/Tap For OpenVPN
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
Setup Tun/Tap For OpenVPN

Setup Tun/Tap For OpenVPN
=========================

Last updated on Jan 27, 2025

Please follow the steps below to fix the error: tun needs to be installed
-------------------------------------------------------------------------

1.  SSH into your vps!
    
2.  Update the system:

```bash
sudo apt-get update && sudo apt-get upgrade -y
```
    

**3\. Run The Following Commands**

```bash
mkdir /dev/net
mknod /dev/net/tun c 10 200
chmod 666 /dev/net/tun
```

**After Running those commands install your OpenVPN as normal**
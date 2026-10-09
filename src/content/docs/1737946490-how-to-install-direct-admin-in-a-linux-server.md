---
order: 16
title: 'How to Install DirectAdmin on a Linux Server'
sidebarTitle: Install DirectAdmin
category: Web panels
date: Jan 27, 2025
sourceTitle: How to install Direct admin in a Linux server?
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946490-how-to-install-direct-admin-in-a-linux-server
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'Check the DirectAdmin system requirements, install it on a clean Linux VPS, and compare DirectAdmin with cPanel before you buy a licence.'
relatedSlugs: []
---
This guide shows how to install DirectAdmin on your Linux server.

## Step 1: Check the system requirements

Make sure that you meet the system requirements: a clean OS install and at least one external IP address.

### Supported OS and versions

- **CloudLinux:** 6.x 64-bit, 7.x 64-bit, 8.x 64-bit
- **AlmaLinux / RHEL / CentOS:** 7.x 64-bit, 8.x 64-bit
- **Debian:** 8.x 64-bit, 9.x 64-bit, 10.x 64-bit, 11.x 64-bit ALPHA
- **Ubuntu:** 16.04 64-bit, 18.04 64-bit, 20.04 64-bit
- **FreeBSD:** 11.x 64-bit, 12.x 64-bit

## Step 2: Make sure your license information is correct

Sign in to your client account and click the "view" link next to your license here: [https://www.directadmin.com/clients/](https://www.directadmin.com/clients/)

Verify that the server IP address and operating system is correct. Also make sure that the license is Active and Verified (if it isn't, then DirectAdmin's billing system hasn't processed your order yet).

## Step 3: Begin the installation

Log in as root to your server, download the installation script, and run it:

```bash title="Run the DirectAdmin setup script"
bash <(curl -Ss https://www.directadmin.com/setup.sh || wget -O - https://www.directadmin.com/setup.sh) auto
```

The auto method will be best for most people. It automatically installs everything for you, including the CSF firewall. It can also be called without the 'auto' option, which requires input but allows for customization.

:::warn
The hostname should not be the same as the primary domain name. For example, gary.com is not a good hostname, where server.gary.com is. Having the same host/main domain name will cause e-mail and FTP problems. Also, make sure the hostname resolves once you set up DNS.
:::

## Access the control panel

DirectAdmin can be accessed at `http://server.ip.address:2222`. Use the Admin username/password from the output information provided by setup.sh (the same information is specified in the `/usr/local/directadmin/scripts/setup.txt` file).

## DirectAdmin vs cPanel

Both are commercial control panels and both need a paid licence. cPanel pairs with WHM for server-level administration. DirectAdmin uses one interface with admin, reseller and user levels. Compare the current licence prices and supported operating systems on each vendor's website before you choose. If you want a free panel, see [CyberPanel](/docs/install-cyber-panel-with-open-lite-speed-in-linux) or [CentOS Web Panel](/docs/how-to-install-centos-web-panel-cwp-free-web-panel).

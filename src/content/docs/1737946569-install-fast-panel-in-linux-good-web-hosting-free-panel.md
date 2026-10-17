---
order: 3
title: How to Install FASTPANEL on Linux
sidebarTitle: Install FASTPANEL
category: Web panels
date: Jan 27, 2025
sourceTitle: Install Fast Panel in Linux (Good Web Hosting Free Panel)
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946569-install-fast-panel-in-linux-good-web-hosting-free-panel
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Install FASTPANEL, a free web hosting control panel, on a fresh Linux VPS over SSH, then log in on port 8888 to manage sites, mail, databases and backups."
relatedSlugs: []
---
FASTPANEL is a free web hosting control panel. It lets you create sites, manage mail, databases, backups and scheduled tasks, and see traffic statistics from a browser. You can also give other users access to their own sites. Official site: [fastpanel.direct](https://fastpanel.direct/).

## Before you start

- **A fresh server.** Install FASTPANEL only on a newly installed operating system. Installing it on a server that already runs a web stack can break existing sites. On StealthRDP, you can [rebuild the server](/docs/how-to-rebuild-a-server) to start clean.
- **A supported OS (64-bit).** FASTPANEL lists Debian 9 to 12, Ubuntu 18.04, 20.04, 22.04 and 24.04, CentOS 7, AlmaLinux 8 and Rocky Linux 8. Check the official site for the current list.
- **Root access over SSH.**

### 1. Connect over SSH

```bash title="Connect to the server"
ssh root@your_server_ip
```

### 2. Install wget if it is missing

```bash tab="Debian or Ubuntu" title="Install wget on Debian or Ubuntu"
apt-get update && apt-get install -y wget
```

```bash tab="CentOS, AlmaLinux or Rocky Linux" title="Install wget on CentOS, AlmaLinux or Rocky Linux"
yum makecache && yum install -y wget
```

### 3. Run the FASTPANEL installer

```bash title="Run the FASTPANEL installer"
wget http://repo.fastpanel.direct/install_fastpanel.sh -O - | bash -
```

The installer sets up the web server, PHP, database and mail services. It prints the access details when it finishes.

### 4. Log in to the panel

FASTPANEL uses port **8888**. Open this address in your browser: `https://your_server_ip:8888`

- **Username:** `fastuser`
- **Password:** the password printed at the end of the installation.

On first login, the panel asks for a licence. Enter your email address and the free licence is sent to you. Change the `fastuser` password after you log in.

## Next steps

- Point your domain's DNS A record at the server IP, then add the site in FASTPANEL.
- Issue a free Let's Encrypt certificate for the site and [force HTTPS](/docs/how-to-force-https-using-htaccess).
- If port 8888 does not open, allow it in your firewall, for example `ufw allow 8888/tcp`.

Comparing panels? See [CyberPanel](/docs/install-cyber-panel-with-open-lite-speed-in-linux), [CentOS Web Panel](/docs/how-to-install-centos-web-panel-cwp-free-web-panel) and [DirectAdmin](/docs/how-to-install-direct-admin-in-a-linux-server).

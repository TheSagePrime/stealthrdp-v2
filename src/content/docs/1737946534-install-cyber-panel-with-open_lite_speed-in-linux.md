---
order: 18
title: 'Install CyberPanel with OpenLiteSpeed on Linux'
sidebarTitle: Install CyberPanel
category: Web panels
date: Jan 27, 2025
sourceTitle: Install Cyber Panel With OpenLiteSpeed in Linux
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946534-install-cyber-panel-with-open_lite_speed-in-linux
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'Install CyberPanel with OpenLiteSpeed on a fresh Linux VPS over SSH, then open the panel to manage websites, email and databases.'
relatedSlugs: []
---
In this tutorial, we will be installing CyberPanel on a Linux server, and I will try to make the tutorial as easy as possible. We are going to use the free plan, which offers:

- Unlimited domains
- Unlimited subdomains
- Unlimited databases
- Multiple PHP versions
- Let's Encrypt SSL
- LSCache for WordPress
- Community support
- OpenLiteSpeed server

CyberPanel needs a fresh installation of one of these systems, with at least 1024 MB of RAM and 10 GB of disk space:

- Ubuntu 18.04, 20.04 or 22.04
- AlmaLinux 8 or 9
- CloudLinux 8

CyberPanel's install guide does not list Ubuntu 24.04 or AlmaLinux 10, so choose one of the systems above at checkout.

### 1. Update and refresh repository lists

Open a terminal window, and enter the following:

```bash tab="Ubuntu" title="Update package lists"
sudo apt update
```

```bash tab="AlmaLinux 8 or 9" title="Update package lists"
sudo yum update
```

### 2. Install CyberPanel

We are ready to install CyberPanel now. Enter this single command, then follow the installer step by step:

```bash title="Run the CyberPanel installer"
sh <(curl https://cyberpanel.net/install.sh || wget -O - https://cyberpanel.net/install.sh)
```

:::tip
If you don't know how to troubleshoot SQL errors, install it without remote SQL to avoid technical errors in the future.
:::

## Access

After the successful installation, you can access CyberPanel using the details below (until you have specified login credentials during installation). Make sure to change them.

- Visit: `https://YOUR-SERVER-IP:8090`
- Username: `admin`
- Password: `1234567` (change it after the first login)

## 503 error after install

If you get a 503 error after installing CyberPanel, you can do one of the following things.

### Check the LSCPD status

```bash title="Check LSCPD status"
systemctl status lscpd
```

If LSCPD is not running, start it:

```bash title="Start LSCPD"
systemctl start lscpd
```

### Set up the virtual environment manually

```bash title="Rebuild the CyberCP virtual environment"
source /usr/local/CyberCP/bin/activate
pip install --ignore-installed -r /usr/local/CyberCP/requirments.txt
deactivate
virtualenv --system-site-packages /usr/local/CyberCP
systemctl restart lscpd
```

### Check the install logs

If you still have issues, look for errors in the install log at `/var/log/installLogs.txt`.

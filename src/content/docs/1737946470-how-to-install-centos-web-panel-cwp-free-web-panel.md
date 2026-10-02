---
order: 5
title: 'How to Install CentOS Web Panel (CWP) on Linux'
category: Web panels
date: Jan 27, 2025
sourceTitle: How to install Centos Web Panel (CWP) (Free Web Panel)
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946470-how-to-install-centos-web-panel-cwp-free-web-panel
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'Install the free CentOS Web Panel (CWP) control panel on a Linux VPS over SSH, then log in to manage websites, email and DNS.'
relatedSlugs: []
---
How to Install CentOS Web Panel (CWP) on Linux

Last updated on Jan 27, 2025

In this tutorial, we will be installing CWP on a Linux Centos server and I will try to make the tutorial as easy as possible, we are going to use the free plan which offers:

**(Some features are only available in CWP Pro, a paid upgrade.)**

– Apache Web Server (Mod Security + Automatic updated rules optional) – PHP 5.6 (suPHP, SuExec + PHP version switcher) – MySQL/MariaDB + phpMyAdmin – Postfix + Dovecot + roundcube webmail (Antivirus, Spamassassin optional) – CSF Firewall – File System Lock (no more website hacking, all your files are locked from changes) – Backups (optional) – AutoFixer for server configuration – CloudLinux + CageFS + PHP Selector – Softaculous – Script Installer (Free and Premium) – LiteSpeed Enterprise (Web Server) – Setups Server for Web Hosting (websites like WordPress…) – API for easier account management, and billing API – NAT-ed version, support for NAT-ed IPs

**Notes:**

There is no uninstaller for CWP After you install CWP, you must reinstall the server to remove it. It only supports static IP addresses. It do not support dynamic, sticky, or internal IP addresses. Only install CWP on a freshly installed operating system without any configuration changes For best performance We suggest you order a VPS or Dedicated servers from eFlame.

**System Requirements**

Make sure that you complete the following tasks before you start the installation process:

**1\. Setup Hostname:**

```bash
hostname srv1.example.com
```

**2\. Software Requirements**

You must have a clean/fresh installation of supported operating systems:

**CentOS 6, RedHat 6 or CloudLinux 6, MINIMAL installation and English version only!**

NOT Recommended for the new installations as we don’t develop new features for it

**CentOS 7 minimal is recommended version. (RECOMMENDED)**

The best version to be used with CWP as it provides the most features and CWP Secure Kernel.

**CentOS 8 (Stream) is also supported.**

We have our custom repositories making CentOS 8 Stream a stable version.

**3\. Hardware Requirements**

64 bit operating systems require a minimum of 1024 MB RAM (recommended).

**Recommended System: 4 GB+ RAM so you would have the full functionality such as Anti-virus scan of emails**

**1\. Preparing Server:**

```bash
yum -y install wget
```

For CentOS 8, you may need to install the EPEL repository to be able to install tools like wget:

```bash
yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
dnf install wget -y
```

**2\. Server Update:**

```bash
yum -y update
```

**3\. Reboot Server:**

```bash
reboot
```

**Installation**

Now you are ready to start CWP Installation CWP installer can run more than 30 minutes because it needs to compile apache and php from source.

**CentOS 6: New Installer with MARIA-DB 10-latest (NOT recommended)**

```bash
cd /usr/local/src
wget http://centos-webpanel.com/cwp-latest
sh cwp-latest
```

**CentOS 7: Installer for CentOS 7 (recommended)**

```bash
cd /usr/local/src
wget http://centos-webpanel.com/cwp-el7-latest
sh cwp-el7-latest
```

**CentOS 8: Installer for CentOS 8**

```bash
cd /usr/local/src
wget http://centos-webpanel.com/cwp-el8-latest
sh cwp-el8-latest
```

**Optionals**

Available long name arguments:

- `--restart yes` for an automatic restart after a successful install
- `--phpfpm [5.3|5.4|5.5|5.6|7.0|7.1|7.2|7.3|7.4]` (you can use only one)
- `--softaculous yes` to install Softaculous, the script installer

**Available short name arguments**

- `-r yes` for an automatic restart after a successful install
- `-p [5.3|5.4|5.5|5.6|7.0|7.1|7.2|7.3|7.4]` (you can use only one)
- `-s yes` to install Softaculous, the script installer

**Example for centos 7 (you can combine short and long name arguments)**

```bash
sh cwp-el7-latest -r yes --phpfpm 7.3 --softaculous yes
```

Any of these additions can also be installed later from the CWP GUI.

**Reboot Server**

Reboot your server so that all updates can take effect and CWP gets started.

```bash
reboot
```

**Cloud Linux Optional (You need a license to use it)**

```bash
wget https://repo.cloudlinux.com/cloudlinux/sources/cln/cldeploy
sh cldeploy -k YOUR-KEY
cd /usr/local/src/
wget https://dl1.centos-webpanel.com/files/c_scripts/cloudlinux.sh
sh cloudlinux.sh
```

**After CloudLinux installer is done it will automatically reboot the server! After reboot, you need to build CageFS and enable it**

```bash
/usr/sbin/cagefsctl --init
cagefsctl --enable-all
```

**Configuration**

Log in to your CWP server using the link provided by the installer on your server. 

- Control WebPanel Admin GUI: `http://SERVER-IP:2030/`
- Username: `root`
- Password: your root password

Then set up the root email, set up at least one hosting package (or edit the default package), and set the shared IP, which must be your public IP address.

**Setup nameservers** **And now you are ready to host domains.**
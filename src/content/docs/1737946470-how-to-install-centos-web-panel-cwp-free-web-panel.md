---
order: 5
title: 'How to Install CentOS Web Panel (CWP) on Linux'
sidebarTitle: Install CentOS Web Panel
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
In this tutorial, we will be installing CWP on a Linux CentOS server, and I will try to make the tutorial as easy as possible. We are going to use the free plan, which offers:

- Apache web server (ModSecurity + automatic updated rules optional)
- PHP 5.6 (suPHP, SuExec + PHP version switcher)
- MySQL/MariaDB + phpMyAdmin
- Postfix + Dovecot + Roundcube webmail (antivirus, SpamAssassin optional)
- CSF firewall
- File system lock (no more website hacking, all your files are locked from changes)
- Backups (optional)
- AutoFixer for server configuration
- CloudLinux + CageFS + PHP Selector
- Softaculous
- Script installer (free and premium)
- LiteSpeed Enterprise (web server)
- Setups server for web hosting (websites like WordPress)
- API for easier account management, and billing API
- NAT-ed version, support for NAT-ed IPs

:::info
Some features are only available in CWP Pro, a paid upgrade.
:::

## Notes

:::warn
- There is no uninstaller for CWP. After you install CWP, you must reinstall the server to remove it.
- It only supports static IP addresses. It does not support dynamic, sticky, or internal IP addresses.
- Only install CWP on a freshly installed operating system without any configuration changes.
:::

For best performance, we suggest you order a VPS or dedicated server from eFlame.

## System requirements

Make sure that you complete the following tasks before you start the installation process.

### Hostname

Set the server hostname:

```bash title="Set hostname"
hostname srv1.example.com
```

### Software requirements

You must have a clean, fresh installation of a supported operating system:

- **CentOS 6, RedHat 6 or CloudLinux 6:** MINIMAL installation and English version only. Not recommended for new installations, as we don't develop new features for it.
- **CentOS 7 minimal (recommended):** The best version to be used with CWP, as it provides the most features and the CWP Secure Kernel.
- **CentOS 8 (Stream):** Also supported. We have our own custom repositories, which make CentOS 8 Stream a stable version.

### Hardware requirements

64-bit operating systems require a minimum of 1024 MB RAM (recommended).

**Recommended system:** 4 GB+ RAM, so you have the full functionality, such as antivirus scanning of emails.

## Prepare the server

1. Install wget:

   ```bash title="Install wget"
   yum -y install wget
   ```

   For CentOS 8, you may need to install the EPEL repository to be able to install tools like wget:

   ```bash title="Install EPEL and wget (CentOS 8)"
   yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
   dnf install wget -y
   ```

2. Update the server:

   ```bash title="Update packages"
   yum -y update
   ```

3. Reboot the server:

   ```bash title="Reboot"
   reboot
   ```

## Install CWP

Now you are ready to start the CWP installation. The CWP installer can run for more than 30 minutes because it needs to compile Apache and PHP from source.

### CentOS 6: new installer with MariaDB 10 latest (not recommended)

```bash title="Install CWP on CentOS 6"
cd /usr/local/src
wget http://centos-webpanel.com/cwp-latest
sh cwp-latest
```

### CentOS 7: installer for CentOS 7 (recommended)

```bash title="Install CWP on CentOS 7"
cd /usr/local/src
wget http://centos-webpanel.com/cwp-el7-latest
sh cwp-el7-latest
```

### CentOS 8: installer for CentOS 8

```bash title="Install CWP on CentOS 8"
cd /usr/local/src
wget http://centos-webpanel.com/cwp-el8-latest
sh cwp-el8-latest
```

## Optional arguments

Available long-name arguments:

- `--restart yes` for an automatic restart after a successful install
- `--phpfpm [5.3|5.4|5.5|5.6|7.0|7.1|7.2|7.3|7.4]` (you can use only one)
- `--softaculous yes` to install Softaculous, the script installer

Available short-name arguments:

- `-r yes` for an automatic restart after a successful install
- `-p [5.3|5.4|5.5|5.6|7.0|7.1|7.2|7.3|7.4]` (you can use only one)
- `-s yes` to install Softaculous, the script installer

Example for CentOS 7 (you can combine short and long name arguments):

```bash title="Install CWP on CentOS 7 with options"
sh cwp-el7-latest -r yes --phpfpm 7.3 --softaculous yes
```

Any of these additions can also be installed later from the CWP GUI.

## Reboot the server

Reboot your server so that all updates can take effect and CWP gets started.

```bash title="Reboot"
reboot
```

## CloudLinux (optional)

You need a license to use CloudLinux.

```bash title="Install CloudLinux"
wget https://repo.cloudlinux.com/cloudlinux/sources/cln/cldeploy
sh cldeploy -k YOUR-KEY
cd /usr/local/src/
wget https://dl1.centos-webpanel.com/files/c_scripts/cloudlinux.sh
sh cloudlinux.sh
```

:::warn
After the CloudLinux installer is done, it will automatically reboot the server.
:::

After the reboot, you need to build CageFS and enable it:

```bash title="Build and enable CageFS"
/usr/sbin/cagefsctl --init
cagefsctl --enable-all
```

## Configuration

Log in to your CWP server using the link provided by the installer on your server:

- Control WebPanel admin GUI: `http://SERVER-IP:2030/`
- Username: `root`
- Password: your root password

Then set up the root email, set up at least one hosting package (or edit the default package), and set the shared IP, which must be your public IP address.

## Set up nameservers

And now you are ready to host domains.

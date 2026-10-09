---
order: 5
title: 'How to Install Control Web Panel (CWP) on Linux'
sidebarTitle: Install Control Web Panel
category: Web panels
date: Jan 27, 2025
sourceTitle: How to install Centos Web Panel (CWP) (Free Web Panel)
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946470-how-to-install-centos-web-panel-cwp-free-web-panel
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'Install the free Control Web Panel (CWP) on an AlmaLinux 8 or 9 VPS over SSH, then log in to manage websites, email and DNS.'
relatedSlugs: []
---
In this tutorial, we will be installing CWP on a Linux AlmaLinux server, and I will try to make the tutorial as easy as possible. We are going to use the free plan, which offers:

- Apache web server (ModSecurity + automatic updated rules optional)
- PHP version switcher (on AlmaLinux 9, PHP 7.4 to 8.4 and later)
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

To start from a supported system, choose AlmaLinux 8 or 9 at checkout on a [StealthRDP Linux VPS](/plans).

## System requirements

Make sure that you complete the following tasks before you start the installation process.

### Hostname

Set a fully qualified hostname that does not match any domain on the server:

```bash title="Set hostname"
hostname srv1.example.com
```

### Software requirements

You must have a clean, fresh installation of a supported operating system:

- **AlmaLinux 8 or 9, minimal (recommended):** the best-supported choice for CWP. AlmaLinux 10 is not on CWP's list.
- **Rocky Linux 8 or 9, minimal:** supported, but CWP reports some issues and prefers AlmaLinux.
- **CentOS 7:** not recommended. CentOS 7 reached end of life in June 2024, so do not use it for a new CWP server.

### Hardware requirements

64-bit systems require at least 2 GB of RAM.

**Recommended system:** 4 GB+ RAM, so you have the full functionality, such as antivirus scanning of emails.

## Prepare the server

1. Install EPEL and wget:

   ```bash title="Install EPEL and wget"
   dnf install epel-release -y
   dnf -y install wget
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

### AlmaLinux 9 (EL9 installer)

```bash title="Install CWP on AlmaLinux 9"
cd /usr/local/src
wget http://centos-webpanel.com/cwp-el9-latest
sh cwp-el9-latest
```

### AlmaLinux 8 (EL8 installer)

```bash title="Install CWP on AlmaLinux 8"
cd /usr/local/src
wget http://centos-webpanel.com/cwp-el8-latest
sh cwp-el8-latest
```

Rocky Linux 8 and 9 use the same installers: `cwp-el8-latest` and `cwp-el9-latest`.

## Optional arguments

Available long-name arguments:

- `--restart yes` for an automatic restart after a successful install
- `--phpfpm <version>` (you can use only one). On the EL9 installer, PHP 7.4 to 8.4 and later are supported.
- `--softaculous yes` to install Softaculous, the script installer

Available short-name arguments:

- `-r yes` for an automatic restart after a successful install
- `-p <version>` (you can use only one)
- `-s yes` to install Softaculous, the script installer

Example for AlmaLinux 9 (you can combine short and long name arguments):

```bash title="Install CWP on AlmaLinux 9 with options"
sh cwp-el9-latest -r yes -s yes
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

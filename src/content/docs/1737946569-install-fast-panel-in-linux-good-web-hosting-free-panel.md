---
order: 3
title: Install Fast Panel in Linux (Good Web Hosting Free Panel)
category: Web panels
date: Jan 27, 2025
sourceTitle: Install Fast Panel in Linux (Good Web Hosting Free Panel)
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946569-install-fast-panel-in-linux-good-web-hosting-free-panel
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: Introduction
relatedSlugs: []
---
Install Fast Panel in Linux (Good Web Hosting Free Panel)

Install Fast Panel in Linux (Good Web Hosting Free Panel)
=========================================================

Last updated on Jan 27, 2025

Introduction
------------

FASTPANEL is a simple and powerful server management panel that allows you to create sites in a few clicks, manage mail, databases, backups, plan tasks, and analyze traffic. Set and configure access rights as you like - each site can be assigned to a single user. To improve the security of your account, connect two-factor authentication.

**More information can be found on an official web page: You will have to buy the free license from their website and enter your server IP address and it will be activated. https://fastpanel.direct/** **Demo version can be tried here: https://fastpanel.direct/demo** **Installation Requirements:**

Please note that the panel can only be installed on a freshly installed operating system (only Debian 8, Debian 9, Debian 10, Ubuntu 18.04, Ubuntu 20.04 and CentOS 7 are supported). Installation on the configured server is impossible!

**Step 1**

. Connect to your server via SSH using your root-password

**Step 2. If wget utility is not installed on your server, execute the following commands in order to get it: Debian/Ubuntu:**

apt-get update; apt-get install wget

**CentOS:**

yum makecache; yum install wget

**Step 3.**

Initiate FASTPANEL® installation by running the following command:

wget http://repo.fastpanel.direct/install\_fastpanel.sh -O - | bash -

**Step 4.**

After successful installation of FASTPANEL® you will get a message with the access data

**Installation Done**

Congratulations! FASTPANEL® successfully installed and available now for you at FASTPANEL uses 8888 port, so to connect to the control panel on your internet browser enter: https://ip\_of\_your\_server:8888 On your first login, the Panel will ask you for a license. In order to get one, simply enter your email address. The license data will be sent to your email address. Log in details for the first attempt to log in are: Username: fastuser The password for the "fastuser" user matches the "root" user password of the server
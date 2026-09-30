---
order: 17
title: Install Cpanel and WHM in Linux (You need a license)
category: Web panels
date: Jan 27, 2025
sourceTitle: Install Cpanel and WHM in Linux (You need a license)
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946509-install-cpanel-and-whm-in-linux-you-need-a-license
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: In this tutorial, we will be installing a Cpanel and WHM in a Linux server and I will try to make the tutorial as easy as possible, You will have to buy the Cpanel license from their website.
relatedSlugs: []
---
Install Cpanel and WHM in Linux (You need a license)

Install Cpanel and WHM in Linux (You need a license)
====================================================

Last updated on Jan 27, 2025

In this tutorial, we will be installing a Cpanel and WHM in a Linux server and I will try to make the tutorial as easy as possible, You will have to buy the Cpanel license from their website.

**Important Note:**

cPanel, L.L.C. designs software for commercial hosting. Therefore, we only license publicly visible, static IP addresses. We do not license dynamic, reserved, sticky, or internal IP addresses. We do not provide an uninstaller. If you wish to remove our software, you must reformat the server. Only install cPanel & WHM on a freshly installed operating system. You must log in to the server as the root user in order to install cPanel & WHM. If you do not possess root-level access, contact your system administrator or hosting provider for assistance. We recommend that you use the cPanel & WHM installer, which installs all of the services that it requires. If you install services before you install cPanel & WHM, you will encounter compatibility issues. New installations of cPanel & WHM default to the fast installation mode. To disable the fast installation mode, use the steps in our Customize Your Installation documentation. Installation Guide - System Requirements

**Before you install cPanel & WHM or cPanel DNSOnly®, make certain that your system meets all of our minimum requirements for new installations. Minimum requirements differ depending on what operating system your server uses:** **System Requirements for AlmaLinux:**

https://docs.cpanel.net/installation-guide/system-requirements-almalinux

**System Requirements for CentOS:**

https://docs.cpanel.net/installation-guide/system-requirements-centos

**System Requirements for CloudLinux™:**

https://docs.cpanel.net/installation-guide/system-requirements-cloudlinux

**Installation Guide - Installation**

To install cPanel & WHM on your server, run the following command: cd /home && curl -o latest -L https://securedownloads.cpanel.net/latest && sh latest
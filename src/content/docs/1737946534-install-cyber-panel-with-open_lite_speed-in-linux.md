---
order: 18
title: Install Cyber Panel With OpenLiteSpeed in Linux
category: Web panels
date: Jan 27, 2025
sourceTitle: Install Cyber Panel With OpenLiteSpeed in Linux
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946534-install-cyber-panel-with-open_lite_speed-in-linux
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "In this tutorial, we will be installing a cyber panel in a Linux server and I will try to make the tutorial as easy as possible, we are going to use the free plan which offers: Unlimited Domains Unlimited Subdomains U…"
relatedSlugs: []
---
Install Cyber Panel With OpenLiteSpeed in Linux

Install Cyber Panel With OpenLiteSpeed in Linux
===============================================

Last updated on Jan 27, 2025

In this tutorial, we will be installing a cyber panel in a Linux server and I will try to make the tutorial as easy as possible, we are going to use the free plan which offers: Unlimited Domains Unlimited Subdomains Unlimited Databases Multiple PHP Lets Encrypt SSL LSCache for WordPress Community Support OpenLiteSpeed Server Make sure you have Python installed cmd-

**Step 1: Update and Refresh Repository Lists**

Open a terminal window, and enter the following: sudo apt update

**Step 2: Install Supporting Software**

The software-properties-common package gives you better control over your package manager by letting you add PPA (Personal Package Archive) repositories. Install the supporting software with the command: sudo apt install software-properties-common

**Step 3: Add Deadsnakes PPA**

Deadsnakes is a PPA with newer releases than the default Ubuntu repositories. Add the PPA by entering the following: sudo add-apt-repository ppa:deadsnakes/ppa

**The system will prompt you to press enter to continue. Do so, and allow it to finish. Refresh the package lists again:**

sudo apt update

**Step 4: Install Python 3**

Now you can start the installation of Python 3.8 with the command: sudo apt install python3.8

**Allow the process to complete and verify the Python version was installed successfully:**

python ––version

We are ready to install the cyber Panel now. You Just need to enter a single command and then follow the procedure step by step Command- sh <(curl https://cyberpanel.net/install.sh || wget -O - https://cyberpanel.net/install.sh) (If you don’t know to troubleshoot SQL errors) Install it without remote SQL to avoid getting technical errors in future.

**Access**

After the successful installation, you can access CyberPanel using the details below (Until you have specified login credentials on installation) (make sure to change): Visit: https::8090 Username: admin Password: 1234567

**503 Error After Install**

If you get a 503 error after installing CyberPanel, you can do one of the following things. 1. Check LSCPD Status: systemctl status lscpd If LSCPD is not running, start LSCPD using: systemctl start lscpd 2. Manually set up virtualevn with the following commands: #1 source /usr/local/CyberCP/bin/activate #2 pip install --ignore-installed -r /usr/local/CyberCP/requirments.txt #3 Deactivate #4 virtualenv --system-site-packages /usr/local/CyberCP #5 systemctl restart lscpd 3. Install Logs If after this you are still having issues, you can try to find errors in the install logs, they are located at: /var/log/installLogs.txt
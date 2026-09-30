---
order: 2
title: How to Setup your VPN on Linux Server using outline?
category: VPN and networking
date: Jan 27, 2025
sourceTitle: How to Setup your VPN on Linux Server using outline?
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946054-how-to-setup-your-vpn-on-linux-server-using-outline
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: Outline VPN is a new open-source VPN that promises an incredibly easy-to-install VPN experience—far easier than existing options, like OpenVPN. Via Outline, Jigsaw is trying to make VPNs not only secure but also incre…
relatedSlugs: []
---
How to Setup your VPN on Linux Server using outline?

How to Setup your VPN on Linux Server using outline?
====================================================

Last updated on Jan 27, 2025

Outline VPN is a new open-source VPN that promises an incredibly easy-to-install VPN experience—far easier than existing options, like OpenVPN. Via Outline, Jigsaw is trying to make VPNs not only secure but also incredibly easy to set up—especially for those who don’t happen to be sysadmins. The target demographic for the Outline VPN is journalists and news organizations, but anyone can take advantage of their hard work. For example, Journalists need safe access to information to research issues, communicate with sources, and report the news. Outline makes it easy for news organizations to set up a virtual private network (VPN) on their server. This gives news organizations the power to provide anyone in their organization with safer access to the internet and keep their communications private.

**Prerequisites:**

A VPS running any of our OS options A working Docker installation A non-root, sudo-enabled user A local computer running Windows or Linux

**Step 1. Install Docker (if not installed already)**

The Outline + Docker combination is what makes this VPN solution so easy to install. So, if you don’t have Docker installed on your server yet, take a moment to perform this one-command installation: $ sudo curl -sS https://get.docker.com/ | sh The script will update your system as needed, add the appropriate Docker repositories, and install the correct Docker packages. You may then need to start the Docker service. $ sudo systemctl start docker $ sudo systemctl enable docker

**Finally, verify that the Docker service is running:**

$ sudo sudo systemctl status docker ● docker.service - Docker Application Container Engine Loaded: loaded (/usr/lib/systemd/system/docker.service; disabled; vendor preset: disabled) Drop-In: /etc/systemd/system/docker.service.d └─firewalld.conf Active: active (running) since Mon 2018-03-26 14:36:26 EDT; 4s ago Docs: https://docs.docker.com Main PID: 31232 (dockerd)

**Step 2. Installing the Outline VPN server**

With Docker installed, you can run the Outline server installation script: $ sudo wget -qO- https://raw.githubusercontent.com/Jigsaw-Code/outline-server/master/src/server\_manager/install\_scripts/install\_server.sh | bash You will see lots of output from the script: first, it checks for the necessary programs (Docker), creates secret keys, and then downloads and starts two Docker containers: a shadowbox server and a watchtower server to update shadowbox as needed.

**When the Outline VPN server installation script finishes, you’ll see some output similar to the following:**

{ "apiUrl": "https://[redacted example endpoint]:12345/xxxxxxxxxxxxxxxxxxxxxxx", "certSha256": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }

**Step 3. Keep that information safe, as you’ll need it in the next step. For now, rejoice: You have successfully installed a VPN server!** **Step 4. Using Outline Manager to set up your VPN**

Jigsaw has created a desktop app called Outline Manager to help users configure their Outline VPN servers. You can download the server manager from the following link:

**https://getoutline.org/get-started/#step-1** **Once you open the Outline Manager app, scroll down to Set up Outline anywhere and click on the Get started button.**

You’ll see two steps to follow. You’ve already done the first one, and for the second step, all you need to do is copy the bracketed text from Step 3 into the field and click Done Once you’re connected, you will see that you already have a key called My access key. Click on the Get connected button, which will give you a walkthrough on how to install and configure the appropriate VPN client for your platform. For every user, it’s recommended that you create a new key and give it to the user.

**STAY SAFE ONLINE WITH OUTLINE VPN!**
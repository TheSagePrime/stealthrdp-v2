---
order: 2
title: How to Set Up Outline VPN with Docker
sidebarTitle: Outline VPN with Docker
category: VPN and networking
date: Jan 27, 2025
sourceTitle: How to Setup your VPN on Linux Server using outline?
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946054-how-to-setup-your-vpn-on-linux-server-using-outline
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Set up your own Outline VPN server on a Linux VPS with Docker: install Docker, run the Outline install script, open the ports and connect with Outline Manager."
relatedSlugs: []
---
Outline is an open-source VPN from Jigsaw that runs as Docker containers on your own server. You manage it with the Outline Manager desktop app and share access keys with your users, who connect with the Outline Client. This guide sets up an Outline VPN server on a Linux VPS.

## What you need

- A Linux VPS with root or sudo access, such as a [StealthRDP Linux VPS](/linux-vps).
- A local computer with [Outline Manager](https://getoutline.org/get-started/) installed (Windows, macOS or Linux).
- Use of a VPN must follow your local law and the [StealthRDP use of service terms](/docs/use-of-service).

### 1. Install Docker

Outline runs in Docker. If Docker is not installed, install it with Docker's convenience script:

```bash title="Install and start Docker"
curl -fsSL https://get.docker.com | sudo sh
sudo systemctl enable --now docker
```

Check that Docker is running:

```bash title="Check Docker status"
sudo systemctl status docker
```

The output must show `active (running)`. If you skip this step, the Outline install script offers to install Docker for you.

### 2. Run the Outline install script

Open Outline Manager, choose **Set up Outline anywhere**, and copy the install command it shows. At the time of writing, it is:

```bash title="Outline install command"
sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/OutlineFoundation/outline-apps/master/server_manager/install_scripts/install_server.sh)"
```

Run it on the server. The script creates secret keys and starts two containers: `shadowbox` (the VPN server) and `watchtower` (which keeps it updated).

### 3. Open the firewall ports

When the script finishes, it prints the two ports it uses:

- a **management port** (TCP), used by Outline Manager;
- an **access key port** (TCP and UDP), used by VPN clients.

If you use `ufw`, allow both, replacing the numbers with the ones the script printed:

```bash title="Allow Outline ports"
sudo ufw allow 12345/tcp
sudo ufw allow 23456/tcp
sudo ufw allow 23456/udp
```

### 4. Connect Outline Manager

The script ends with a line like this:

```json title="Output from the install script"
{ "apiUrl": "https://[your-server-ip]:12345/xxxxxxxx", "certSha256": "xxxxxxxx" }
```

Copy the whole line into Outline Manager and click **Done**.

:::warn
Keep this line private. Anyone with it can manage your server.
:::

### 5. Share access keys

Outline Manager creates a first key called **My access key**. Create one key per person, click **Share**, and send the key. Each user installs the Outline Client on their device and adds the key to connect.

## Troubleshooting

- **Outline Manager cannot connect:** check that the management port is open in every firewall and that the `shadowbox` container is running with `sudo docker ps`.
- **Clients connect but have no internet:** check that the access key port is open for both TCP and UDP.

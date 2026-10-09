---
order: 12
title: 'Log In to Windows RDP from a PC, Mac or Phone'
sidebarTitle: Connect with RDP
category: Windows
date: Jan 27, 2025
sourceTitle: How do I log into Windows RDP?
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737945157-how-do-i-log-into-windows
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: Connect to your Windows VPS with Remote Desktop from Windows 10 or 11, a Mac, iPhone, iPad, Android or Linux, using the IP and password from your email.
relatedSlugs:
  - 1737944563-how-to-re_activate-and-extend-your-180_day-windows-trial
---
You need three things from the email StealthRDP sends after payment: the server IP address, the username (`Administrator`) and the password. Then pick the section for your device.

## Windows 10 and Windows 11: Remote Desktop Connection

Remote Desktop Connection is built into Windows 10 and Windows 11.

1. Press the **Windows key**, type **Remote Desktop Connection** and open it. You can also press **Windows + R**, type `mstsc` and press Enter.
2. In **Computer**, type the server IP address from your email.
3. Select **Connect**. When Windows asks for credentials, choose **More choices** > **Use a different account**, then type `Administrator` and the password.
4. On the first connection, Windows shows a certificate warning. Select **Yes** to continue.

## Mac: Microsoft Remote Desktop (Windows App)

On a Mac, use Microsoft's free client. Microsoft now calls it **Windows App**; older Macs may still show **Microsoft Remote Desktop**.

1. Install **Windows App** from the Mac App Store.
2. Select **+** > **Add PC**.
3. In **PC name**, type the server IP address. Add `Administrator` and the password as the user account.
4. Double-click the PC to connect. Accept the certificate prompt on the first connection.

## iPhone, iPad and Android

Install Microsoft's **Windows App** (or the older **Remote Desktop** app) from the App Store or Google Play. Add a PC with the server IP address, then sign in as `Administrator` with your password. A keyboard and mouse make a phone or tablet much easier to use for longer sessions.

## Linux: which RDP client to use

Two common clients are available in most distribution repositories:

- **Remmina**: a graphical client. Create a new connection, choose the **RDP** protocol, then enter the IP address, `Administrator` and the password.
- **FreeRDP**: a command-line client. For example:

```bash title="Connect with FreeRDP"
xfreerdp /v:SERVER_IP /u:Administrator
```

Replace `SERVER_IP` with the address from your email. FreeRDP asks for the password when it connects.

## If the connection fails

- Check that you copied the IP address and password exactly, without spaces.
- Wait a minute after payment. Most servers are live within 60 seconds of payment confirmation; at busy times it can take a few minutes.
- If the server stopped after a long time on a Windows Server evaluation, read [Windows Server rearm](/docs/how-to-re-activate-and-extend-your-180-day-windows-trial).
- Still stuck? Contact support through WhatsApp, a client-area ticket or support email. Support is available 24/7.

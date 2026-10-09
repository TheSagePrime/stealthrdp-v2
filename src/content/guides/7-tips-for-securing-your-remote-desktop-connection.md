---
order: 12
title: "How to Secure Remote Desktop: 7 Tips for RDP Security"
sidebarTitle: Secure Remote Desktop
excerpt: How to secure Remote Desktop on Windows, from enabling RDP safely with Settings, PowerShell or Group Policy to MFA, VPNs, gateways and NLA.
category: Remote Desktop
author: StealthRDP Team
date: 2025-06-11
readingTime: 17
image: https://assets.seobotai.com/cdn-cgi/image/quality=75,w=1536,h=1024/stealthrdp.com/6848cc1a5559d477e7526a0e-1749637212671.jpg
sources:
  - title: What's new in the Remote Desktop client for Windows
    url: https://learn.microsoft.com/en-us/previous-versions/remote-desktop-client/whats-new-windows
    publisher: Microsoft Learn
    accessedAt: 2026-10-09
  - title: Use features of the Remote Desktop client for Windows - Azure Virtual Desktop
    url: https://learn.microsoft.com/en-us/previous-versions/remote-desktop-client/client-features-windows-msrdc
    publisher: Microsoft Learn
    accessedAt: 2026-10-09
  - title: Configure Network Level Authentication for Remote Desktop Services Connections
    url: https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-r2-and-2008/cc732713(v=ws.11)
    publisher: Microsoft Learn
    accessedAt: 2026-10-09
  - title: RemoteDesktopServices Policy CSP
    url: https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-remotedesktopservices
    publisher: Microsoft Learn
    accessedAt: 2026-10-09
  - title: "One simple action you can take to prevent 99.9 percent of attacks on your accounts"
    url: https://www.microsoft.com/en-us/security/blog/2019/08/20/one-simple-action-you-can-take-to-prevent-99-9-percent-of-account-attacks/
    publisher: Microsoft Security Blog
    accessedAt: 2026-10-09
  - title: "Samsam infected thousands of LabCorp systems via brute force RDP"
    url: https://www.csoonline.com/article/565911/samsam-infected-thousands-of-labcorp-systems-via-brute-force-rdp.html
    publisher: CSO Online
    accessedAt: 2026-10-09
  - title: "Cybercriminals Abuse Remote Desktop Protocol (RDP) in 90% of Attacks Handled by Sophos Incident Response in 2023"
    url: https://www.sophos.com/en-us/press/press-releases/2024/04/cybercriminals-abuse-remote-desktop-protocol-rdp-90-attacks-handled
    publisher: Sophos
    accessedAt: 2026-10-09
  - title: "Widespread, Easily Exploitable Windows RDP Bug Opens Users to Data Theft"
    url: https://threatpost.com/windows-bug-rdp-exploit-unprivileged-users/177599/
    publisher: Threatpost
    accessedAt: 2026-10-09
  - title: "2026 Data Breach Investigations Report: Executive Summary"
    url: https://www.verizon.com/business/resources/executivebriefs/2026-dbir-executive-summary.pdf
    publisher: Verizon
    accessedAt: 2026-10-09
---
**Attackers abused RDP in 90% of the cyberattacks [Sophos](https://www.sophos.com/en-us/press/press-releases/2024/04/cybercriminals-abuse-remote-desktop-protocol-rdp-90-attacks-handled) handled in 2023.** <a class="seo-article-citation" href="#source-7" aria-label="Source 7">[7]</a> Protect your connection now with these 7 essential tips to secure your Remote Desktop Protocol (RDP) setup and prevent breaches:

1. **Set Up Strong Authentication**: Use unique, complex passwords and enable Multi-Factor Authentication (MFA) to block brute-force attacks.
2. **Keep [RDP Software](/) Updated**: Regularly install updates and security patches to fix vulnerabilities.
3. **Control Network Access**: Restrict RDP access to trusted IPs, configure firewalls, and change the default RDP port (3389).
4. **Use a VPN**: Encrypt your connection and block unauthorized access with a VPN.
5. **Set Up an RDP Gateway**: Route traffic through a secure gateway for added encryption and monitoring.
6. **Enable Encryption and Tunneling**: Use Network Level Authentication (NLA) and SSH tunneling to protect data in transit.
7. **Apply Zero Trust Security**: Continuously verify users, enforce least privilege access, and monitor activity.

**Why act now?** RDP is a top target for hackers. These steps create a layered defense to keep your system secure against evolving threats.

## Everything you need to know about securing RDP in 30 minutes (CCB Cyber Tips) [#everything-you-need-to-know-about-securing-rdp-in-30-minutes-ccb-cyber-tips]

<iframe class="sb-iframe" src="https://www.youtube.com/embed/-u2ZuGfixHM" frameborder="0" loading="lazy" allowfullscreen style="width: 100%; height: auto; aspect-ratio: 16/9;"></iframe>

<h2 id="1-set-up-strong-authentication">1. Set Up Strong Authentication</h2>

When it comes to securing Remote Desktop Protocol (RDP), strong authentication is your first and most critical line of defense. Weak passwords leave your connection vulnerable to automated attacks designed to crack login credentials. By strengthening authentication, you significantly reduce the chances of a breach.

### Create Strong and Unique Passwords [#create-strong-and-unique-passwords]

Your password acts as the gateway to your RDP connection, and weak ones are prime targets for brute-force attacks. To protect yourself, create passwords that are at least 8 characters long and include a mix of uppercase and lowercase letters, numbers, and special characters. Avoid using easily guessed words, personal information, or predictable patterns.

An effective approach is to use a passphrase, which combines random words to form a secure yet memorable password. For example, a passphrase like "Coffee!Mountain$Dance92" is strong but easy to recall. Just as important, never reuse passwords across different accounts. If one account is compromised, unique passwords ensure others remain safe.

Managing multiple strong passwords can be challenging, so consider using a password manager. These tools securely store your credentials, generate complex passwords, and simplify the login process. By using a password manager, you can maintain robust security without the hassle of remembering multiple passwords.

Once you’ve secured your passwords, it’s time to add another layer of protection with multi-factor authentication.

### Enable Multi-Factor Authentication (MFA) [#enable-multi-factor-authentication-mfa]

Strong passwords are essential, but pairing them with Multi-Factor Authentication (MFA) provides an even stronger defense. MFA requires a second form of verification, making it much harder for attackers to gain access - even if they have your password. [Microsoft](https://www.microsoft.com/en-us/security/blog/2019/08/20/one-simple-action-you-can-take-to-prevent-99-9-percent-of-account-attacks/) reports that MFA can block over 99.9% of account compromise attacks. <a class="seo-article-citation" href="#source-5" aria-label="Source 5">[5]</a>

MFA options include mobile app codes, SMS messages, phone calls, biometrics, or hardware tokens. For convenience, consider methods that minimize manual input, such as phone call verifications or app notifications. For instance, if you’re using [Microsoft Entra ID](https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id) MFA with the NPS extension, you might choose automatic phone calls or push notifications to streamline the process.

Failing to implement MFA can lead to serious consequences. Take the [LabCorp](https://www.labcorp.com/) ransomware incident, for example: in July 2018, a brute-force attack on RDP spread ransomware to 7,000 systems and 1,900 servers before LabCorp contained it within 50 minutes, according to [CSO Online](https://www.csoonline.com/article/565911/samsam-infected-thousands-of-labcorp-systems-via-brute-force-rdp.html). <a class="seo-article-citation" href="#source-6" aria-label="Source 6">[6]</a> This shows just how critical MFA is in preventing such rapid and devastating breaches.

There are several ways to integrate MFA into your RDP setup. You can use Microsoft Entra ID with an NPS extension, third-party MFA solutions, an RDP Gateway with built-in MFA, or a VPN with MFA support. Beyond security, MFA also helps organizations meet compliance standards like HIPAA, PCI DSS, and GDPR.

To further strengthen your MFA setup, ensure you’re using TLS 1.2 or higher and enable Network Level Authentication (NLA) for better encryption. Adding logging and monitoring tools can also help you track access attempts and detect any suspicious activity.

<h2 id="2-keep-your-rdp-software-updated">2. Keep Your RDP Software Updated</h2>

Running outdated software is like leaving your front door unlocked - attackers know exactly where to find the weak spots. When your RDP software isn't up to date, you're essentially handing cybercriminals a roadmap to exploit vulnerabilities. Keeping your software updated with the latest security patches is critical, as attackers are always on the lookout for new vulnerabilities to exploit.

The risks of outdated RDP software are very real. Take, for example, the CVE-2022-21893 vulnerability discovered in January 2022. This flaw allowed an attacker - without elevated privileges - to reach the file systems of other connected users, according to [Threatpost](https://threatpost.com/windows-bug-rdp-exploit-unprivileged-users/177599/). <a class="seo-article-citation" href="#source-8" aria-label="Source 8">[8]</a> It opened the door to breaches of clipboard and filesystem data, which could lead to privacy violations, unauthorized movement within networks, or privilege escalation. This is just one case that underscores why staying on top of updates isn't optional - it's essential.

Beyond patching vulnerabilities, updates also ensure your software supports modern encryption protocols. Without these updates, even a seemingly secure connection could be dangerously exposed.

### Turn On Automatic Updates [#turn-on-automatic-updates]

The easiest way to stay secure? Enable automatic updates. This ensures patches are applied as soon as they're released, minimizing the window of vulnerability. While the process varies depending on the RDP client you use, the objective is the same: keep your software secure, always.

For the **[Microsoft Remote Desktop](https://www.microsoft.com/en-us/d/microsoft-remote-desktop/9wzdncrfj3ps) Client (MSI version)**, you can manually check for updates by opening the Remote Desktop application, clicking the three dots in the top-right corner, and selecting "About." The client will then check for updates, and if one is available, you can simply click "Install update" to apply it.

Administrators can fine-tune update settings via registry configurations. The `AutomaticUpdates` registry key, located at `HKLM\Software\Microsoft\MSRDC\Policies`, allows you to choose how updates are handled:

- **Value 0**: Turns off auto-updates and notifications entirely.
- **Value 1**: Enables notifications but requires user action to install updates.
- **Value 2** (default): For per-user installs, applies updates silently in the background when the client is closed, with notifications only when running. Per-machine installs get notifications only. <a class="seo-article-citation" href="#source-2" aria-label="Source 2">[2]</a>

The **Microsoft Remote Desktop app from the Microsoft Store** is no longer supported: it reached end of support in September 2025 and is no longer available for download or installation. Microsoft's replacement for Azure Virtual Desktop and Windows 365 connections is **Windows App**. Connections to Remote Desktop Services and remote PCs are not affected by that change. Microsoft also stopped supporting the MSI client for public cloud environments on March 27, 2026. <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a>

One of the perks of using Microsoft's built-in Windows RDP is that updates are integrated into the regular Windows operating system updates. This adds an extra layer of security without requiring additional effort.

### Check Third-Party RDP Clients [#check-third-party-rdp-clients]

If you're using third-party RDP clients, the same rules apply - ensure they're up to date and supported. Unlike native RDP software, many third-party clients don't include automatic updates, so you'll need to manually verify that you're running the latest versions. Unsupported or outdated software won't receive security patches, leaving known vulnerabilities exposed indefinitely.

When selecting third-party RDP clients, prioritize those that align with modern security standards. Look for features like support for current encryption protocols and Network Level Authentication. Older or poorly maintained clients often lack these critical protections, putting your system at risk.

To reduce exposure, limit the number of RDP clients used within your environment. Standardizing on a single, well-maintained client simplifies update management and minimizes potential attack vectors. If vulnerabilities are identified in third-party clients, focus on patching those with known public exploits first. These are particularly dangerous because attackers already have the tools to exploit them.

<h2 id="3-control-network-access-with-firewall-rules">3. Control Network Access with Firewall Rules</h2>

Setting up your firewall to block unauthorized [RDP connections](https://dash.stealthrdp.com/index.php?rp=/login) is a critical step in securing your network. A strong firewall configuration provides a vital layer of defense for protecting RDP services. According to [Sophos](https://www.sophos.com/en-us/press/press-releases/2024/04/cybercriminals-abuse-remote-desktop-protocol-rdp-90-attacks-handled) incident response data, **RDP abuse appeared in 90% of the attacks it handled in 2023**.

> Businesses should remove RDP from the public internet to decrease the risk of being targeted by cybercriminals.
>
> – Ryan Gregory, Coalition

Firewalls can limit access to remote desktop listening ports, such as the default TCP 3389. By correctly configuring these settings, you can prevent unauthorized external traffic while still allowing approved users to connect to your network.

### Allow Access from Trusted IPs Only [#allow-access-from-trusted-ips-only]

Restricting RDP access to specific IP addresses or network segments significantly reduces your attack surface. Here’s how to configure this in Windows Firewall:

- Open **Windows Security** and go to **Firewall and Network Protection &gt; Advanced Settings**.
- Locate the "Remote Desktop – User Mode (TCP-In)" rule and edit it to permit only authorized IP addresses.

To confirm which external IP addresses should have access, use an IP-checker tool.

It’s essential to review and update your trusted IP list regularly, as network configurations can change over time. Exposing RDP ports to the entire internet is never advisable. This combination of IP filtering and careful monitoring forms a solid base for your security setup.

### Change the Default RDP Port [#change-the-default-rdp-port]

Another effective way to enhance security is by changing the default RDP port (3389). While this doesn’t replace other security measures, it can reduce exposure to automated scanning attacks. Experts recommend selecting a port between **49152 and 65535** to avoid conflicts with other services.

Here’s how to change the RDP port:

#### Using the Registry Editor [#using-the-registry-editor]

1. Open **Registry Editor**.
2. Navigate to:

   `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp`
3. Find the `PortNumber` entry, double-click it, choose **Decimal**, and input your new port number.
4. Click **OK** and restart the Remote Desktop Service (or your computer) to apply the changes.

#### Using PowerShell [#using-powershell]

- Check the current port with:

  `Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "PortNumber"`
- Update the port using:

  `Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "PortNumber" -Value <new_port>`
- Add firewall rules for the new port:

  ```powershell title="PowerShell"
  New-NetFirewallRule -DisplayName "RDP New Port TCP" -Profile Public -Direction Inbound -Action Allow -Protocol TCP -LocalPort <new_port>  
  New-NetFirewallRule -DisplayName "RDP New Port UDP" -Profile Public -Direction Inbound -Action Allow -Protocol UDP -LocalPort <new_port>  
  ```

Once the port is changed, create a matching inbound Windows Firewall rule. Test the new port by connecting with the format `IP_address:new_port` (e.g., `192.168.1.1:33091`) and verify its activity using this command:

```
netstat -an | find "<new_port>"
```

### Add an Extra Layer with NAT [#add-an-extra-layer-with-nat]

Using Network Address Translation (NAT) is another option for securing your RDP setup. With NAT, you can map an external port to your internal RDP port, adding an extra layer of obscurity and making it harder for attackers to locate your connection. This approach, combined with firewall rules, strengthens your overall [RDP security](/docs) strategy.

<h2 id="4-use-a-vpn-for-secure-remote-access">4. Use a VPN for Secure Remote Access</h2>

A VPN creates an encrypted tunnel between your device and the network, ensuring that any intercepted data remains unreadable. Setting up a VPN connection before starting your RDP session provides an extra layer of protection against potential cyberattacks. Here’s how you can establish VPN access for your remote desktop connection.

### Setting Up VPN Access for RDP [#setting-up-vpn-access-for-rdp]

**Choosing Your VPN Solution**

You have two main options for setting up VPN access. Commercial VPN services like [OpenVPN](https://openvpn.net/), [TunnelBear](https://www.tunnelbear.com/), and [Proton VPN](https://protonvpn.com/?srsltid=AfmBOor8HXnCA2hWvi-oC3wu6rVy1Ltz7ADWnMJHp-JWc0hanxkEcfgA) are often compatible with RDP without requiring much configuration. However, some services might need specific tweaks to ensure smooth performance.

**Setting Up Your Own VPN Server**

If you want more control over your security, hosting your own VPN server is a great option. By managing your own server, you can customize encryption settings, control user access, and implement tailored security measures. To get started, choose a VPS provider that supports VPN installation, such as [DigitalOcean](https://www.digitalocean.com/), [Linode](https://www.linode.com/), or [AWS](https://aws.amazon.com/). The setup process usually involves:

- Connecting to your VPS using SSH.
- Installing VPN server software like OpenVPN.
- Configuring access for your devices.

When setting up your server, select a location close to your target region to improve performance. Always use strong encryption, such as AES-256-bit, to protect your data.

**Key Security Configurations**

Once your VPN is up and running, take these important steps to secure it further:

- Enable two-factor authentication (2FA) for all VPN sessions.
- Restrict VPN access to authorized devices only.
- Adjust your firewall rules to work seamlessly with the VPN, blocking unauthorized access.
- Use tools like [Fail2Ban](https://en.wikipedia.org/wiki/Fail2ban), disable root login, and regularly monitor logs for unusual activity.
- Change default ports to make your VPN server harder to locate for attackers.

**Connecting Through Your VPN**

<h2 id="5-set-up-an-rdp-gateway">5. Set Up an RDP Gateway</h2>

An RDP Gateway serves as an essential checkpoint, adding an extra layer of security to your network. It ensures that all external access to your internal systems is tightly controlled, authenticating users and encrypting traffic before granting access to specific resources.

### How RDP Gateways Enhance Security [#how-rdp-gateways-enhance-security]

RDP Gateways reroute remote desktop traffic through HTTPS on port 443 instead of the standard RDP port 3389. By tunneling RDP over HTTPS, this approach protects sensitive data from man-in-the-middle attacks while keeping your internal network shielded. Users can only access authorized resources, which significantly reduces the potential for vulnerabilities.

> RD Gateway encapsulates Remote Desktop Protocol (RDP) within RPC, within HTTP over a Secure Sockets Layer (SSL) connection. - Microsoft

Another key benefit is centralized authentication and auditing. The gateway logs and monitors every connection attempt, making it easier to track user activity and spot unusual behavior. To maximize security, it's critical to configure gateway policies correctly.

### Tips for Proper Gateway Configuration [#tips-for-proper-gateway-configuration]

To make the most of your RDP Gateway, you’ll need to set up **Connection Authorization Policies (CAP)** and **Resource Authorization Policies (RAP)**:

- **CAP Policies**: These define who can connect. For example, you can set policies to lock accounts after multiple failed login attempts or restrict access to specific IP ranges. This ensures only trusted devices can initiate connections.
- **RAP Policies**: These control what resources users can access once connected. By following the principle of least privilege, you can limit access to only the resources necessary for each user, reducing the risk of damage if an account is compromised.

Other important steps include:

- **Enable MFA**: Adding multi-factor authentication to your gateway access strengthens security.
- **Use Trusted SSL Certificates**: Obtain certificates from recognized providers like [DigiCert](https://www.digicert.com/), [GlobalSign](https://www.globalsign.com/en), or [Let's Encrypt](https://letsencrypt.org/). Enforce TLS 1.2 or higher, disable weak encryption algorithms, and regularly update certificates to maintain secure connections.
- **Restrict Access**: Once deployed, limit access to specific users and systems. Ensure that all Remote Desktop services only accept connections through the RD Gateway.
- **Monitor Logs**: Log all connection attempts and review them regularly to detect any anomalies.

> The RD Gateway server acts as a middleman between the remote client and the RDSH, providing an added layer of security by authenticating the user and encrypting the traffic. - Limitless Technology

<h2 id="6-add-encryption-and-tunneling">6. Add Encryption and Tunneling</h2>

To safeguard your Remote Desktop Protocol (RDP) sessions from unauthorized interception or monitoring, encryption and tunneling technologies are essential. By layering encryption, you can create a strong shield against eavesdropping and potential attacks. A key step to achieving this is strengthening authentication methods, such as enabling Network Level Authentication (NLA).

### Turn On Network Level Authentication (NLA) [#turn-on-network-level-authentication-nla]

Network Level Authentication (NLA) adds an extra layer of protection by requiring users to authenticate *before* a remote desktop session begins. This means unauthorized users can’t even reach the login screen, making it a critical security barrier.

NLA helps reduce risks like brute-force attacks, denial-of-service (DoS) attempts, and credential theft during connection. It also improves resource efficiency by preventing unauthorized attempts from consuming server memory and CPU. For legitimate users, NLA supports NT Single Sign-On (SSO), making access more seamless.

For maximum security, always enable NLA on your RDP connections. If compatibility issues force you to disable it, ensure you compensate with other protective measures - such as using strong passwords, configuring firewalls, and enforcing strict access controls.

### Use SSH or IPSec Tunneling [#use-ssh-or-ipsec-tunneling]

SSH tunneling is another effective way to secure your RDP sessions. By wrapping your RDP traffic in an encrypted SSH tunnel, you add an extra layer of security during data transmission.

[CloudThat](https://www.cloudthat.com/), an AWS and Microsoft partner, shared a guide detailing how to set up RDP access through SSH tunneling with [PuTTY](https://www.putty.org/). Their step-by-step process includes:

- Configuring PuTTY with your SSH server details (e.g., hostname, port 22, SSH connection).
- Setting up tunneling to forward a local port (e.g., 127.0.0.1:9999) to the internal RDP port (localhost:3389).
- Keeping the SSH session active and connecting via RDP using "localhost:9999."

As Chrissy LeMaire, SQL &amp; PowerShell MVP, puts it:

> If you've been exposing insecure protocols to the net, please consider wrapping them in the loving arms of SSH.

For added security, use non-default SSH ports and custom internal port forwarding to make your setup less predictable. With OpenSSH now integrated into Windows 10, implementing this method has become even easier. You can also enhance this approach by using a bastion host or jump server, which acts as an additional checkpoint, controlling access to sensitive resources within your secure network. This layered tunneling strategy significantly strengthens your RDP security.

<h2 id="7-apply-zero-trust-security-principles">7. Apply Zero Trust Security Principles</h2>

When it comes to modern RDP security, relying solely on encryption and controlled access isn’t enough. To truly address internal risks, a Zero Trust approach is essential. This model operates on a simple but powerful rule: **"Never trust, always verify"**.

Zero Trust is especially critical for RDP connections, because compromised credentials are a common route into remote systems. Unlike traditional security models that depend on securing network perimeters, Zero Trust requires every user and device to verify their identity, no matter where they’re located.

### Core Principles of Zero Trust [#core-principles-of-zero-trust]

Zero Trust strengthens RDP security by focusing on three fundamental principles:

| Core Principle | Description |
| --- | --- |
| **Continuously Verify** | No user or device is trusted by default. Verification is ongoing and adjusts dynamically based on real-time risks. |
| **Limit the Blast Radius** | Minimize the potential damage from breaches by restricting an attacker’s ability to move within your network. |
| **Automate Context Collection and Response** | Gather data from across your IT environment and automate responses to threats in real time. |

By applying these principles, you can significantly enhance your RDP security posture.

### Require Ongoing Verification [#require-ongoing-verification]

Traditional RDP setups authenticate users only at the login stage. Zero Trust, however, takes a more proactive approach by requiring **continuous authentication and validation** throughout the session. This ensures that even during an active session, every action is monitored and verified.

For example, imagine a user who typically works from New York suddenly starts downloading sensitive files from an unfamiliar IP address. A Zero Trust system would flag this activity and prompt additional verification, helping to catch potential threats before they escalate.

### Give Minimum Required Access [#give-minimum-required-access]

Another cornerstone of Zero Trust is the principle of least privilege. This means that users and applications should only have access to the resources they absolutely need to perform their roles. As Hubert Brychczynski puts it:

> Zero Trust means that every person within the organization might be a potential vector of attack - whether intentional or not.

To enforce least privilege:

- Limit access to only the resources necessary for each user’s role.
- Remove excessive or unused privileges.
- Keep the number of privileged accounts to a bare minimum.
- Ensure NTFS and shared resource permissions align with least-privilege principles.

Use tools like [Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) and Microsoft Entra ID groups to centrally manage and control access permissions. Restrict RDP access to a pre-approved list of IP addresses and user accounts. Additionally, prevent direct RDP access from external networks by requiring a VPN connection as the first step.

To further contain potential breaches, implement **microsegmentation**. This involves dividing your infrastructure into smaller segments, which limits attackers’ ability to move laterally within the network. Combine this with least-privilege policies and continuous monitoring of all network traffic to maintain visibility and detect threats early.

## How to Enable Remote Desktop Safely on Windows [#how-to-enable-remote-desktop-safely-on-windows]

:::info

Every tip above assumes Remote Desktop is switched on only where you need it. Windows 10 and Windows 11 Pro, Enterprise and Education can accept RDP connections; the Home editions cannot host a session. There are three common ways to turn it on. Whichever you use, keep Network Level Authentication enabled and limit who can connect.

:::

### Allow Remote Desktop in Windows 11 Settings [#allow-remote-desktop-in-windows-11-settings]

On a single machine, open **Settings → System → Remote Desktop** and switch **Remote Desktop** on. Leave **Require devices to use Network Level Authentication to connect** checked, then use **Remote Desktop users** to add only the accounts that need access. Administrators can connect by default.

### Enable Remote Desktop with PowerShell [#enable-remote-desktop-with-powershell]

On a server or a remote machine, PowerShell is faster. Run these commands in an elevated session. The first allows RDP connections, and the second opens the built-in Windows Firewall rules for Remote Desktop:

```powershell title="PowerShell"
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections" -Value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
```

Then narrow those firewall rules to trusted addresses, as described in tip 3, instead of leaving port 3389 open to the internet.

### Use Group Policy to Enable Remote Desktop [#use-group-policy-to-enable-remote-desktop]

For many machines in a domain, use Group Policy. In the Group Policy Management Editor, go to **Computer Configuration → Administrative Templates → Windows Components → Remote Desktop Services → Remote Desktop Session Host → Connections** and enable **Allow users to connect remotely by using Remote Desktop Services**. Under **Security** in the same branch, enable **Require user authentication for remote connections by using Network Level Authentication**. <a class="seo-article-citation" href="#source-3" aria-label="Source 3">[3]</a> <a class="seo-article-citation" href="#source-4" aria-label="Source 4">[4]</a> Pair the policy with a firewall rule that only allows your management network or VPN range.

If you run Windows on a [Windows VPS](/windows-vps), the same steps apply. Change the administrator password on first login and restrict RDP to the addresses you connect from.

## Conclusion: Secure Your RDP Connection [#conclusion-secure-your-rdp-connection]

Remote Desktop Protocol (RDP) is a vital tool, but it comes with significant security risks. Considering that RDP abuse appeared in 90% of the attacks Sophos handled in 2023, the seven security measures discussed in this guide are essential for defending against today’s increasingly sophisticated threats.

Recent statistics underline the urgency: the [Verizon 2026 Data Breach Investigations Report](https://www.verizon.com/business/resources/executivebriefs/2026-dbir-executive-summary.pdf) found the human element was present in 62% of breaches, up from 60% the previous year. <a class="seo-article-citation" href="#source-9" aria-label="Source 9">[9]</a> The good news? Many of these breaches are avoidable with the right precautions and awareness.

By adopting key practices like strong authentication, regular software updates, controlled network access, VPNs, RDP gateways, encryption, and Zero Trust principles, you create multiple layers of protection for your remote access. Each step strengthens your defenses:

- **Strong authentication** stops brute-force attacks at the outset.
- **Regular updates** eliminate vulnerabilities that hackers often exploit.
- **Firewalls and VPNs** ensure secure, private connections.
- **RDP gateways** add an extra shield of enterprise-grade security.
- **Encryption** keeps your data unreadable to unauthorized users.
- **Zero Trust principles** verify every access attempt, leaving no room for blind trust.

The cyber threat landscape is evolving at breakneck speed. Threats now range from traditional viruses to advanced attacks leveraging phishing, malware, and even AI-powered tools. Ransomware attacks, fueled by the rise of ransomware-as-a-service providers, are becoming more complex and costly.

These best practices, when combined, create a layered defense system that is far more difficult for attackers to penetrate. A strong combination of multi-factor authentication, software updates, secure network configurations, and Zero Trust principles transforms your RDP setup into a fortress capable of withstanding even sophisticated attacks.

Don’t wait - take action now to secure your RDP connection. Regularly review and update access permissions, monitor user activity for unusual patterns, and educate team members about cybersecurity policies, emerging threats, and how to spot phishing attempts. Consistently applying these measures keeps you ahead of malicious actors and shields your organization from both current and future threats.

## FAQs [#faqs]

<h3 id="why-does-changing-the-default-rdp-port-improve-security-against-cyberattacks" data-faq-q>Why does changing the default RDP port improve security against cyberattacks?</h3>

<h2 id="changing-the-default-rdp-port">Changing the Default RDP Port</h2>

Switching the default Remote Desktop Protocol (RDP) port from **3389** to a non-standard port can make it harder for attackers to find and target your Remote Desktop service. Since port 3389 is widely known and frequently scanned by automated tools, changing it reduces the visibility of your RDP connection and makes brute force attacks or unauthorized access attempts less likely.

This approach, often referred to as "security through obscurity", shouldn't be your only line of defense. However, when paired with measures like firewalls, strong passwords, and multi-factor authentication, it adds an extra layer of protection to your system.

<h3 id="why-should-i-use-a-vpn-with-remote-desktop-and-how-does-it-enhance-security" data-faq-q>Why should I use a VPN with Remote Desktop, and how does it enhance security?</h3>

Using a **VPN** alongside Remote Desktop adds a strong layer of security by encrypting your connection. This encryption ensures that your data stays protected from interception or unauthorized access, keeping RDP traffic safe as it travels through a private network. This significantly reduces the risk of cyber threats like hacking or eavesdropping.

Another advantage of using a VPN is that it masks your IP address, offering an additional layer of privacy. This makes it much harder for attackers to locate or target your system. Pairing a VPN with RDP allows you to securely access sensitive information while safeguarding both your data and your privacy. It’s a smart and effective way to protect remote connections.

<h3 id="what-is-zero-trust-security-and-how-does-it-help-protect-remote-desktop-protocol-rdp-connections" data-faq-q>What is Zero Trust Security, and how does it help protect Remote Desktop Protocol (RDP) connections?</h3>

Zero Trust Security is a framework that enforces strict identity verification for every user and device attempting to access a system, regardless of whether they're within or outside the organization's network. It follows the principle of **"never trust, always verify,"** ensuring that no one is automatically trusted.

When it comes to RDP connections, Zero Trust takes security up a notch by continuously verifying user identities and ensuring devices meet compliance standards. Access is strictly controlled based on the **principle of least privilege**, meaning users are only allowed access to the resources they need to perform their specific tasks. Even after users log in, their activities are closely monitored to detect and prevent unauthorized access or lateral movement across the network. This method greatly reduces potential vulnerabilities and strengthens defenses against cyber threats targeting remote desktop environments.

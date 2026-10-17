---
order: 9
title: "VPS DDoS Protection: What to Check and How to Set It Up"
sidebarTitle: VPS DDoS Protection
excerpt: How to judge a VPS with DDoS protection and set up your own layered defence, from firewalls and filtering to monitoring and recovery.
category: VPS Management
author: StealthRDP Team
date: 2025-09-04
readingTime: 13
image: https://assets.seobotai.com/cdn-cgi/image/quality=75,w=1536,h=1024/stealthrdp.com/68b981c768bb5e3832c3cd37-1756990765927.jpg
sources:
  - title: "Ubuntu Manpage: ufw - program for managing a netfilter firewall"
    url: https://manpages.ubuntu.com/manpages/noble/en/man8/ufw.8.html
    publisher: Ubuntu Manpages
    accessedAt: 2026-10-09
  - title: Security Level · Cloudflare Web Application Firewall (WAF) docs
    url: https://developers.cloudflare.com/waf/tools/security-level/
    publisher: Cloudflare
    accessedAt: 2026-10-09
  - title: Overview · Cloudflare DDoS Protection docs
    url: https://developers.cloudflare.com/ddos-protection/
    publisher: Cloudflare
    accessedAt: 2026-10-09
---

:::info
**Note:** StealthRDP EU plans (Amsterdam) include network-level DDoS protection; USA plans do not. This article is a general setup checklist for adding your own layers of mitigation on any VPS.
:::

1. **Start with your VPS provider’s defenses**: Check for built-in DDoS protection like traffic filtering, load balancing, and Web Application Firewalls (WAFs). These can block many attacks before they reach your server.
2. **Secure server access**: Use SSH key authentication, disable password logins, and enable Multi-Factor Authentication (MFA) for stronger security.
3. **Set up firewalls and traffic filtering**: Configure host-based firewalls (e.g., [UFW](https://help.ubuntu.com/community/UFW) or [iptables](https://en.wikipedia.org/wiki/Iptables)), block unnecessary ports, and use tools like [Fail2Ban](https://en.wikipedia.org/wiki/Fail2ban) to stop repeated attacks.
4. **Add cloud-based protection**: Services like [Cloudflare](https://www.cloudflare.com/) can handle larger attacks with features like rate limiting and geo-blocking.
5. **Monitor and maintain**: Regularly update software, back up data, and test recovery plans to ensure quick restoration after an attack.

**Key Insight**: A layered approach combining provider-level tools, server configurations, and monitoring ensures your VPS stays operational even during an attack. Keep your defenses updated and test them regularly to minimize downtime and protect your users.

## How to protect your VPS from DDoS attacks [#how-to-protect-your-vps-from-ddos-attacks]

<iframe class="sb-iframe" src="https://www.youtube.com/embed/N9tXeWiacjg" frameborder="0" loading="lazy" allowfullscreen style="width: 100%; height: auto; aspect-ratio: 16/9;"></iframe>

## Step 1: Check Your VPS Provider's Built-in DDoS Protection [#step-1-check-your-vps-providers-built-in-ddos-protection]

Before setting up server-level defenses, start by examining the DDoS protection your VPS provider already offers. This step is crucial because many attacks can be stopped before they even reach your server if your provider has effective systems in place.

### Look for Multi-Layer DDoS Protection [#look-for-multi-layer-ddos-protection]

A strong foundation begins with network-level safeguards. Check if your provider offers traffic scrubbing at multiple points within their network infrastructure. This ensures that malicious traffic is filtered out early.

Providers with **volumetric mitigation**, **load balancing**, and **geographic filtering** are particularly effective at identifying and redirecting unusual traffic spikes while blocking irrelevant regions. These features act as an automated first line of defense, keeping your server safe from the majority of threats.

### Evaluate Uptime and Disaster Recovery Policies [#evaluate-uptime-and-disaster-recovery-policies]

Protection isn't just about blocking attacks; it's also about maintaining reliability. Review your provider's Service Level Agreements (SLAs) for uptime guarantees and their ability to recover quickly during incidents. Strong SLAs should include rapid Recovery Time Objectives (RTOs) and automatic failover systems that keep services running even during disruptions.

Disaster recovery measures should ensure that if your primary server is targeted, traffic is automatically rerouted to backup systems. This seamless failover minimizes downtime and ensures users experience uninterrupted service.

### Assess Firewall and WAF Capabilities [#assess-firewall-and-waf-capabilities]

Web Application Firewalls (WAFs) are essential for defending against sophisticated application-layer attacks that standard firewalls might overlook. These tools analyze incoming web traffic and block requests that exploit vulnerabilities in your applications.

Check if your provider’s WAF uses machine learning to differentiate between legitimate and malicious traffic. The ability to set customizable rules - like geographic or IP-based filters - can be a game-changer during an attack.

For even stronger protection, ensure the WAF integrates with the network firewall. When these systems share threat intelligence, they can coordinate responses more effectively, making it harder for attackers to adapt their tactics.

## Step 2: Secure Server Access and Authentication [#step-2-secure-server-access-and-authentication]

After confirming your provider's baseline protections, the next step is to fortify your server's access points. DDoS attacks often exploit weak authentication systems or compromised credentials, making it critical to secure these entry points. By implementing robust measures, you create multiple layers of defense that attackers must breach before they can reach your applications.

### Set Up SSH Key Authentication [#set-up-ssh-key-authentication]

Password-based SSH logins are a common vulnerability. Switching to **SSH key authentication** significantly reduces this risk by using cryptographic key pairs instead of traditional passwords. This method is highly effective against brute-force attacks.

To get started, generate an RSA key pair with at least **2048-bit encryption** on your local machine. Install the public key on your server while keeping the private key securely stored on your device. When you log in, the server verifies your identity through a cryptographic challenge-response process instead of relying on a password.

Once SSH keys are in place, **disable password authentication entirely** by editing the `/etc/ssh/sshd_config` file. Set `PasswordAuthentication no` and `ChallengeResponseAuthentication no` to ensure all connections use key-based authentication. This step alone blocks the bulk of automated login attempts that often fuel DDoS campaigns.

For even stronger security, consider using **Ed25519 keys**. These newer cryptographic algorithms provide robust protection with smaller key sizes and faster processing, which can reduce server load during high-traffic periods.

### Enable Multi-Factor Authentication (MFA) [#enable-multi-factor-authentication-mfa]

While SSH keys offer excellent protection, adding **multi-factor authentication (MFA)** provides an additional layer of security, especially for administrator accounts.

Tools like **[Google Authenticator](https://support.google.com/accounts/answer/1066447?hl=en&co=GENIE.Platform%3DAndroid)** and **[Authy](https://authy.com/)** are popular for generating time-based one-time passwords (TOTP). On [Ubuntu](https://ubuntu.com/) systems, install the `libpam-google-authenticator` package (or equivalent for other distributions) and configure PAM (Pluggable Authentication Modules) to require both SSH keys and TOTP codes for login.

For teams managing multiple servers, **hardware security keys** like [YubiKey](https://www.yubico.com/) devices are a great option. These physical tokens offer phishing-resistant authentication, making remote compromise nearly impossible. While there’s an upfront cost, the added protection for critical infrastructure is well worth it.

Don’t forget to set up **backup codes** during MFA configuration. These codes ensure you won’t get locked out if your primary authentication device becomes unavailable. Store them securely offline, separate from your usual authentication methods.

### Create Strong Password Policies [#create-strong-password-policies]

Although SSH keys should handle most authentication needs, some services and applications may still require passwords. In these cases, **strong password policies** are essential to protect web interfaces, database connections, and service accounts.

- Require a minimum password length of 12 characters, including a mix of uppercase and lowercase letters, numbers, and symbols.
- Use tools like `pwquality` on Linux systems to enforce these rules and automatically reject weak passwords.

To limit the impact of compromised credentials, implement **password rotation schedules**. For example, require administrative accounts to update passwords every 90 days and regular users every 180 days.

Additionally, deploy **account lockout policies** to temporarily disable accounts after multiple failed login attempts. Lock accounts for 15-30 minutes after five consecutive failures, and use exponential backoff for repeated violations. This approach disrupts automated attack tools while still allowing legitimate users to regain access.

Finally, consider using **password managers** like [Bitwarden](https://bitwarden.com/) or [1Password](https://1password.com/). These tools generate and securely store complex passwords, helping prevent the common mistake of reusing passwords across multiple systems - an error attackers often exploit in multi-stage attacks.

## Step 3: Set Up Firewalls and Traffic Filtering [#step-3-set-up-firewalls-and-traffic-filtering]

Once you've secured authentication, the next step is to control what traffic reaches your server. Proper firewall configuration and traffic filtering act as a protective barrier, stopping malicious requests before they can disrupt your system. This is especially important because DDoS attacks often look for weak spots in your defenses before launching a full-scale assault. Start by setting up host-based firewalls to block harmful traffic right at the source.

### Install and Configure Host-Based Firewalls [#install-and-configure-host-based-firewalls]

A well-configured host-based firewall is your first line of defense against unwanted traffic. For beginners, **UFW (Uncomplicated Firewall)** is a straightforward option, while advanced users may prefer the finer control offered by **iptables**.

Set up a default-deny policy using UFW with these commands: `ufw default deny incoming` and `ufw default allow outgoing`. Then, open only the essential ports, like:

- **22 (SSH)**
- **80 (HTTP)**
- **443 (HTTPS)**

This ensures that only the services you need are accessible from the internet. Avoid exposing common attack vectors like **FTP (21)** or **Telnet (23)**. If you're running a database server, never expose ports like **3306 (MySQL)** or **5432 (PostgreSQL)** directly to the internet. Instead, use **SSH tunneling** for secure remote access.

For added security, consider using **port knocking** or switching to a non-standard SSH port (e.g., 2222 or 2048). While this won’t stop determined attackers, it can reduce automated scans targeting default ports. Additionally, add a UFW limit rule for SSH (`ufw limit 22/tcp`). It allows connections normally but denies an IP address that attempts six or more connections within 30 seconds. <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> This helps protect against brute-force attacks and connection flooding.

### Use [Fail2Ban](https://en.wikipedia.org/wiki/Fail2ban) to Block Brute-Force Attacks [#use-fail2ban-to-block-brute-force-attacks]

After setting up your firewall, strengthen your defenses further by blocking repeated malicious attempts. **Fail2Ban** is an effective tool for this - it monitors log files and automatically bans IPs showing harmful behavior.

For example, configure Fail2Ban to monitor SSH logs (e.g., `/var/log/auth.log`) and ban IPs after five failed login attempts within 10 minutes. The ban duration can be tailored to your needs. A 24-hour ban works well for SSH attacks, while shorter bans (1–2 hours) might suit web application attacks to avoid locking out legitimate users.

You can also create custom filters for specific threats. For instance, if you're running [WordPress](https://wordpress.org/), configure Fail2Ban to monitor for attacks targeting **wp-login.php**, **XML-RPC abuse**, or plugin vulnerabilities. Similarly, e-commerce sites can monitor for suspicious activity like shopping cart manipulation or payment form abuse.

The **recidive jail** feature is particularly useful - it tracks repeat offenders and enforces longer bans for persistent threats. To stay informed, set up email alerts for bans. A sudden spike in ban activity could signal the early stages of a coordinated attack.

### Add Cloud-Based Traffic Filtering [#add-cloud-based-traffic-filtering]

While host-based protections are essential, cloud-based traffic filtering offers scalable protection to handle larger attacks. Services like **Cloudflare** provide robust DDoS protection and global traffic filtering.

Cloudflare’s free tier includes basic DDoS protection, and its **"I'm Under Attack" mode** is a handy feature during active attacks. This mode challenges visitors with a verification page, allowing legitimate users through while blocking automated requests. <a class="seo-article-citation" href="#source-3" aria-label="Source 3">[3]</a>

Adjust security levels based on your traffic patterns. For example, the "Medium" setting typically blocks most malicious traffic while allowing legitimate visitors. During high-risk periods, you can temporarily raise the setting to "High", though this might inconvenience some users. <a class="seo-article-citation" href="#source-2" aria-label="Source 2">[2]</a>

At the cloud level, rate limiting is another effective strategy. For example:

- Limit login page requests to **10 per minute per IP**
- Allow up to **30 requests per minute** for API endpoints
- Set a cap of **100 requests per minute** for general site access

These limits help absorb volumetric attacks without disrupting normal user activity.

If your application primarily serves a specific region, **geographic blocking** can further reduce your attack surface. For instance, if most of your users are in North America, blocking traffic from regions known for hosting attack infrastructure can minimize threats without affecting legitimate users.

Finally, enable **Web Application Firewall (WAF)** rules to block common threats like **SQL injection** and **cross-site scripting (XSS)**. You can also create custom rules to counter attack patterns identified in your logs.

Regularly monitor your cloud service’s analytics dashboard for trends in blocked traffic. Sudden spikes from specific regions or URLs could indicate reconnaissance efforts before a larger attack. If available, use bot management features to distinguish between helpful bots (like search engine crawlers) and harmful ones. This proactive approach ensures your defenses stay a step ahead.

## Step 4: Install Monitoring and Intrusion Detection [#step-4-install-monitoring-and-intrusion-detection]

Once your network defenses are in place, it's time to take things a step further by actively monitoring traffic and detecting threats in real time. Think of these tools as your security system's watchtower, constantly scanning for suspicious activity and sounding the alarm before minor issues turn into major problems.

### Enable Around-the-Clock Network Monitoring [#enable-around-the-clock-network-monitoring]

Keep a constant eye on your network's key metrics to catch early signs of trouble, like unauthorized access attempts or unusual traffic spikes <a href="https://swifttechsolutions.com/swifttech-blog/why-you-need-24-7-network-monitoring-and-surveillance" target="_blank" style="text-decoration: none;" rel="nofollow noopener noreferrer"><sup>[1]</sup></a>. Use a monitoring system that not only tracks these metrics but also alerts you when something out of the ordinary happens.

### Deploy Intrusion Detection Systems (IDS) [#deploy-intrusion-detection-systems-ids]

An Intrusion Detection System (IDS) acts as a detective for your network, analyzing traffic and logs to uncover hidden attack patterns. Fine-tune the IDS settings to minimize false alarms while ensuring it can reliably identify real threats.

### Configure Automated Alerts for Unusual Activity [#configure-automated-alerts-for-unusual-activity]

Set up automated alerts - via email or text - for critical events like suspicious logins or unexpected data transfers. Regularly review and tweak the alert thresholds to strike the right balance, ensuring you’re notified of real concerns without being overwhelmed by minor issues.

## Step 5: Maintain Updates, Backups, and Recovery Testing [#step-5-maintain-updates-backups-and-recovery-testing]

No matter how robust your defenses are, they won’t hold up without up-to-date software and proven recovery processes. This step focuses on keeping your VPS resilient and prepared for quick recovery, ensuring your defenses stay effective over time. Maintenance is just as essential as prevention when it comes to a complete DDoS defense strategy.

### Schedule Automatic Updates [#schedule-automatic-updates]

Keeping your VPS software current is non-negotiable. Enable automatic updates for your operating system, web server, and security tools to ensure they’re always running the latest versions. Many Linux distributions have unattended upgrade options that handle critical security patches without manual effort.

Plan updates during periods of low traffic to reduce any potential disruptions. Configure your system to restart services automatically if needed, and make it a habit to update all components regularly - this includes DDoS protection tools, firewall rules, and monitoring software. These tools rely on the latest threat intelligence to remain effective.

### Set Up Regular Backups [#set-up-regular-backups]

Backups are your safety net. Aim for weekly backups, or even daily ones for critical data. Store these backups in an off-site location, separate from your main VPS infrastructure. This protects your data not only from DDoS attacks but also from hardware failures or accidental corruption.

Make sure to back up everything - data, server configurations, security settings, and scripts. This way, you can quickly restore your VPS environment if needed. Just as important, test your backups regularly by restoring them in a separate test environment. A backup is only useful if it’s intact and functional when you need it most.

### Test Recovery Procedures [#test-recovery-procedures]

Once your updates and backups are in place, it’s time to test your recovery readiness. Being prepared means more than just having a plan - it’s about knowing it works. Simulate DDoS attacks in controlled environments to evaluate your recovery process without disrupting live services. Start with simple attack patterns and gradually increase complexity to mirror real-world scenarios <a href="https://cloudscale365.com/ddos-cloud-protection-testing-your-strategy" target="_blank" style="text-decoration: none;" rel="nofollow noopener noreferrer"><sup>[2]</sup></a>.

Focus your testing on critical metrics like packet loss, network latency, CPU and memory usage, and application response times. Document your system’s baseline performance, how it reacts to different attack types, and any adjustments you make during testing. This documentation will be a valuable resource for refining your defenses and onboarding new team members.

Try simulating various attack types - such as Layer 3/4 floods, application-layer attacks, and mixed vectors - during peak traffic times. Measure how quickly attacks are detected, how effective your mitigation strategies are, and how long it takes to recover once the attack stops <a href="https://cloudscale365.com/ddos-cloud-protection-testing-your-strategy" target="_blank" style="text-decoration: none;" rel="nofollow noopener noreferrer"><sup>[2]</sup></a>. Also, evaluate the impact on legitimate traffic during and after these tests to ensure your defenses don’t interfere with the user experience.

## What to ask before you buy a VPS with DDoS protection [#what-to-ask-before-you-buy-a-vps-with-ddos-protection]

"DDoS protection" on a VPS listing can mean very different things. Ask these questions and get the answers in writing:

- **Which layers are covered?** Network-level protection (layers 3 and 4) absorbs floods aimed at the IP address. It does not inspect HTTP requests. Website attacks at layer 7 need a reverse proxy or web application firewall in front of the site.
- **Is it always on or triggered?** Some providers filter all traffic. Others start mitigation only after an attack is detected, which can drop traffic for the first minutes.
- **What happens during a large attack?** Some providers null-route the IP address, which takes the server offline until the attack ends.
- **Is it included or an add-on?** Check the price and the capacity limit before you rely on it.

StealthRDP EU plans (Amsterdam) include network-level DDoS protection; USA plans do not. For websites and HTTP/HTTPS applications, [Citadel](/citadel) is a separate Layer 7 protection product that sits in front of your site. It does not need a StealthRDP VPS.

## Conclusion: Key Points for DDoS-Protected VPS Hosting [#conclusion-key-points-for-ddos-protected-vps-hosting]

Protecting your VPS from DDoS attacks requires a layered, proactive approach. By following the five-step strategy outlined here, you can build a defense system that effectively blocks malicious traffic while allowing legitimate users to access your services without disruption.

Start with the protections your hosting provider offers and strengthen them with additional server-level measures. Combining your provider's infrastructure defenses with your own configurations - like firewalls, authentication systems, and monitoring tools - creates a robust shield against attacks. While built-in protections are a great starting point, they work best when reinforced by your own security practices.

To maximize defense, integrate automated tools with manual configurations. Use SSH keys and multi-factor authentication alongside firewalls and intrusion detection systems (IDS) to create multiple layers of security. Tools like Fail2Ban and cloud-based filtering solutions help block suspicious activity before it becomes a problem. These overlapping defenses make it much harder for attackers to breach your system.

Ongoing monitoring and maintenance are critical for long-term security. Regularly update your tools to stay ahead of new threats, and maintain consistent backups to ensure quick recovery if an attack does succeed. Testing your recovery procedures in controlled settings helps you identify and address vulnerabilities before they can be exploited.

Implementing these measures not only minimizes downtime but also safeguards your reputation. Many small businesses and developers who adopt these strategies experience fewer disruptions and faster recovery during traffic surges. While your users may never see the attacks being thwarted, they’ll appreciate the reliability and smooth performance of your services.

## FAQs [#faqs]

### What’s the difference between provider-level and server-level DDoS protection for a VPS? [#whats-the-difference-between-provider-level-and-server-level-ddos-protection-for-a-vps]

Provider-level DDoS protection is a service managed by your hosting provider. It operates at the network level, blocking massive attacks before they can even touch your VPS. This kind of defense is automatic, aiming to reduce downtime and prevent latency issues caused by large-scale volumetric attacks.

In contrast, server-level protection is something you set up directly on your VPS. Tools like firewalls, traffic filtering systems, and intrusion detection software are used to guard against more focused, application-layer attacks. While this approach allows for greater customization, it also requires regular management and monitoring to stay effective.

To sum it up, **provider-level protection** automatically handles large-scale threats, while **server-level protection** puts you in control but comes with the responsibility of ongoing upkeep.

### What’s the best way to test my VPS recovery plan for handling DDoS attacks and minimizing downtime? [#whats-the-best-way-to-test-my-vps-recovery-plan-for-handling-ddos-attacks-and-minimizing-downtime]

To make sure your VPS recovery plan can stand up to a DDoS attack, start by running controlled simulations that replicate real-world attack scenarios. These tests give you a clear picture of how quickly your team can respond and how well your mitigation strategies hold up under pressure. Use tools designed to monitor network traffic and spot unusual activity early, so you can activate recovery measures right away when an attack occurs.

It’s also important to regularly test and tweak your procedures. This ongoing adjustment helps keep your defenses sharp. With consistent practice and preparation, you’ll minimize downtime and ensure your system is ready to handle disruptions with as little impact as possible.

### Why should I use both SSH key authentication and Multi-Factor Authentication (MFA) to secure my server? [#why-should-i-use-both-ssh-key-authentication-and-multi-factor-authentication-mfa-to-secure-my-server]

Using **SSH key authentication** alongside **Multi-Factor Authentication (MFA)** is a powerful way to bolster your server's security. SSH keys use cryptographic methods for authentication, making them tough to crack through brute-force attacks or password guessing.

MFA adds an additional safeguard by requiring a second verification step, like a code from an authenticator app or a hardware token. This means that even if one layer is compromised, the other remains intact, making unauthorized access nearly impossible. Together, these two methods create a strong barrier against potential breaches, keeping your server well-protected.

---
order: 34
title: Configure Citadel allowlists
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/allowlists
summary: Bypass challenges for trusted paths, IPs, and user agents on every hostname.
relatedSlugs:
  - citadel-security
  - citadel-challenge-levels
illustration:
  src: /citadel-docs/allowlist-paths.svg
  alt: Citadel allowlist paths, IPs and User-Agent controls
  caption: Path, IP and User-Agent bypass rules apply across protected hostnames.
  width: 960
  height: 300
---
## Add a bypass
Open Security → Allowlist / bypass, add specific rules, then Save allowlist. Matching clients bypass challenges, including Lockdown, across the apex, `www`, and protected subdomains for that domain.
## Path rules
Paths must start with `/`. `/api/` matches `/api`, `/api/`, and descendants such as `/api/auth/google`. `/api` also matches descendants but not `/apiv2`. Keep rules specific because other security features can still depend on rule order.
## IP and User-Agent rules
Enter an exact IPv4/IPv6 address or CIDR, such as `203.0.113.0/24`. Behind trusted Cloudflare edges, Citadel uses the visitor or webhook source IP from `CF-Connecting-IP` or `X-Real-IP`; do not allowlist Cloudflare's shared IPs. User-Agent uses a substring match, such as `Stripe/` or `UptimeRobot`, and is easier to spoof than path or IP matching.
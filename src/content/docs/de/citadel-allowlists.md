---
order: 34
title: Citadel-Allowlists konfigurieren
sidebarTitle: Allowlist-Regeln
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/allowlists
summary: "Umgehen Sie Challenges für vertrauenswürdige Pfade, IP-Adressen und User-Agents mit Citadel-Allowlist-Regeln auf allen Hostnamen."
relatedSlugs:
  - citadel-security
  - citadel-challenge-levels
illustration:
  src: /citadel-docs/allowlist-paths.svg
  alt: Citadel allowlist paths, IPs and User-Agent controls
  caption: Path, IP and User-Agent bypass rules apply across protected hostnames.
  width: 960
  height: 300
translationOf: citadel-allowlists
locale: de
publishAt: 2026-10-17
primaryKeyword: citadel allowlist
---
## Bypass in der Citadel-Allowlist anlegen

Öffnen Sie Security → Allowlist / bypass, fügen Sie gezielte Regeln zur Citadel-Allowlist hinzu und klicken Sie auf „Save allowlist“. Passende Clients umgehen Challenges, auch Lockdown, für die Root-Domain (Apex), `www` und geschützte Subdomains dieser Domain.

## Pfadregeln

Pfade müssen mit `/` beginnen. `/api/` passt auf `/api`, `/api/` und Unterpfade wie `/api/auth/google`. `/api` passt ebenfalls auf Unterpfade, aber nicht auf `/apiv2`. Halten Sie Regeln möglichst spezifisch, da andere Sicherheitsfunktionen möglicherweise ebenfalls von der Reihenfolge der Regeln abhängen.

## IP- und User-Agent-Regeln

Geben Sie eine exakte IPv4- oder IPv6-Adresse oder einen CIDR-Bereich ein, zum Beispiel `203.0.113.0/24`. Hinter vertrauenswürdigen Cloudflare-Edge-Servern verwendet Citadel die IP-Adresse des Besuchers oder der Webhook-Quelle aus `CF-Connecting-IP` oder `X-Real-IP`.

:::warn
Nehmen Sie keine gemeinsam genutzten IP-Adressen von Cloudflare in die Allowlist auf.
:::

Der User-Agent wird per Substring-Abgleich geprüft, zum Beispiel `Stripe/` oder `UptimeRobot`. Er lässt sich leichter fälschen als der Abgleich von Pfad oder IP.

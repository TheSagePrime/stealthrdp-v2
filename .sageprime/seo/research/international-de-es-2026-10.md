# German and Spanish market research — October 2026

Research for the `/de` and `/es` versions of the site. Keyword maps: `../keyword-map-de-de.json` and
`../keyword-map-es-es.json`. Source: OpenSEO (DataForSEO), 2026-10-05.

## Scope

| Market | Location code | Seeds | Unique keywords |
|---|---|---|---|
| Germany, German | 2276 | 10 | 930 |
| Spain, Spanish | 2724 | 10 | 680 |
| Mexico, Spanish | 2484 | 5 | 338 |

## Findings

1. **Germany is the larger market for what StealthRDP sells.** Windows VPS searches have real volume and low
   difficulty: "windows vserver" 2,900/month (KD 9), "windows vps" 880 (KD 14), "vps server windows" 880
   (KD 3), "windows server mieten" 320 (KD 0). Spain's equivalents are 320 each.
2. **Germans say "vServer" and "mieten" (rent).** "vserver" 1,600, "vserver mieten" 590, "vps server
   mieten" 390, "root server mieten" 590. The English pages' keywords do not carry over.
3. **"RDP" is not a buying word in either language.** The German "rdp server" results are Wikipedia,
   Microsoft and ubuntuusers; the Spanish "servidor rdp" results are Reddit sysadmin threads. Buyers search
   for a Windows server instead. `/de/rdp-vps` and `/es/rdp-vps` get small targets; the Windows pages carry
   the demand.
4. **Minecraft intent differs from the product.** "minecraft server mieten" (5,400) is won by game hosts
   with control panels (Nitrado, ZAP-Hosting). StealthRDP sells a VPS the customer sets up, so the German
   page leads with "minecraft server selber hosten" (320, KD 11) and answers "mieten" in one section.
5. **Spain is price-led and OVHcloud owns it.** OVHcloud ranks first for nearly every Spanish VPS term. "vps
   barato" alone is 880/month; the whole "barato" family is about 2,000.
6. **Mexico is not worth a separate version yet.** VPS terms are small, and "rdp" there is mostly a vitamin
   C medicine brand.
7. **Google shows an AI Overview on most of these results.** Clear, direct answers and FAQ sections matter
   on every page.

## Competitors

Germany (commercial keywords, organic):
ionos.de, host-unlimited.de, strato.de, ovhcloud.com, netcup.com, contabo.com, hetzner.com,
zap-hosting.com. Comparison sites that rank and are worth outreach later: hosttest.de,
vserververgleich.com, hostflash.de, experte.de, serverspy.de.

Spain:
ovhcloud.com, piensasolutions.com, ionos.es, contabo.com, strato.es, clouding.io, arsys.es,
profesionalhosting.com. Comparison sites: bitcatcha.com, geekflare.com.

## What competitors promise, and what we may say

| Competitor message | StealthRDP position | Action |
|---|---|---|
| "Windows-Lizenz inklusive" (German Windows vServer pages) | Licence **not** included (PRODUCT_FACTS) | State it plainly. Owner: is a licence add-on possible? |
| "Deutsche Rechenzentren", "DSGVO-konform" | Data centre in Amsterdam (EU) | Say "Amsterdam (EU)". "DSGVO-konform" needs owner approval |
| "IP española", "centro de datos en España" | No Spanish location | Never imply one |
| "ab 3,95 €/Monat" | Plans from 4.59 € (`plans.json`) | Show real prices from `plans.json` |

## Decisions for the owner

1. **The local word for "cheap".** PRODUCT_FACTS bans "cheap". Does the ban cover "günstig" (about 1,100
   searches/month) and "barato"/"económico" (about 2,000)? Until decided, these keywords stay unused.
2. **"DSGVO-konform" (GDPR-compliant).** Approve the claim, with wording, or keep it out.
3. **Windows licence.** Keep "not included", or offer a licence add-on that the German market expects.

## Guide backlog (for the 2-3 day batches)

German: forex vps (590), remotedesktopverbindung (2,400), remote desktop verbindung (720), Windows Server
2025 Lizenz (720), ubuntu xrdp (210), DDoS-Angriff (2,900, informational).

Spanish: qué es un VPS (720 + 480), escritorio remoto Windows (480), forex vps (320), escritorio remoto
Windows 11 (210).

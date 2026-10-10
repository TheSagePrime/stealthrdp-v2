# German and Spanish resources — keyword research, 10 October 2026

Scope: every Help Center article (22), Citadel doc (19) and blog post (17), for Germany (2276/de) and
Spain (2724/es). Source: OpenSEO (DataForSEO): one bulk keyword overview per market (145 DE / 139 ES
candidates), keyword ideas for 5 seeds per market, and 20 Google result pages. Cost: about $0.50.
Per-page plan (local slug, primary and supporting keywords, priority): `../briefs/i18n/plan.json`.

## Findings

1. **Remote Desktop is the biggest support topic in both markets.** DE: "remote desktop" 12,100,
   "remotedesktopverbindung" 2,400, "remote desktop verbindung" 720, "remotedesktop einrichten" 480,
   "microsoft remote desktop mac" 1,000, "windows 11 remote desktop aktivieren" 390. ES: "conexión a
   escritorio remoto" 590, "escritorio remoto windows" 480, "escritorio remoto mac" 260. Results are
   step-by-step tutorials (Microsoft, chip.de, IONOS), so a tutorial format fits.
2. **Microsoft renamed the Mac/iOS client to "Windows App".** Apple's App Store and Microsoft Learn both say
   "Windows App (previously named Microsoft Remote Desktop)"; "windows app" has 4,400 DE searches. Every
   language version of the RDP login article must use the new name. The English article should be checked.
3. **"502 bad gateway" is a large, weak result page in Germany:** 8,100 searches, KD 0, and the top
   results are English (Stackify, Postman) and Reddit. A German page that explains and fixes it is a strong
   opportunity. Candidate for the new article (step 6), and for the Citadel origin-health doc.
4. **Windows licence searches are shopping searches.** "windows server 2025 lizenz" (720) and "licencia
   windows server" (110) return licence shops. Our page cannot rank for buying intent; it targets the
   question of licensing a Windows VPS, and must keep saying the licence is not included.
5. **"rate limiting" (DE 720, ES 210) and "ddos-angriff" (DE 2,900) / "ataque ddos" (ES 1,000)** are
   informational. Results are Wikipedia, BSI, Cloudflare and Akamai: hard to outrank, but useful as
   supporting terms in the Citadel security doc and the DDoS blog post.
6. **Blog demand:** DE "discord bot hosting" 590, "forex vps" 590, "webmin" 1,600 (control panels post),
   "minecraft server erstellen" 1,900, "storage vps" 320, "server backup" 480. ES "webmin" 1,600,
   "crear servidor minecraft" 590, "hosting minecraft" 590, "forex vps" 320, "vps que es" 720.
7. **Many tutorial and policy pages have little or no local demand** (cPanel install, Outline, OpenVPN
   tun/tap, CWP, policies). They are still translated (owner decision, 10 October), and they are
   published last (priority 3).

## Decisions

- German and Spanish pages keep the English slug (`/de/docs/<same slug>`). Local slugs would need changes to the protected hreflang core and SEO audits for a negligible ranking gain.
- Policy pages are translated with a notice that the English version is legally binding.
- Publish order follows the priority in `plan.json`: 17 priority-1 pages first, priority 3 last.

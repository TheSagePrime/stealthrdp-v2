# Brief: 502 Bad Gateway (new blog post, EN + DE + ES)

Researched 2026-10-10 with OpenSEO (DataForSEO). File: `src/content/guides/502-bad-gateway.md`, URL
`/blog/502-bad-gateway.html`; translations `src/content/guides/{de,es}/502-bad-gateway.md` (English slug,
see `i18n/plan.json` slug rule).

## Demand

| Market | Keyword | Volume / month | KD |
|---|---|---|---|
| US (en) | 502 bad gateway | 40,500 | 8 |
| US (en) | 504 gateway timeout | 12,100 | 4 |
| US (en) | 502 bad gateway meaning | 9,900 | 5 |
| US (en) | what is 502 bad gateway | 2,900 | 6 |
| US (en) | 502 bad gateway nginx | 1,300 | 0 |
| US (en) | how to fix 502 bad gateway / 502 bad gateway fix | 880 / 880 | 3 / 5 |
| US (en) | 502 bad gateway cloudflare | 170 | 3 |
| DE (de) | 502 bad gateway | 8,100 | 0 |
| DE (de) | http 502 | 2,900 | 1 |
| DE (de) | 504 gateway timeout | 2,900 | 2 |
| DE (de) | 502 bad gateway nginx | 720 | 0 |
| DE (de) | 502 bad gateway bedeutung | 590 | 0 |
| DE (de) | fehler 502 | 480 | 0 |
| ES (es) | 502 bad gateway | 2,900 | 0 |
| ES (es) | 504 gateway timeout | 720 | 3 |
| ES (es) | 502 bad gateway que significa | 390 | 0 |
| ES (es) | 502 bad gateway nginx | 140 | 0 |

## Results today (top 10, 2026-10-10)

- US: AI overview, Reddit, webnots, dopinger, scrapeless, apidog, small blogs. Mostly visitor tips
  ("clear your cache"), thin on the server side.
- DE: English pages (Stackify, Postman), Reddit, one Elementor page in German. No strong German page.
- ES: SiteGround, wnpower, thepower.education, MDN (English), Cloudflare community, AWS.

**Angle that wins:** one page that answers the meaning in the first two sentences, then splits into
"you are a visitor" (short) and "you run the site" (the depth nobody else has): find which hop
returned the 502, read the nginx error-log line, map it to the cause, fix, prevent. Plus the 502 vs
503 vs 504 table (504 has its own big demand) and the Cloudflare/Citadel case.

## Keywords

- Primary: en "502 bad gateway"; de "502 bad gateway" (support: "fehler 502", "http 502", "502 bad
  gateway bedeutung", "502 bad gateway nginx"); es "502 bad gateway" (support: "error 502", "502 bad
  gateway que significa", "502 bad gateway nginx").
- Supporting en: "502 bad gateway meaning", "what is 502 bad gateway", "502 bad gateway nginx",
  "how to fix 502 bad gateway", "504 gateway timeout", "502 bad gateway cloudflare".

## Facts the post must get right (from the sources)

1. RFC 9110 §15.6.3: 502 means a server acting as a gateway or proxy received an **invalid response**
   from an inbound (upstream) server. §15.6.5: 504 means it **did not receive a timely response**.
   503 (§15.6.4): the server is temporarily unable to handle the request (overload or maintenance).
2. In nginx: an upstream that refuses the connection, resets it, closes it early, or sends a header
   nginx cannot parse/that is too big gives **502**; an upstream that is too slow (proxy_read_timeout,
   fastcgi_read_timeout, default 60s) gives **504**. Do not tell readers to raise timeouts to fix a 502.
3. Typical nginx error-log lines (in `/var/log/nginx/error.log`) and their cause:
   - `connect() failed (111: Connection refused) while connecting to upstream` → app not running or
     listening on another port.
   - `connect() to unix:/run/php/php8.3-fpm.sock failed (2: No such file or directory)` → wrong
     socket path or PHP-FPM stopped. `(13: Permission denied)` → socket owner/mode.
   - `upstream prematurely closed connection while reading response header from upstream` → the app
     crashed or was killed mid-request (often out of memory).
   - `upstream sent too big header while reading response header from upstream` → raise
     `proxy_buffer_size` / `fastcgi_buffer_size` (and `*_buffers`).
   - `no live upstreams while connecting to upstream` → every server in the upstream block is marked
     failed.
4. Cloudflare (official doc): a **Cloudflare-branded** 502/504 page means the error came from **your
   origin**; a **plain page without Cloudflare branding** usually came from Cloudflare, but Cloudflare
   also lists broken gzip at the origin as a cause of unbranded 502s. `server: cloudflare` and `cf-ray`
   are on every proxied response, so they do not say which side failed.
5. Google (official doc): 5xx and 429 make Google's crawlers slow down; indexed URLs are kept at first
   but URLs that keep returning server errors are eventually dropped; crawling speeds back up once the
   server answers 2xx again. So a short 502 is harmless, a long one costs rankings.
6. StealthRDP: Linux plans have full Root access (PRODUCT_FACTS); the customer runs their own web
   server. Do not call the plans "unmanaged" or "managed": PRODUCT_FACTS does not say either. Citadel is the separate
   Layer 7 protection product; it sits in front of the origin like a proxy, so a visitor-facing 502
   can mean Citadel cannot reach the origin. Its Health page runs origin probes
   (`/citadel/docs/health`), Origin settings are at `/citadel/docs/origin`. Never invent features.

## Sources (all opened 2026-10-10, use in this order)

1. RFC 9110: HTTP Semantics — https://www.rfc-editor.org/rfc/rfc9110 — RFC Editor (IETF)
2. 502 Bad Gateway — https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/502 — MDN Web Docs (Mozilla)
3. 504 Gateway Timeout — https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/504 — MDN Web Docs (Mozilla)
4. Module ngx_http_proxy_module — https://nginx.org/en/docs/http/ngx_http_proxy_module.html — nginx
5. Module ngx_http_fastcgi_module — https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html — nginx
6. PHP: Configuration (FPM) — https://www.php.net/manual/en/install.fpm.configuration.php — The PHP Group
7. Error 502 or 504 — https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-502-504/ — Cloudflare
8. How HTTP Status Codes Affect Google's Crawlers — https://developers.google.com/crawling/docs/troubleshooting/http-status-codes — Google

## Internal links (verified paths)

`/linux-vps`, `/plans`, `/citadel`, `/citadel/docs/health`, `/citadel/docs/origin`,
`/blog/7-best-tools-for-server-uptime-monitoring-2025.html`,
`/blog/8-signs-you-need-to-upgrade-your-vps-resources.html`,
`/blog/common-vps-hosting-issues-and-their-solutions.html`,
`/blog/common-vps-performance-bottlenecks.html`, `/docs/server-stops-randomly`.

## Outline (English)

- Title: `502 Bad Gateway: What It Means and How to Fix It` · sidebarTitle `502 Bad Gateway`
- Excerpt (≤160): what it means + that the post covers visitors and server owners (nginx, PHP-FPM,
  Cloudflare).
- Intro: two-sentence definition answering the query, then who should read which section.
- `## What does 502 Bad Gateway mean?` — the request chain (browser → CDN/proxy → web server → app),
  a 502 is a bad answer between two servers, not the visitor's device. Cite [1], [2].
- `## 502 vs 503 vs 504` — table: code, what happened, typical cause, first thing to check. Cite [1], [3].
- `## If you see a 502 as a visitor` — short list: wait and reload, try another network/browser, check
  the site's status page; say plainly that the fix is usually on the server.
- `## How to fix a 502 Bad Gateway on your server` — numbered `###` steps (timeline):
  1. Find which server returned the 502 (`curl -I`, `server:` header, Cloudflare `cf-ray`).
  2. Read the error log (`sudo tail -n 50 /var/log/nginx/error.log`) — table of log line → cause → fix (fact 3). Cite [4], [5].
  3. Check the app is running (`systemctl status`, `ss -ltnp`), code tabs for PHP-FPM / Node (pm2 or systemd) / Gunicorn.
  4. Check `proxy_pass` / `fastcgi_pass` matches the real address or socket; `nginx -t` then reload.
  5. Check memory and crashes (`dmesg -T | grep -i -E "out of memory|killed process"`, PHP-FPM `pm.max_children` warning). Cite [6].
  6. Fix header-size 502s (buffer settings, code with `title="nginx.conf"` and `// [!code ++]`-style markers using `#`). Cite [4].
  7. Check the firewall between proxy and origin.
- `## 502 behind Cloudflare or Citadel` — branded vs unbranded (fact 4, cite [7]); Citadel Health and Origin links.
- `## Does a 502 hurt SEO?` — fact 5, cite [8].
- `## How to prevent 502 errors` — monitoring (link uptime post), enough RAM (link 8 signs), restart
  policies (`Restart=on-failure` systemd snippet), health checks; soft CTA to `/linux-vps` / `/plans`
  without claims we cannot back.
- No FAQ schema, no invented numbers, no "managed support" claims.

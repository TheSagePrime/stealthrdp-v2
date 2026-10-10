---
order: 18
title: '502 Bad Gateway: What It Means and How to Fix It'
sidebarTitle: 502 Bad Gateway
excerpt: "502 Bad Gateway means a server got an invalid answer from the server behind it. The guide covers visitors and server owners: nginx, PHP-FPM, Cloudflare."
category: VPS Management
author: StealthRDP Team
date: 2026-10-10
readingTime: 9
sources:
  - title: "RFC 9110: HTTP Semantics"
    url: https://www.rfc-editor.org/rfc/rfc9110
    publisher: RFC Editor (IETF)
    accessedAt: 2026-10-10
  - title: "502 Bad Gateway"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/502
    publisher: MDN Web Docs (Mozilla)
    accessedAt: 2026-10-10
  - title: "504 Gateway Timeout"
    url: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/504
    publisher: MDN Web Docs (Mozilla)
    accessedAt: 2026-10-10
  - title: "Module ngx_http_proxy_module"
    url: https://nginx.org/en/docs/http/ngx_http_proxy_module.html
    publisher: nginx
    accessedAt: 2026-10-10
  - title: "Module ngx_http_fastcgi_module"
    url: https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html
    publisher: nginx
    accessedAt: 2026-10-10
  - title: "PHP: Configuration (FPM)"
    url: https://www.php.net/manual/en/install.fpm.configuration.php
    publisher: The PHP Group
    accessedAt: 2026-10-10
  - title: "Error 502 or 504"
    url: https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-502-504/
    publisher: Cloudflare
    accessedAt: 2026-10-10
  - title: "How HTTP Status Codes Affect Google's Crawlers"
    url: https://developers.google.com/crawling/docs/troubleshooting/http-status-codes
    publisher: Google
    accessedAt: 2026-10-10
---
502 Bad Gateway means that a server acting as a gateway or proxy received an invalid response from the server behind it. The error sits between two servers, so it does not come from the visitor's browser or device. <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> <a class="seo-article-citation" href="#source-2" aria-label="Source 2">[2]</a>

This guide has two parts. If you are a visitor, the short section below lists what you can try. If you run the site, the fix section finds which hop returned the 502, reads the log line that names the cause, and walks through the fix and how to prevent it.

## What does 502 Bad Gateway mean?

A request to a website often passes through several hops:

`browser → CDN or proxy → web server → application`

Each hop forwards the request to the next one. If the hop behind a proxy returns an answer the proxy cannot use, the proxy returns 502. The status code does not say which hop failed. In nginx, a 502 also appears when the upstream refuses the connection, resets it, or closes it early, so the code only tells you that the link behind the proxy broke.

Two things a 502 is not. It is not a report that the visitor sent a bad request. It is also not a timeout. A slow upstream gives a different code, covered in the next section.

## 502 vs 503 vs 504

Three codes cover most server-side failures between hops. They point to different causes, so read the code before you start digging.

| Code | What happened | Typical cause | First thing to check |
|---|---|---|---|
| 502 Bad Gateway | The gateway got an invalid response from the upstream server <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> <a class="seo-article-citation" href="#source-2" aria-label="Source 2">[2]</a> | The app is down or refused the connection, crashed mid-request, or sent headers nginx cannot accept | The nginx error log line for the request |
| 503 Service Unavailable | The server is temporarily unable to handle the request <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> | Overload or planned maintenance | Load on the server and whether work is in progress |
| 504 Gateway Timeout | The gateway did not receive a timely response from the upstream server <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> <a class="seo-article-citation" href="#source-3" aria-label="Source 3">[3]</a> | The upstream is too slow, for example a long database query, and the proxy timeout expired <a class="seo-article-citation" href="#source-4" aria-label="Source 4">[4]</a> | Which request is slow, and what the app is doing while it waits |

A 504 is a timing failure. The upstream answered too late, not wrongly. In nginx, the default proxy and FastCGI read timeouts are 60 seconds <a class="seo-article-citation" href="#source-4" aria-label="Source 4">[4]</a> <a class="seo-article-citation" href="#source-5" aria-label="Source 5">[5]</a>.

:::warn[Raising a timeout does not fix a 502]
Timeouts such as `proxy_read_timeout` and `fastcgi_read_timeout` only control how long nginx waits for an answer. A 502 means the answer was broken, missing, or never arrived. Raising the timeout will not change that. Use timeouts only when the error is a 504.
:::

## If you see a 502 as a visitor

You cannot fix the server, but you can rule out your side and report the problem.

- Wait a minute and reload the page. A restart or a deploy on the server can end the error by itself.
- Try another browser, or another network such as mobile data. If the site loads there, the problem is local to your connection.
- Check the site's status page, if it has one.
- Note the time and the exact address you opened. The site owner needs them to find the matching log line.

The fix is usually on the server, so only the site owner can make the error go away. If you own the site, use the steps below.

## How to fix a 502 Bad Gateway on your server

Work from the outside in. Each step rules out one hop before you move to the next.

### 1. Find which server returned the 502

Request the page twice. The first request uses the public path. The second connects straight to your origin server's IP address and sends the site name in the Host header. Replace the example address with your own.

```bash
curl -I "https://www.example.com/"
curl -I --resolve www.example.com:443:203.0.113.10 "https://www.example.com/"
```

Read the status line and the headers of each response:

- A `cf-ray` header and `server: cloudflare` mean the response passed through Cloudflare. They appear even when the 502 came from your origin, so they do not tell you which side failed; the page itself does (see the Cloudflare and Citadel section below).
- A `server: nginx` header on the direct request means nginx on your origin produced the 502.

If the direct request also returns 502, the origin is the source, so go to step 2. If the direct request returns 200 while the public request returns 502, the failure is in the path in front of the origin. Read the page itself in the Cloudflare and Citadel section below, and check step 7.

### 2. Read the error log

When nginx cannot get a usable answer from the upstream, it writes the reason to its error log. Read the most recent lines:

```bash
sudo tail -n 50 /var/log/nginx/error.log
```

Match the message to the cause:

| Log line (contains) | Usual cause | What to do |
|---|---|---|
| `connect() failed (111: Connection refused) while connecting to upstream` | The app is not running, or it listens on another port | Start the app, or fix the port (step 3) |
| `connect() to unix:/run/php/php8.3-fpm.sock failed (2: No such file or directory)` | Wrong socket path, or PHP-FPM is stopped | Check the socket path and the service (steps 3 and 4) |
| `connect() to unix:/run/php/php8.3-fpm.sock failed (13: Permission denied)` | The socket's owner or mode does not let nginx connect | Check the `listen.owner`, `listen.group` and `listen.mode` settings in the PHP-FPM pool |
| `upstream prematurely closed connection while reading response header from upstream` | The app crashed or was killed during the request, often because it ran out of memory | Check memory and crash logs (step 5) |
| `upstream sent too big header while reading response header from upstream` | The response headers are larger than nginx's buffer | Raise the buffer size (step 6) |
| `no live upstreams while connecting to upstream` | Every server in the upstream block is marked as failed | Check the servers in the block, then the app behind each one (step 3) |

The line names the upstream address or socket. Compare it with what the app really listens on.

### 3. Check that the app is running

Check the service and the port or socket it listens on. Use the tab that matches your stack.

```bash tab="PHP-FPM"
sudo systemctl status php8.3-fpm
sudo ss -lxp | grep php
```

```bash tab="Node"
pm2 status
sudo ss -ltnp | grep 3000
```

```bash tab="Gunicorn"
sudo systemctl status gunicorn
sudo ss -ltnp | grep 8000
```

If you run Node under systemd, use `systemctl status <service>` in place of `pm2 status`. If the service is stopped, read its logs before you restart it, so the reason for the crash is not lost. For example, `sudo journalctl -u php8.3-fpm -n 100`.

### 4. Check that proxy_pass or fastcgi_pass matches the app

The address in nginx must match the port or socket from step 3. A mismatch produces the "Connection refused" or "No such file or directory" lines from step 2.

For a reverse proxy to an app on a local port:

```text title="/etc/nginx/sites-available/example.conf"
location / {
    proxy_pass http://127.0.0.1:3000;
}
```

For PHP-FPM over a Unix socket:

```nginx title="/etc/nginx/sites-available/example.conf"
location ~ \.php$ {
    fastcgi_pass unix:/run/php/php8.3-fpm.sock;
}
```

Test the configuration, then reload. If the test fails, the reload does not run, so nginx keeps the configuration that is already working.

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Check memory and crashes

The `upstream prematurely closed connection` line points to a process that died mid-request. On a small VPS, the usual reason is the kernel's out-of-memory killer. Search the kernel log:

```bash
sudo dmesg -T | grep -i -E "out of memory|killed process"
free -h
```

For PHP-FPM, check the PHP-FPM error log for `server reached pm.max_children setting`. This message means all child workers are busy. Each worker uses RAM, so raise `pm.max_children` only after you have checked that the server has memory to spare for the extra workers <a class="seo-article-citation" href="#source-6" aria-label="Source 6">[6]</a>.

If the memory is simply too small for the site, the fix is a larger plan, not a bigger timeout. See [common VPS performance bottlenecks](/blog/common-vps-performance-bottlenecks.html) for how memory pressure shows up as slowdowns.

### 6. Fix header-size 502s

If the log says `upstream sent too big header`, the upstream's response headers are larger than nginx's buffer. Raise the buffer for that location. The values below are examples; size them to your largest header.

```text title="/etc/nginx/sites-available/example.conf"
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_buffer_size 16k;  # [!code ++]
    proxy_buffers 8 16k;    # [!code ++]
}
```

For PHP-FPM, use `fastcgi_buffer_size` and `fastcgi_buffers` in the same way in the `fastcgi_pass` location <a class="seo-article-citation" href="#source-5" aria-label="Source 5">[5]</a>. Check the directive defaults and their exact syntax in the module reference <a class="seo-article-citation" href="#source-4" aria-label="Source 4">[4]</a>. You can also reduce the size of the headers the app sends, for example oversized cookies. Then test and reload as in step 4.

### 7. Check the firewall between the proxy and the origin

If a proxy sits on another host, or a service such as Cloudflare or Citadel connects to your origin, a firewall rule can block that connection. The proxy then gets no usable answer and returns 502. Check that the origin accepts connections from the proxy's addresses on the port it uses. On Ubuntu with ufw:

```bash
sudo ufw status verbose
```

If you use another firewall, check its rules instead.

## 502 behind Cloudflare or Citadel

The page body tells you which side produced the error. Cloudflare says a 502 or 504 page with Cloudflare branding came from your origin web server. A plain page without Cloudflare branding can come from Cloudflare, but Cloudflare also lists a compression problem at the origin as a cause of unbranded 502s <a class="seo-article-citation" href="#source-7" aria-label="Source 7">[7]</a>. So branding settles most cases, but not all of them. If the page is unbranded and the origin responds directly with 200, check the origin's compression settings.

Citadel is StealthRDP's separate Layer 7 HTTP/HTTPS protection product. It does not need a StealthRDP VPS, and it sits in front of your origin like a proxy. A visitor-facing 502 can therefore mean that Citadel cannot reach the origin. Check the origin probes on the [Citadel Health page](/citadel/docs/health) and the origin settings on the [Citadel Origin page](/citadel/docs/origin).

## Does a 502 hurt SEO?

A short 502 does little harm. Google's crawler documentation says that 5xx and 429 responses make its crawlers slow down. URLs that keep returning server errors are eventually dropped from the index, although indexed URLs are kept at first. Crawling speeds up again once the server returns 2xx responses <a class="seo-article-citation" href="#source-8" aria-label="Source 8">[8]</a>.

The practical point: fix the cause quickly. An error that keeps returning for a long time can cost rankings.

## How to prevent 502 errors

- **Monitor the site from outside.** An external check tells you when the 502 starts, instead of a visitor reporting it later. See [uptime monitoring tools](/blog/7-best-tools-for-server-uptime-monitoring-2025.html).
- **Keep enough RAM.** Out-of-memory kills cause the "prematurely closed connection" lines. If the server runs out of memory regularly, read [signs you need to upgrade your VPS resources](/blog/8-signs-you-need-to-upgrade-your-vps-resources.html) and [common VPS hosting issues and their solutions](/blog/common-vps-hosting-issues-and-their-solutions.html).
- **Restart the app when it fails.** A systemd unit with a restart policy brings the app back after a crash. `Restart=on-failure` restarts the process only when it exits with an error. It does not fix the bug that caused the crash, so keep the log lines from step 2.

```ini title="/etc/systemd/system/myapp.service"
[Service]
ExecStart=/usr/bin/node /srv/myapp/server.js
Restart=on-failure
RestartSec=5
```

- **Add a health check.** Give the app an endpoint that returns 200 only when it can serve requests, and monitor that endpoint. A process that is running but stuck will then show up as a failure.
- **Know where to look when the server stops.** If the server stops responding on its own, read [why a server stops randomly](/docs/server-stops-randomly).

:::tip[Plan for the next failure]
Write down the app's listening port or socket, the log path and the restart command before an incident. The fix in step 2 depends on the exact log line, and the fastest recovery depends on knowing the service name.
:::

## Running the fix yourself on a StealthRDP VPS

StealthRDP Linux plans come with full Root access, so you run the web server and the application yourself and can carry out every step in this guide on your own server. To compare plans, see [Linux VPS](/linux-vps) and [VPS plans](/plans).

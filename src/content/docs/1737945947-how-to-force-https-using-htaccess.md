---
order: 13
title: How to Force HTTPS with .htaccess
category: Web panels
date: Jan 27, 2025
sourceTitle: How to Force HTTPS using .htaccess
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737945947-how-to-force-https-using-htaccess
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Force HTTPS with .htaccess on Apache: redirect all traffic, one domain or specific folders with a 301 redirect, plus the Nginx equivalent and how to test it."
relatedSlugs: []
---
After you install an SSL/TLS certificate, your site answers on both `http://` and `https://`. Force HTTPS so every visitor and search engine uses the encrypted version. On Apache, you do this with rewrite rules in the `.htaccess` file. For why this matters, see [why you should redirect HTTP to HTTPS](/docs/why-you-should-redirect-all-http-traffic-to-https).

## Before you start

- A valid SSL/TLS certificate is installed and `https://yourdomain.com` loads without a browser warning.
- Apache has `mod_rewrite` enabled. On Debian or Ubuntu, run `sudo a2enmod rewrite` and restart Apache.
- The site's `AllowOverride` setting permits `.htaccess` rules.

## Force HTTPS on all traffic

Open `.htaccess` in your site's document root (for example `public_html`). Create the file if it does not exist. Add these lines near the top:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

`R=301` makes the redirect permanent, so browsers and search engines update to the HTTPS URL.

## Force HTTPS on one domain

If two domains serve the same site and you only want to redirect one of them:

```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^yourdomain1\.com$ [NC]
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Replace `yourdomain1.com` with your domain.

## Force HTTPS on specific folders

To redirect only some folders, list them in the rule:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(folder1|folder2|folder3)(/.*)?$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Replace the folder names with your own.

## Force HTTPS behind a proxy or CDN

If Cloudflare or a load balancer ends TLS before Apache, `%{HTTPS}` is always off and the rule above loops. Check the forwarded header instead:

```apache
RewriteEngine On
RewriteCond %{HTTP:X-Forwarded-Proto} !https
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

With Cloudflare, also set SSL/TLS to **Full** or **Full (strict)**, not **Flexible**.

## Force HTTPS on Nginx

Nginx does not read `.htaccess`. Add a separate server block for port 80 that redirects everything:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}
```

Test the configuration with `sudo nginx -t`, then reload with `sudo systemctl reload nginx`.

## Test the redirect

Run this from any computer:

```bash
curl -I http://yourdomain.com/
```

The response must show `301 Moved Permanently` and a `Location:` header that starts with `https://`. Clear your browser cache before you test in a browser, because browsers cache permanent redirects.

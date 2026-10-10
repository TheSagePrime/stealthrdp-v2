---
order: 13
title: "HTTPS-Weiterleitung mit .htaccess erzwingen"
sidebarTitle: HTTPS erzwingen
category: Web panels
date: Jan 27, 2025
sourceTitle: How to Force HTTPS using .htaccess
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737945947-how-to-force-https-using-htaccess
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Erzwingen Sie HTTPS per .htaccess auf Apache: alle Zugriffe, eine Domain oder Ordner per 301-Weiterleitung, dazu Nginx und der Test."
relatedSlugs: []
translationOf: 1737945947-how-to-force-https-using-htaccess
locale: de
publishAt: 2026-10-17
primaryKeyword: htaccess https weiterleitung
---
Nach der Installation eines SSL/TLS-Zertifikats antwortet Ihre Website sowohl auf `http://` als auch auf `https://`. Erzwingen Sie HTTPS, damit jeder Besucher und jede Suchmaschine die verschlüsselte Version nutzt. Unter Apache richten Sie die Weiterleitung von HTTP auf HTTPS mit Rewrite-Regeln in der Datei `.htaccess` ein. Warum das wichtig ist, erfahren Sie unter [warum Sie HTTP auf HTTPS umleiten sollten](/de/docs/why-you-should-redirect-all-http-traffic-to-https).

## Bevor Sie beginnen

- Ein gültiges SSL/TLS-Zertifikat ist installiert, und `https://yourdomain.com` lädt ohne Browserwarnung.
- Apache hat `mod_rewrite` aktiviert. Unter Debian oder Ubuntu führen Sie `sudo a2enmod rewrite` aus und starten Apache neu.
- Die Einstellung `AllowOverride` Ihrer Website erlaubt `.htaccess`-Regeln.

## Alle Zugriffe per .htaccess-Weiterleitung auf HTTPS umleiten

Öffnen Sie die Datei `.htaccess` im Dokumentenstammverzeichnis (Document Root) Ihrer Website, zum Beispiel `public_html`. Erstellen Sie die Datei, falls sie nicht existiert. Fügen Sie diese Zeilen möglichst weit oben ein:

```apache title=".htaccess"
# [!code ++]
RewriteEngine On
# [!code ++]
RewriteCond %{HTTPS} off
# [!code ++]
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

`R=301` macht die Weiterleitung dauerhaft, damit Browser und Suchmaschinen auf die HTTPS-URL umstellen.

## HTTPS für eine Domain erzwingen

Wenn zwei Domains dieselbe Website ausliefern und nur eine davon umgeleitet werden soll:

```apache title=".htaccess"
RewriteEngine On
RewriteCond %{HTTP_HOST} ^yourdomain1\.com$ [NC]
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Ersetzen Sie `yourdomain1.com` durch Ihre Domain.

## HTTPS für bestimmte Ordner erzwingen

Um nur bestimmte Ordner umzuleiten, tragen Sie diese in die Regel ein:

```apache title=".htaccess"
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(folder1|folder2|folder3)(/.*)?$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Ersetzen Sie die Ordnernamen durch Ihre eigenen.

## HTTPS hinter einem Proxy oder CDN erzwingen

Wenn Cloudflare oder ein Load Balancer TLS vor Apache beendet, ist `%{HTTPS}` immer aus, und die Regel oben erzeugt eine Weiterleitungsschleife. Prüfen Sie stattdessen den weitergeleiteten Header `X-Forwarded-Proto`:

```apache title=".htaccess"
RewriteEngine On
RewriteCond %{HTTP:X-Forwarded-Proto} !https
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Stellen Sie bei Cloudflare außerdem den SSL/TLS-Modus auf **Full** oder **Full (strict)** ein, nicht auf **Flexible**.

## HTTPS unter Nginx erzwingen

Nginx liest keine `.htaccess`-Dateien. Fügen Sie einen eigenen Server-Block für Port 80 hinzu, der alles weiterleitet:

```nginx title="Nginx server block"
# [!code ++]
server {
# [!code ++]
    listen 80;
# [!code ++]
    server_name yourdomain.com www.yourdomain.com;
# [!code ++]
    return 301 https://$host$request_uri;
# [!code ++]
}
```

Testen Sie die Konfiguration mit `sudo nginx -t` und laden Sie Nginx danach mit `sudo systemctl reload nginx` neu.

## Die Weiterleitung testen

Führen Sie dies auf einem beliebigen Computer aus:

```bash title="Check the redirect"
curl -I http://yourdomain.com/
```

Die Antwort muss `301 Moved Permanently` und einen `Location:`-Header enthalten, der mit `https://` beginnt. Leeren Sie den Browser-Cache, bevor Sie im Browser testen, da Browser dauerhafte Weiterleitungen zwischenspeichern.

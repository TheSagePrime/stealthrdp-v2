---
order: 18
title: '502 Bad Gateway: Bedeutung und Lösung des Fehlers'
sidebarTitle: 502 Bad Gateway
excerpt: '502 Bad Gateway heißt, dass ein Server vom Server dahinter eine ungültige Antwort erhalten hat. Der Ratgeber erklärt Ursachen und Lösungen.'
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
translationOf: 502-bad-gateway
locale: de
publishAt: 2026-10-10
primaryKeyword: 502 bad gateway
---
502 Bad Gateway bedeutet, dass ein Server, der als Gateway oder Proxy arbeitet, eine ungültige Antwort von dem Server hinter sich erhalten hat. Der Fehler liegt also zwischen zwei Servern und kommt nicht vom Browser oder Gerät des Besuchers. <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> <a class="seo-article-citation" href="#source-2" aria-label="Source 2">[2]</a>

Dieser Ratgeber erklärt die Bedeutung von 502 Bad Gateway in zwei Teilen. Als Besucher finden Sie im kurzen Abschnitt unten, was Sie versuchen können. Betreiben Sie die Website selbst, zeigt Ihnen der Abschnitt zur Behebung, welche Station den Fehler zurückgibt, wie Sie die Zeile im Protokoll lesen, die die Ursache nennt, und wie Sie den Fehler beheben und künftig verhindern.

## Was bedeutet 502 Bad Gateway?

Eine Anfrage an eine Website durchläuft oft mehrere Stationen:

`Browser → CDN oder Proxy → Webserver → Anwendung`

Jede Station leitet die Anfrage an die nächste weiter. Liefert die Station hinter einem Proxy eine Antwort, die der Proxy nicht verwenden kann, gibt der Proxy 502 zurück. Der Statuscode sagt nicht, welche Station ausgefallen ist. In nginx erscheint 502 auch dann, wenn der Upstream die Verbindung ablehnt, zurücksetzt oder früh schließt. Der Code zeigt also nur, dass die Verbindung hinter dem Proxy unterbrochen ist.

Ein 502 bedeutet dabei weder, dass der Besucher eine fehlerhafte Anfrage gesendet hat, noch ist er ein Timeout. Ein langsamer Upstream liefert einen anderen Code, der im nächsten Abschnitt behandelt wird.

## 502 vs. 503 vs. 504

Drei Codes decken die meisten serverseitigen Fehler zwischen den Stationen ab. Sie haben unterschiedliche Ursachen, deshalb sollten Sie den Code lesen, bevor Sie mit der Fehlersuche beginnen.

| Code | Was passiert ist | Typische Ursache | Was Sie zuerst prüfen |
|---|---|---|---|
| 502 Bad Gateway (HTTP 502) | Das Gateway hat vom Upstream-Server eine ungültige Antwort erhalten <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> <a class="seo-article-citation" href="#source-2" aria-label="Source 2">[2]</a> | Die Anwendung ist ausgefallen oder hat die Verbindung abgelehnt, ist mitten in einer Anfrage abgestürzt oder sendet Header, die nginx nicht annehmen kann | Die Zeile im nginx-Fehlerprotokoll zur betroffenen Anfrage |
| 503 Service Unavailable | Der Server kann die Anfrage vorübergehend nicht bearbeiten <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> | Überlastung oder geplante Wartung | Die Auslastung des Servers und ob gerade Arbeiten laufen |
| 504 Gateway Timeout | Das Gateway hat vom Upstream-Server nicht rechtzeitig eine Antwort erhalten <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> <a class="seo-article-citation" href="#source-3" aria-label="Source 3">[3]</a> | Der Upstream antwortet zu langsam, etwa wegen einer lang laufenden Datenbankabfrage, und das Proxy-Timeout ist abgelaufen <a class="seo-article-citation" href="#source-4" aria-label="Source 4">[4]</a> | Welche Anfrage langsam ist und was die Anwendung währenddessen macht |

Ein 504 ist ein Zeitproblem. Der Upstream hat zu spät geantwortet, nicht falsch. In nginx betragen die Standard-Lesetimeouts für Proxy und FastCGI 60 Sekunden <a class="seo-article-citation" href="#source-4" aria-label="Source 4">[4]</a> <a class="seo-article-citation" href="#source-5" aria-label="Source 5">[5]</a>.

:::warn[Ein höheres Timeout behebt keinen 502-Fehler]
Timeouts wie `proxy_read_timeout` und `fastcgi_read_timeout` steuern nur, wie lange nginx auf eine Antwort wartet. Ein 502 bedeutet, dass die Antwort fehlerhaft oder unvollständig war oder nie ankam. Ein höheres Timeout ändert daran nichts. Verwenden Sie Timeouts nur, wenn der Fehler ein 504 ist.
:::

## Wenn Sie als Besucher einen 502-Fehler sehen

Den Server können Sie als Besucher nicht reparieren, aber Sie können Ihre eigene Verbindung ausschließen und den Fehler melden.

- Warten Sie eine Minute und laden Sie die Seite neu. Ein Neustart oder eine Bereitstellung auf dem Server kann den Fehler von selbst beenden.
- Probieren Sie einen anderen Browser oder ein anderes Netzwerk, etwa mobile Daten. Lädt die Seite dort, liegt das Problem in Ihrer Verbindung.
- Prüfen Sie die Statusseite der Website, falls es eine gibt.
- Notieren Sie die Uhrzeit und die genaue Adresse, die Sie geöffnet haben. Der Betreiber braucht beides, um die passende Zeile im Protokoll zu finden.

Meist liegt die Ursache auf dem Server, deshalb kann nur der Betreiber den Fehler beheben. Wenn Ihnen die Website gehört, folgen Sie den Schritten unten.

## 502 Bad Gateway auf Ihrem Server beheben

Arbeiten Sie von außen nach innen. Jeder Schritt schließt eine Station aus, bevor Sie zur nächsten übergehen.

### 1. Herausfinden, welcher Server den 502-Fehler zurückgibt

Rufen Sie die Seite zweimal ab. Der erste Aufruf nutzt den öffentlichen Weg. Der zweite verbindet sich direkt mit der IP-Adresse Ihres Origin-Servers und sendet den Seitennamen im Host-Header. Ersetzen Sie die Beispieladresse durch Ihre eigene.

```bash
curl -I "https://www.example.com/"
curl -I --resolve www.example.com:443:203.0.113.10 "https://www.example.com/"
```

Lesen Sie die Statuszeile und die Header jeder Antwort:

- Ein `cf-ray`-Header und `server: cloudflare` zeigen, dass die Antwort über Cloudflare kam. Sie erscheinen auch dann, wenn der 502 vom Origin stammt, daher verraten sie nicht, welche Seite ausgefallen ist. Die Seite selbst zeigt es (siehe den Abschnitt zu Cloudflare und Citadel weiter unten).
- Ein `server: nginx`-Header bei der direkten Anfrage bedeutet, dass nginx auf Ihrem Origin den 502 erzeugt hat.

Gibt auch die direkte Anfrage 502 zurück, ist der Origin die Quelle, weiter mit Schritt 2. Liefert die direkte Anfrage 200, während die öffentliche Anfrage 502 liefert, liegt der Fehler auf dem Weg vor dem Origin. Lesen Sie dann die Seite selbst im Abschnitt zu Cloudflare und Citadel weiter unten und prüfen Sie Schritt 7.

### 2. Das Fehlerprotokoll lesen

Bekommt nginx keine brauchbare Antwort vom Upstream, schreibt es den Grund in sein Fehlerprotokoll. Dort grenzen Sie ein 502 Bad Gateway bei nginx am schnellsten ein. Lesen Sie die neuesten Zeilen:

```bash
sudo tail -n 50 /var/log/nginx/error.log
```

Ordnen Sie die Meldung der Ursache zu:

| Zeile im Log (enthält) | Übliche Ursache | Was zu tun ist |
|---|---|---|
| `connect() failed (111: Connection refused) while connecting to upstream` | Die Anwendung läuft nicht oder lauscht auf einem anderen Port | Starten Sie die Anwendung oder korrigieren Sie den Port (Schritt 3) |
| `connect() to unix:/run/php/php8.3-fpm.sock failed (2: No such file or directory)` | Falscher Socket-Pfad, oder PHP-FPM ist gestoppt | Prüfen Sie den Socket-Pfad und den Dienst (Schritte 3 und 4) |
| `connect() to unix:/run/php/php8.3-fpm.sock failed (13: Permission denied)` | Besitzer oder Modus des Sockets lassen nginx nicht verbinden | Prüfen Sie `listen.owner`, `listen.group` und `listen.mode` im PHP-FPM-Pool |
| `upstream prematurely closed connection while reading response header from upstream` | Die Anwendung ist während der Anfrage abgestürzt oder beendet worden, oft wegen Speichermangels | Prüfen Sie Arbeitsspeicher und Absturzprotokolle (Schritt 5) |
| `upstream sent too big header while reading response header from upstream` | Die Antwort-Header sind größer als der Puffer von nginx | Erhöhen Sie die Puffergröße (Schritt 6) |
| `no live upstreams while connecting to upstream` | Jeder Server im Upstream-Block ist als ausgefallen markiert | Prüfen Sie die Server im Block und dann die Anwendung dahinter (Schritt 3) |

Die Zeile nennt die Upstream-Adresse oder den Socket. Vergleichen Sie sie mit dem, worauf die Anwendung tatsächlich lauscht.

### 3. Prüfen, ob die Anwendung läuft

Prüfen Sie den Dienst und den Port oder Socket, auf dem er lauscht. Nutzen Sie den Tab, der zu Ihrem Stack passt.

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

Läuft Node unter systemd, verwenden Sie `systemctl status <service>` statt `pm2 status`. Ist der Dienst gestoppt, lesen Sie zuerst seine Protokolle, bevor Sie ihn neu starten, damit der Grund für den Absturz nicht verloren geht. Zum Beispiel `sudo journalctl -u php8.3-fpm -n 100`.

### 4. Prüfen, ob proxy_pass oder fastcgi_pass zur Anwendung passt

Die Adresse in nginx muss mit Port oder Socket aus Schritt 3 übereinstimmen. Eine Abweichung erzeugt die Meldungen „Connection refused“ oder „No such file or directory“ aus Schritt 2.

Für einen Reverse-Proxy zu einer Anwendung auf einem lokalen Port:

```text title="/etc/nginx/sites-available/example.conf"
location / {
    proxy_pass http://127.0.0.1:3000;
}
```

Für PHP-FPM über einen Unix-Socket:

```nginx title="/etc/nginx/sites-available/example.conf"
location ~ \.php$ {
    fastcgi_pass unix:/run/php/php8.3-fpm.sock;
}
```

Testen Sie die Konfiguration und laden Sie sie dann neu. Schlägt der Test fehl, wird nicht neu geladen. nginx behält dann die Konfiguration, die bereits funktioniert.

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Arbeitsspeicher und Abstürze prüfen

Die Zeile `upstream prematurely closed connection` weist auf einen Prozess hin, der mitten in einer Anfrage beendet wurde. Auf einem kleinen VPS ist der übliche Grund der Out-of-Memory-Killer des Kernels. Durchsuchen Sie das Kernel-Protokoll:

```bash
sudo dmesg -T | grep -i -E "out of memory|killed process"
free -h
```

Prüfen Sie bei PHP-FPM das PHP-FPM-Fehlerprotokoll auf die Meldung `server reached pm.max_children setting`. Sie bedeutet, dass alle Kind-Prozesse ausgelastet sind. Jeder Prozess belegt Arbeitsspeicher. Erhöhen Sie `pm.max_children` deshalb erst, wenn Sie geprüft haben, dass der Server genug Speicher für die zusätzlichen Prozesse hat. <a class="seo-article-citation" href="#source-6" aria-label="Source 6">[6]</a>

Ist der Arbeitsspeicher für die Website schlicht zu klein, hilft ein größerer Tarif und kein höheres Timeout. Wie sich Speicherdruck als Verlangsamung zeigt, erklärt [der Beitrag zu typischen VPS-Performance-Engpässen](/de/blog/common-vps-performance-bottlenecks.html).

### 6. Fehler 502 durch zu große Header beheben

Meldet das Protokoll `upstream sent too big header`, sind die Antwort-Header des Upstreams größer als der Puffer von nginx. Erhöhen Sie den Puffer für diesen Location-Block. Die Werte unten sind Beispiele. Bemessen Sie sie am größten Header.

```text title="/etc/nginx/sites-available/example.conf"
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_buffer_size 16k;  # [!code ++]
    proxy_buffers 8 16k;    # [!code ++]
}
```

Für PHP-FPM setzen Sie `fastcgi_buffer_size` und `fastcgi_buffers` ebenso im `fastcgi_pass`-Location-Block. <a class="seo-article-citation" href="#source-5" aria-label="Source 5">[5]</a> Die Standardwerte und die exakte Syntax finden Sie in der Modulreferenz. <a class="seo-article-citation" href="#source-4" aria-label="Source 4">[4]</a> Sie können außerdem die Größe der Header verringern, die die Anwendung sendet, etwa zu große Cookies. Danach testen und laden Sie neu wie in Schritt 4.

### 7. Die Firewall zwischen Proxy und Origin prüfen

Liegt ein Proxy auf einem anderen Host oder verbindet sich ein Dienst wie Cloudflare oder Citadel mit Ihrem Origin, kann eine Firewall-Regel diese Verbindung blockieren. Der Proxy erhält dann keine brauchbare Antwort und gibt 502 zurück. Prüfen Sie, dass der Origin Verbindungen von den Adressen des Proxys auf dem verwendeten Port annimmt. Unter Ubuntu mit ufw:

```bash
sudo ufw status verbose
```

Verwenden Sie eine andere Firewall, prüfen Sie stattdessen deren Regeln.

## 502 hinter Cloudflare oder Citadel

Der Inhalt der Fehlerseite zeigt, welche Seite den Fehler erzeugt hat. Cloudflare gibt an, dass eine 502- oder 504-Seite mit Cloudflare-Branding vom Origin-Webserver stammt. Eine einfache Seite ohne Cloudflare-Branding kann von Cloudflare stammen. Cloudflare nennt aber auch eine fehlerhafte Komprimierung am Origin als Ursache für 502-Fehler ohne Branding. <a class="seo-article-citation" href="#source-7" aria-label="Source 7">[7]</a> Das Branding klärt also die meisten Fälle, aber nicht alle. Ist die Seite ohne Branding und antwortet der Origin direkt mit 200, prüfen Sie die Komprimierungseinstellungen des Origins.

Citadel ist das eigenständige Layer-7-Schutzprodukt von StealthRDP für HTTP/HTTPS. Es benötigt keinen StealthRDP-VPS und sitzt wie ein Proxy vor Ihrem Origin. Ein 502 für Besucher kann daher bedeuten, dass Citadel den Origin nicht erreicht. Prüfen Sie die Origin-Probes auf der Seite [„Health“ von Citadel](/de/citadel/docs/health) und die Origin-Einstellungen auf der Seite [„Origin“ von Citadel](/de/citadel/docs/origin).

## Schadet ein 502-Fehler der SEO?

Ein kurzer 502-Fehler richtet wenig Schaden an. Die Crawler-Dokumentation von Google besagt, dass 5xx- und 429-Antworten die Crawler verlangsamen. URLs, die dauerhaft Serverfehler liefern, werden irgendwann aus dem Index entfernt, obwohl bereits indexierte URLs zunächst erhalten bleiben. Das Crawling beschleunigt sich wieder, sobald der Server 2xx-Antworten liefert. <a class="seo-article-citation" href="#source-8" aria-label="Source 8">[8]</a>

Praktisch heißt das: Beheben Sie die Ursache schnell. Ein Fehler, der lange anhält, kann Rankings kosten.

## 502-Fehlern vorbeugen

- **Überwachen Sie die Website von außen.** Eine externe Prüfung meldet den Beginn des Fehlers, statt dass ihn ein Besucher später meldet. Siehe [Tools zur Uptime-Überwachung](/de/blog/7-best-tools-for-server-uptime-monitoring-2025.html).
- **Halten Sie genug Arbeitsspeicher bereit.** Out-of-Memory-Abbrüche verursachen die Zeilen „prematurely closed connection“. Geht der Speicher regelmäßig aus, lesen Sie [Anzeichen, dass Sie die Ressourcen Ihres VPS aufrüsten sollten](/de/blog/8-signs-you-need-to-upgrade-your-vps-resources.html) und [häufige VPS-Hosting-Probleme und ihre Lösungen](/de/blog/common-vps-hosting-issues-and-their-solutions.html).
- **Starten Sie die Anwendung bei einem Fehler neu.** Eine systemd-Unit mit Neustart-Richtlinie bringt die Anwendung nach einem Absturz zurück. `Restart=on-failure` startet den Prozess nur neu, wenn er mit einem Fehler beendet wurde. Der Fehler, der den Absturz verursacht hat, wird dadurch nicht behoben. Bewahren Sie deshalb die Protokollzeilen aus Schritt 2 auf.

```ini title="/etc/systemd/system/myapp.service"
[Service]
ExecStart=/usr/bin/node /srv/myapp/server.js
Restart=on-failure
RestartSec=5
```

- **Richten Sie eine Health-Prüfung ein.** Geben Sie der Anwendung einen Endpunkt, der nur dann 200 zurückgibt, wenn sie Anfragen beantworten kann, und überwachen Sie diesen Endpunkt. Ein Prozess, der läuft, aber hängt, fällt dann als Fehler auf.
- **Klären Sie vorab, wo Sie suchen, wenn der Server stehen bleibt.** Wenn der Server von allein nicht mehr antwortet, lesen Sie [warum ein Server zufällig stoppt](/de/docs/server-stops-randomly).

:::tip[Planen Sie für den nächsten Ausfall]
Notieren Sie vor einem Vorfall den Port oder Socket der Anwendung, den Pfad des Logs und den Neustart-Befehl. Die Behebung in Schritt 2 hängt von der genauen Protokollzeile ab, und die schnellste Wiederherstellung gelingt, wenn Sie den Dienstnamen kennen.
:::

## Die Behebung selbst auf einem StealthRDP-VPS durchführen

Linux-Tarife von StealthRDP enthalten vollen Root-Zugriff. Sie betreiben den Webserver und die Anwendung selbst und können jeden Schritt dieses Ratgebers auf Ihrem Server ausführen. Tarife vergleichen Sie auf [Linux-VPS](/de/linux-vps) und [VPS-Tarife](/de/plans).

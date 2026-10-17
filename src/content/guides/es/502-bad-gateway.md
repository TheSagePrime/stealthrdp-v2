---
order: 18
title: 'Error 502 Bad Gateway: qué significa y cómo arreglarlo'
sidebarTitle: 502 Bad Gateway
excerpt: "502 Bad Gateway significa que un servidor recibió una respuesta no válida de su upstream. Qué hacer como visitante y cómo arreglarlo en nginx."
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
locale: es
publishAt: 2026-10-10
primaryKeyword: 502 bad gateway
---
502 Bad Gateway significa que un servidor que actúa como gateway o proxy recibió una respuesta no válida del servidor que tiene detrás. El error se produce entre dos servidores, así que no viene del navegador ni del dispositivo del visitante. <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> <a class="seo-article-citation" href="#source-2" aria-label="Source 2">[2]</a>

Esta guía tiene dos partes. Si eres visitante, la sección corta de abajo indica qué puedes probar. Si gestionas la web, la sección de solución te ayuda a encontrar qué salto devolvió el 502, a leer la línea del log que indica la causa y a aplicar la solución y evitar que vuelva a pasar.

## ¿Qué significa 502 Bad Gateway?

Una petición a un sitio web suele pasar por varios saltos:

`navegador → CDN o proxy → servidor web → aplicación`

Cada salto reenvía la petición al siguiente. Si el salto que hay detrás de un proxy devuelve una respuesta que el proxy no puede usar, el proxy responde con 502. El código no dice qué salto ha fallado. En nginx, el 502 también aparece cuando el upstream rechaza la conexión, la reinicia o la cierra antes de tiempo, así que el código solo indica que el enlace que hay detrás del proxy se ha roto.

Hay dos cosas que un 502 no es. No es un aviso de que el visitante ha enviado una petición incorrecta. Tampoco es un timeout. Un upstream lento devuelve otro código, que se explica en la siguiente sección.

## 502 vs 503 vs 504

Tres códigos cubren la mayoría de fallos del lado del servidor entre saltos. Apuntan a causas distintas, así que lee el código antes de empezar a investigar.

| Código | Qué ha pasado | Causa habitual | Lo primero que hay que revisar |
|---|---|---|---|
| 502 Bad Gateway | La pasarela ha recibido una respuesta no válida del servidor upstream <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> <a class="seo-article-citation" href="#source-2" aria-label="Source 2">[2]</a> | La aplicación está caída o ha rechazado la conexión, se ha caído a mitad de una petición o ha enviado cabeceras que nginx no puede aceptar | La línea del log de error de nginx correspondiente a la petición |
| 503 Service Unavailable | El servidor no puede atender la petición de forma temporal <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> | Sobrecarga o mantenimiento programado | La carga del servidor y si hay tareas en curso |
| 504 Gateway Timeout | La pasarela no recibió a tiempo una respuesta del servidor upstream <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a> <a class="seo-article-citation" href="#source-3" aria-label="Source 3">[3]</a> | El upstream es demasiado lento, por ejemplo una consulta larga a la base de datos, y expira el timeout del proxy <a class="seo-article-citation" href="#source-4" aria-label="Source 4">[4]</a> | Qué petición es lenta y qué hace la aplicación mientras espera |

Un 504 es un fallo de tiempos. El upstream respondió demasiado tarde, no de forma incorrecta. En nginx, los timeouts de lectura por defecto de proxy y FastCGI son de 60 segundos <a class="seo-article-citation" href="#source-4" aria-label="Source 4">[4]</a> <a class="seo-article-citation" href="#source-5" aria-label="Source 5">[5]</a>.

:::warn[Subir el timeout no arregla un 502]
Los timeouts como `proxy_read_timeout` y `fastcgi_read_timeout` solo controlan cuánto tiempo espera nginx a una respuesta. Un 502 significa que la respuesta estaba rota, faltaba o nunca llegó. Aumentar el timeout no cambia eso. Usa los timeouts solo cuando el error sea un 504.
:::

## Si ves un 502 como visitante

No puedes arreglar el servidor, pero sí descartar que el problema esté en tu lado y avisar.

- Espera un minuto y recarga la página. Un reinicio o un despliegue en el servidor puede hacer que el error desaparezca solo.
- Prueba otro navegador o otra red, como los datos móviles. Si el sitio carga ahí, el problema es local a tu conexión.
- Consulta la página de estado del sitio, si tiene una.
- Anota la hora y la dirección exacta que abriste. El administrador del sitio las necesita para encontrar la línea del log correspondiente.

Lo habitual es que la solución esté en el servidor, así que solo el administrador del sitio puede hacer que el error desaparezca. Si el sitio es tuyo, sigue los pasos de abajo.

## Cómo solucionar un 502 Bad Gateway en tu servidor

Trabaja de fuera hacia dentro. Cada paso descarta un salto antes de pasar al siguiente.

### 1. Averigua qué servidor ha devuelto el 502

Pide la página dos veces. La primera petición usa la ruta pública. La segunda se conecta directamente a la IP de tu servidor de origen y envía el nombre del sitio en la cabecera Host. Sustituye la dirección de ejemplo por la tuya.

```bash
curl -I "https://www.example.com/"
curl -I --resolve www.example.com:443:203.0.113.10 "https://www.example.com/"
```

Lee la línea de estado y las cabeceras de cada respuesta:

- Una cabecera `cf-ray` y `server: cloudflare` indican que la respuesta ha pasado por Cloudflare. Aparecen incluso cuando el 502 viene de tu origen, así que no dicen qué lado ha fallado; la propia página sí lo indica (ver la sección de Cloudflare y Citadel más abajo).
- Una cabecera `server: nginx` en la petición directa indica que nginx en tu origen ha generado el 502.

Si la petición directa también devuelve 502, el fallo está en el origen, así que pasa al paso 2. Si la petición directa devuelve 200 mientras la pública devuelve 502, el fallo está en el camino que hay delante del origen. Lee la sección de Cloudflare y Citadel más abajo y revisa el paso 7.

### 2. Lee el log de errores

Cuando nginx no puede obtener una respuesta válida del upstream, escribe el motivo en su log de errores. Lee las líneas más recientes:

```bash
sudo tail -n 50 /var/log/nginx/error.log
```

Relaciona el mensaje con la causa:

| Línea del log (contiene) | Causa habitual | Qué hacer |
|---|---|---|
| `connect() failed (111: Connection refused) while connecting to upstream` | La aplicación no está en marcha, o escucha en otro puerto | Arranca la aplicación o corrige el puerto (paso 3) |
| `connect() to unix:/run/php/php8.3-fpm.sock failed (2: No such file or directory)` | Ruta del socket incorrecta, o PHP-FPM está parado | Revisa la ruta del socket y el servicio (pasos 3 y 4) |
| `connect() to unix:/run/php/php8.3-fpm.sock failed (13: Permission denied)` | El propietario o los permisos del socket no permiten a nginx conectarse | Revisa `listen.owner`, `listen.group` y `listen.mode` en el pool de PHP-FPM |
| `upstream prematurely closed connection while reading response header from upstream` | La aplicación se ha caído o la han matado durante la petición, a menudo porque se ha quedado sin memoria | Revisa la memoria y los registros de caídas (paso 5) |
| `upstream sent too big header while reading response header from upstream` | Las cabeceras de la respuesta son más grandes que el buffer de nginx | Aumenta el tamaño del buffer (paso 6) |
| `no live upstreams while connecting to upstream` | Todos los servidores del bloque upstream están marcados como fallidos | Revisa los servidores del bloque y luego la aplicación de cada uno (paso 3) |

La línea indica la dirección o el socket del upstream. Compárala con lo que la aplicación escucha de verdad.

### 3. Comprueba que la aplicación está en marcha

Comprueba el servicio y el puerto o socket en el que escucha. Usa la pestaña que corresponda a tu stack.

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

Si ejecutas Node con systemd, usa `systemctl status <service>` en lugar de `pm2 status`. Si el servicio está parado, lee sus logs antes de reiniciarlo, para no perder el motivo de la caída. Por ejemplo, `sudo journalctl -u php8.3-fpm -n 100`.

### 4. Comprueba que proxy_pass o fastcgi_pass coincide con la aplicación

La dirección de nginx debe coincidir con el puerto o socket del paso 3. Una discrepancia produce las líneas "Connection refused" o "No such file or directory" del paso 2.

Para un reverse proxy hacia una aplicación en un puerto local:

```text title="/etc/nginx/sites-available/example.conf"
location / {
    proxy_pass http://127.0.0.1:3000;
}
```

Para PHP-FPM sobre un socket Unix:

```nginx title="/etc/nginx/sites-available/example.conf"
location ~ \.php$ {
    fastcgi_pass unix:/run/php/php8.3-fpm.sock;
}
```

Comprueba la configuración y recarga. Si la comprobación falla, la recarga no se ejecuta, así que nginx mantiene la configuración que ya funciona.

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Revisa la memoria y las caídas

La línea `upstream prematurely closed connection` apunta a un proceso que murió a mitad de la petición. En un VPS pequeño, la causa habitual es el OOM killer del kernel (out-of-memory killer). Busca en el log del kernel:

```bash
sudo dmesg -T | grep -i -E "out of memory|killed process"
free -h
```

En PHP-FPM, busca en su log de errores el mensaje `server reached pm.max_children setting`. Este mensaje indica que todos los procesos hijos están ocupados. Cada worker usa RAM, así que aumenta `pm.max_children` solo después de comprobar que el servidor tiene memoria libre para los workers adicionales <a class="seo-article-citation" href="#source-6" aria-label="Source 6">[6]</a>.

Si la memoria es simplemente insuficiente para el sitio, la solución es un plan más grande, no un timeout más alto. Consulta [cuellos de botella de rendimiento en un VPS](/es/blog/common-vps-performance-bottlenecks.html) para ver cómo la presión de memoria se traduce en lentitud.

### 6. Soluciona los 502 por tamaño de cabeceras

Si el log dice `upstream sent too big header`, las cabeceras de la respuesta del upstream son más grandes que el buffer de nginx. Aumenta el buffer en esa location. Los valores de abajo son ejemplos; ajústalos a la cabecera más grande que tengas.

```text title="/etc/nginx/sites-available/example.conf"
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_buffer_size 16k;  # [!code ++]
    proxy_buffers 8 16k;    # [!code ++]
}
```

Para PHP-FPM, usa `fastcgi_buffer_size` y `fastcgi_buffers` de la misma forma en la location con `fastcgi_pass` <a class="seo-article-citation" href="#source-5" aria-label="Source 5">[5]</a>. Revisa los valores por defecto y la sintaxis exacta en la referencia del módulo <a class="seo-article-citation" href="#source-4" aria-label="Source 4">[4]</a>. También puedes reducir el tamaño de las cabeceras que envía la aplicación, por ejemplo cookies demasiado grandes. Después, comprueba y recarga como en el paso 4.

### 7. Revisa el firewall entre el proxy y el origen

Si un proxy está en otro host, o un servicio como Cloudflare o Citadel se conecta a tu origen, una regla del firewall puede bloquear esa conexión. El proxy entonces no recibe una respuesta válida y devuelve 502. Comprueba que el origen acepta conexiones desde las direcciones del proxy en el puerto que usa. En Ubuntu con ufw:

```bash
sudo ufw status verbose
```

Si usas otro firewall, revisa sus reglas.

## 502 detrás de Cloudflare o Citadel

El cuerpo de la página indica qué lado ha generado el error. Cloudflare dice que una página 502 o 504 con la marca de Cloudflare procede de tu servidor web de origen. Una página sin la marca de Cloudflare puede venir de Cloudflare, pero Cloudflare también indica que un problema de compresión en el origen es una causa de los 502 sin marca <a class="seo-article-citation" href="#source-7" aria-label="Source 7">[7]</a>. Así que la marca resuelve la mayoría de casos, pero no todos. Si la página no tiene marca y el origen responde directamente con 200, revisa la configuración de compresión del origen.

Citadel es el producto de protección HTTP/HTTPS de capa 7 de StealthRDP. No necesita un VPS de StealthRDP y se sitúa delante de tu origen como un proxy. Un 502 que ve el visitante puede significar, por tanto, que Citadel no puede llegar al origen. Revisa las comprobaciones del origen en la [página Health de Citadel](/es/citadel/docs/health) y la configuración del origen en la [página Origin de Citadel](/es/citadel/docs/origin).

## ¿Un 502 perjudica al SEO?

Un 502 breve apenas hace daño. La documentación de los rastreadores de Google indica que las respuestas 5xx y 429 hacen que sus rastreadores reduzcan la velocidad. Las URL que siguen devolviendo errores del servidor acaban eliminándose del índice, aunque al principio las URL ya indexadas se conservan. El rastreo vuelve a acelerarse cuando el servidor responde de nuevo con 2xx <a class="seo-article-citation" href="#source-8" aria-label="Source 8">[8]</a>.

Lo práctico: corrige la causa cuanto antes. Un error que se mantiene mucho tiempo puede costar posiciones en los resultados.

## Cómo prevenir los errores 502

- **Monitoriza el sitio desde fuera.** Una comprobación externa te avisa cuando empieza el 502, en lugar de que te lo comunique un visitante más tarde. Consulta [herramientas de monitorización de uptime](/es/blog/7-best-tools-for-server-uptime-monitoring-2025.html).
- **Ten suficiente RAM.** Los cierres por falta de memoria causan las líneas "prematurely closed connection". Si el servidor se queda sin memoria con regularidad, lee [señales de que necesitas ampliar los recursos de tu VPS](/es/blog/8-signs-you-need-to-upgrade-your-vps-resources.html) y [problemas habituales de hosting VPS y sus soluciones](/es/blog/common-vps-hosting-issues-and-their-solutions.html).
- **Reinicia la aplicación cuando falle.** Una unidad systemd con una política de reinicio vuelve a levantar la aplicación tras una caída. `Restart=on-failure` reinicia el proceso solo cuando sale con un error. No arregla el fallo que provocó la caída, así que guarda las líneas del log del paso 2.

```ini title="/etc/systemd/system/myapp.service"
[Service]
ExecStart=/usr/bin/node /srv/myapp/server.js
Restart=on-failure
RestartSec=5
```

- **Añade un health check.** Dale a la aplicación un endpoint que devuelva 200 solo cuando pueda atender peticiones, y monitoriza ese endpoint. Un proceso que sigue en marcha pero bloqueado aparecerá entonces como fallo.
- **Ten claro dónde mirar cuando el servidor se detiene.** Si el servidor deja de responder por sí solo, lee [por qué un servidor se detiene de forma aleatoria](/es/docs/server-stops-randomly).

:::tip[Prepárate para el siguiente fallo]
Antes de un incidente, anota el puerto o socket que escucha la aplicación, la ruta del log y el comando de reinicio. El paso 2 depende de la línea exacta del log, y la recuperación más rápida depende de conocer el nombre del servicio.
:::

## Cómo aplicar la solución tú mismo en un VPS de StealthRDP

Los planes Linux de StealthRDP incluyen acceso Root completo, así que tú instalas el servidor web y la aplicación, y puedes llevar a cabo todos los pasos de esta guía en tu propio servidor. Para comparar planes, consulta [VPS Linux](/es/linux-vps) y [planes de VPS](/es/plans).

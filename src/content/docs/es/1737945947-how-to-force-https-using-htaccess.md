---
order: 13
title: Redirigir HTTP a HTTPS con .htaccess
sidebarTitle: Forzar HTTPS
category: Web panels
date: Jan 27, 2025
sourceTitle: How to Force HTTPS using .htaccess
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737945947-how-to-force-https-using-htaccess
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Redirige HTTP a HTTPS con .htaccess en Apache: redirección 301 para todo el sitio, un dominio o carpetas concretas, la versión para Nginx y cómo probarla."
relatedSlugs: []
translationOf: 1737945947-how-to-force-https-using-htaccess
locale: es
publishAt: 2026-10-16
primaryKeyword: redirigir http a https htaccess
---
Después de instalar un certificado SSL/TLS, tu sitio responde tanto en `http://` como en `https://`. Forzar HTTPS hace que cada visitante y cada motor de búsqueda use la versión cifrada. En Apache, puedes redirigir HTTP a HTTPS con reglas de reescritura en el archivo `.htaccess`. Para entender por qué importa, consulta [por qué deberías redirigir todo el tráfico HTTP a HTTPS](/es/docs/why-you-should-redirect-all-http-traffic-to-https).

## Antes de empezar

- Tienes instalado un certificado SSL/TLS válido y `https://yourdomain.com` carga sin advertencias del navegador.
- Apache tiene `mod_rewrite` habilitado. En Debian o Ubuntu, ejecuta `sudo a2enmod rewrite` y reinicia Apache.
- La directiva `AllowOverride` del sitio permite reglas de `.htaccess`.

## Redirigir todo el tráfico de HTTP a HTTPS

Abre `.htaccess` en la raíz de tu sitio (por ejemplo `public_html`). Si no existe, créalo. Añade estas líneas cerca del principio:

```apache title=".htaccess"
# [!code ++]
RewriteEngine On
# [!code ++]
RewriteCond %{HTTPS} off
# [!code ++]
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

`R=301` hace que la redirección sea permanente, para que los navegadores y los buscadores actualicen la URL a HTTPS.

## Forzar HTTPS en un solo dominio

Si dos dominios sirven el mismo sitio y solo quieres redirigir uno de ellos:

```apache title=".htaccess"
RewriteEngine On
RewriteCond %{HTTP_HOST} ^yourdomain1\.com$ [NC]
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Sustituye `yourdomain1.com` por tu dominio.

## Forzar HTTPS en carpetas concretas

Para redirigir solo algunas carpetas, enuméralas en la regla:

```apache title=".htaccess"
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(folder1|folder2|folder3)(/.*)?$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Sustituye los nombres de carpeta por los tuyos.

## Forzar HTTPS detrás de un proxy o CDN

Si Cloudflare o un balanceador de carga termina el TLS antes de Apache, `%{HTTPS}` siempre está en `off` y la regla anterior entra en bucle. Comprueba la cabecera reenviada en su lugar:

```apache title=".htaccess"
RewriteEngine On
RewriteCond %{HTTP:X-Forwarded-Proto} !https
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

Con Cloudflare, configura también SSL/TLS en **Full** o **Full (strict)**, no en **Flexible**.

## Forzar HTTPS en Nginx

Nginx no lee `.htaccess`. Añade un bloque de servidor independiente para el puerto 80 que redirija todo:

```nginx title="Bloque de servidor de Nginx"
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

Comprueba la configuración con `sudo nginx -t` y, después, recárgala con `sudo systemctl reload nginx`.

## Comprobar la redirección

Ejecuta esto desde cualquier ordenador:

```bash title="Comprobar la redirección"
curl -I http://yourdomain.com/
```

La respuesta debe mostrar `301 Moved Permanently` y una cabecera `Location:` que empiece por `https://`. Antes de probarla en el navegador, borra su caché, porque los navegadores guardan en caché las redirecciones permanentes.

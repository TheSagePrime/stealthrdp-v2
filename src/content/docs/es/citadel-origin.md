---
order: 28
title: "Configurar servidor de origen y hostnames"
sidebarTitle: "Origen y hostnames"
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/origin
summary: "Configura el servidor de origen al que Citadel envía el tráfico limpio: host apex, puerto, TLS hacia el origen y subdominios que lo comparten o lo sustituyen."
relatedSlugs:
  - citadel-health
  - citadel-cloudflare-setup
  - citadel-allowlists
illustration:
  src: /citadel-docs/origin-setup.svg
  alt: Citadel origin host, port, TLS and subdomain settings
  caption: The origin settings determine where Citadel forwards clean traffic.
  width: 960
  height: 260
translationOf: citadel-origin
locale: es
publishAt: 2026-10-18
primaryKeyword: configurar servidor de origen
---
## Configurar el servidor de origen

El servidor de origen es el servidor real al que Citadel envía el tráfico limpio. Define el host apex (el dominio raíz), el puerto y la opción «TLS-to-origin» y, a continuación, añade los subdominios protegidos. Cada subdominio puede compartir el origen principal o sustituirlo por otro.

1. Confirma que la URL del origen principal responde desde un servidor que funciona.
2. Añade cada nombre de host que quieras proteger.
3. Crea para cada nombre de host un registro DNS de Cloudflare con proxy activado que apunte a la IP de entrada de Citadel.
4. Guarda los cambios y usa [Estado del origen](/es/citadel/docs/health) para probar la conexión.

## Redirecciones de API y SSO

Si el origen redirige HTTP a HTTPS, activa «TLS-to-origin» o usa un backend HTTPS. Así evitas que las peticiones POST a `/api/*` se conviertan en redirecciones 301.

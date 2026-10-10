---
order: 30
title: "DNS de Cloudflare en Citadel: registros A"
sidebarTitle: DNS en Cloudflare
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/dns
summary: "Mantén tu DNS de Cloudflare y apunta los registros web protegidos a la IP de entrada de Citadel. Citadel no aloja tu zona DNS."
relatedSlugs:
  - citadel-cloudflare-setup
  - citadel-domain-overview
translationOf: citadel-dns
locale: es
publishAt: 2026-10-18
primaryKeyword: dns cloudflare
---
## DNS de Cloudflare en modo de registro A

Citadel no aloja tu zona DNS. Gestiona el DNS de Cloudflare y apunta los registros web con proxy activado (nube naranja) a la IP de entrada de Citadel.

- No pongas la nube gris (solo DNS) en los nombres de host que quieras que Citadel proteja.
- El dominio raíz y `www` pueden apuntar a la misma IP de entrada.
- El correo, los registros TXT y otros registros que no son web pueden quedarse como están.

Consulta [configuración de Cloudflare](/es/citadel/docs/cloudflare-setup).

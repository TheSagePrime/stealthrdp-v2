---
order: 26
title: "Añadir y gestionar dominios en Citadel"
sidebarTitle: Gestionar dominios
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/domains
summary: "Añade un dominio a Citadel, protección DDoS de capa 7, con raíz, host de origen, puerto y TLS; comprueba su conexión, busca en la lista o quita la protección."
relatedSlugs:
  - citadel-getting-started
  - citadel-cloudflare-setup
  - citadel-domain-overview
illustration:
  src: /citadel-docs/domains-list.svg
  alt: Citadel add-domain form with domain, origin host and port
  caption: Add the root domain with a working origin host and port.
  width: 960
  height: 280
translationOf: citadel-domains
locale: es
publishAt: 2026-10-17
primaryKeyword: añadir dominio protección ddos
---
## Añadir un dominio

1. Introduce el dominio raíz, por ejemplo `example.com`.
2. Introduce el host de origen del apex (dominio raíz), con una dirección IP o un nombre de host operativo.
3. Indica el puerto de origen, normalmente 443, y elige si Citadel debe usar TLS para conectarse con el origen.
4. Selecciona **«Add domain»** y completa la [configuración de Cloudflare](/es/citadel/docs/cloudflare-setup).

Citadel comprueba automáticamente los dominios pendientes aproximadamente cada minuto. **«Check connection»** está disponible para una prueba inmediata. Cuando el dominio raíz esté operativo, añade los subdominios protegidos desde la página «Origin».

## Gestionar dominios existentes

Usa la lista «Domains» para buscar un sitio web o quitar un dominio que ya no proteges.

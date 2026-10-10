---
order: 23
title: "Configurar protección DDoS web con Citadel"
sidebarTitle: Primeros pasos
category: "Citadel: Start here"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/getting-started
summary: "Cómo configurar la protección DDoS web con Citadel: añade el dominio, apunta los DNS de Cloudflare con proxy a la IP de entrada y elige un modo de desafío."
relatedSlugs:
  - citadel-cloudflare-setup
  - citadel-domains
  - citadel-security
  - citadel-allowlists
illustration:
  src: /citadel-docs/flow-cloudflare-citadel.svg
  alt: Cloudflare to Citadel to origin flow
  caption: "Traffic path: visitor → Cloudflare (proxied) → Citadel → origin."
  width: 960
  height: 320
translationOf: citadel-getting-started
locale: es
publishAt: 2026-10-10
primaryKeyword: configurar protección ddos web
---
## Cómo llega el tráfico a tu web

Esta guía te explica cómo configurar la protección DDoS de tu web con Citadel. Los visitantes llegan a Cloudflare a través de un registro DNS con proxy (nube naranja). Cloudflare reenvía el tráfico web a Citadel, que revisa las peticiones antes de que el tráfico limpio llegue a tu servidor de origen.

## Primera configuración de la protección DDoS web

1. En Citadel, añade tu dominio raíz con la IP o el nombre de host del origen, el puerto y el ajuste de TLS hacia el origen.
2. Copia la IP de entrada de Citadel desde la página del dominio.
3. En el DNS de Cloudflare, crea un registro A con proxy (nube naranja) para el dominio raíz y para cada nombre de host protegido, y apúntalo a esa IP.
4. Pon SSL/TLS de Cloudflare en «Completo» (Full), o en «Completo (estricto)» (Full (strict)) si el origen tiene un certificado de confianza.
5. Espera aproximadamente un minuto a que Citadel detecte la conexión, o selecciona «Check connection».
6. Abre «Security» y empieza con el modo de desafío «Auto (Balanced)».
7. Antes de usar desafíos que requieren interacción humana, añade a la lista de permitidos las rutas para máquinas, como `/api/` y los webhooks.

## Comprobar la protección

El dominio debería mostrar «Active / Proxied». Un registro DNS con nube gris (solo DNS) omite Citadel y no ofrece protección de capa 7.

Consulta [configuración de Cloudflare](/es/citadel/docs/cloudflare-setup) y [niveles de seguridad](/es/citadel/docs/challenge-levels).

---
order: 25
title: Configurar Cloudflare para Citadel
sidebarTitle: Configurar Cloudflare
category: "Citadel: Start here"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/cloudflare-setup
summary: "Cómo configurar Cloudflare para Citadel: registros A con proxy hacia la IP de entrada, SSL/TLS en Full y dominios que esperan DNS."
relatedSlugs:
  - citadel-domain-overview
  - citadel-origin
  - citadel-dns
illustration:
  src: /citadel-docs/flow-cloudflare-citadel.svg
  alt: Proxied Cloudflare DNS sends traffic to Citadel before the origin
  caption: Proxied A records point to Citadel. Grey-cloud records bypass protection.
  width: 960
  height: 320
translationOf: citadel-cloudflare-setup
locale: es
publishAt: 2026-10-10
primaryKeyword: configurar cloudflare para citadel
---
## Configurar Cloudflare para Citadel: DNS y SSL

Sigue estos pasos para configurar Cloudflare para Citadel. Así, el tráfico de tu dominio pasa primero por Citadel.

1. Abre tu dominio en Citadel y copia su IP de entrada desde la etiqueta del registro A.
2. En el panel DNS de Cloudflare, apunta el dominio raíz (`@`) y cada nombre de host que quieras proteger a esa IP.
3. Activa **Proxied** (nube naranja) en cada registro protegido.
4. En **SSL/TLS** > **Overview** de Cloudflare, selecciona **Full** o **Full (strict)** si el certificado de origen es de confianza.
5. Vuelve a Citadel. Citadel revisa los dominios pendientes aproximadamente cada minuto; «**Check connection**» actualiza la comprobación de inmediato.

## Solucionar problemas de activación

Un registro con nube gris, una IP de entrada incorrecta o SSL en modo Flexible pueden dejar un dominio esperando DNS o provocar errores en el navegador. Los registros solo DNS no pasan por Citadel. El correo, los registros TXT y otros registros no web se quedan en Cloudflare.

## Protección DDoS de Cloudflare y Citadel

Si los registros tienen proxy, el tráfico pasa primero por Cloudflare y su propia protección DDoS sigue aplicándose. Después, Citadel inspecciona las solicitudes HTTP que le llegan, con niveles de desafío, límites de frecuencia y logs por dominio, y reenvía el tráfico limpio a tu origen.

Consulta [El DNS se queda en Cloudflare](/es/citadel/docs/dns) y [Origen y nombres de host](/es/citadel/docs/origin).

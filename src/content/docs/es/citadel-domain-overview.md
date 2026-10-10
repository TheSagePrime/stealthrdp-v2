---
order: 27
title: Estado del dominio en Citadel
sidebarTitle: Estado del dominio
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/domain-overview
summary: "Consulta el estado del dominio en Citadel: la IP de entrada, cuándo pasa de «awaiting DNS» a «Active» y qué revisar después, como «Origin» o «Health»."
relatedSlugs:
  - citadel-cloudflare-setup
  - citadel-origin
  - citadel-security
translationOf: citadel-domain-overview
locale: es
publishAt: 2026-10-24
primaryKeyword: estado del dominio citadel
---
## Estado de la conexión

El estado del dominio en Citadel indica si el tráfico ya pasa por Citadel. Un dominio empieza con el estado «awaiting DNS». Copia la IP de entrada de Citadel en un registro A de Cloudflare con el proxy activado. Citadel comprueba la conexión automáticamente aproximadamente cada minuto, o puedes pulsar «Check connection».

Cuando un nombre de host protegido pasa por Citadel, el estado cambia a «Active». Un subdominio con proxy puede cumplir esta comprobación aunque el dominio raíz (apex) no tenga proxy.

## Próximos pasos

La vista general del dominio enlaza con «Origin», «Health», «Security», «Cache» e «Insights». Usa «Origin» para verificar el backend y «Health» para saber si el servidor responde.

---
order: 37
title: "Buscar logs de Citadel por dominio"
sidebarTitle: "Buscar logs de dominio"
category: "Citadel: Traffic"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/logs
summary: "Busca en los logs de Citadel de 15 días (acceso, seguridad y errores de origen) por IP, ruta, host o ID de solicitud, con filtros, orden y datos de ASN y país."
relatedSlugs:
  - citadel-insights
  - citadel-security
  - citadel-analytics
translationOf: citadel-logs
locale: es
publishAt: 2026-10-18
primaryKeyword: buscar logs citadel
---
## Tipos de logs y retención

- Las entradas de acceso incluyen el método, la ruta, el estado, la IP del visitante, el ASN, el país, el User-Agent, la latencia, los bytes y el ID de la solicitud.
- Las entradas de seguridad muestran desafíos, bloqueos, límites de frecuencia y omisiones (bypass) de la lista de permitidos.
- Las entradas de error muestran origen no disponible, tiempos de espera agotados y errores de gateway 502, 503 o 504.

Los logs de Citadel se conservan 15 días en almacenamiento compatible con S3. En esta vista no se almacenan los cuerpos completos de las solicitudes ni de las respuestas, y los valores sensibles de las consultas se ocultan antes de guardarse.

## Buscar una solicitud en los logs de Citadel

Abre la página «Logs» de un dominio. Cada página muestra hasta 200 filas; usa «Previous» y «Next» para ver más. Filtra por tipo, método o estado, busca por IP del visitante, ruta de URL, host o ID de solicitud, y elige si se muestran primero las más antiguas o las más recientes. Expande «Show details» para ver los datos estructurados sobre la decisión y el visitante. Las filas antiguas con detalles vacíos se completan con sus campos visibles.

## Detalles de geolocalización e IP

Para el ASN se usa `CF-ASN` o `CF-IPASNUM` si están presentes; si no, Citadel resuelve la IP del visitante mediante DNS de Team Cymru. Para el país se usa primero el país de operación habitual de un ASN conocido (por ejemplo, AS135407 Transworld → Pakistán) y, después, `CF-IPCountry`. El código de país de Team Cymru es el último recurso, porque puede describir el país de registro en lugar de la ubicación del visitante. Las IP de visitantes nuevas se indexan conforme llega el tráfico, y al abrir páginas antiguas se completan esas filas para las búsquedas posteriores por IP.

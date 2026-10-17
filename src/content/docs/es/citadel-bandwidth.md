---
order: 39
title: "Ancho de banda y límites de velocidad"
sidebarTitle: Ancho de banda y límites de velocidad
category: "Citadel: Traffic"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/bandwidth
summary: "Revisa el ancho de banda de Citadel: la cuota de tráfico limpio, la transferencia en tiempo real y los límites de salida por dominio."
relatedSlugs:
  - citadel-cache
  - citadel-overview
illustration:
  src: /citadel-docs/bandwidth-limits.svg
  alt: Citadel speed-limit rule for zip files
  caption: Illustrative 5 MB/s per-connection limit for matching downloads.
  width: 960
  height: 220
translationOf: citadel-bandwidth
locale: es
publishAt: 2026-10-24
primaryKeyword: ancho de banda
---
## Entender el uso del ancho de banda

El ancho de banda se mide con el tráfico limpio enviado hacia el origen y se compara con la cuota de tu plan. Los gráficos en tiempo real muestran la salida y la entrada en MB/s.

## Configurar un límite de velocidad

1. Selecciona el dominio en el selector de ámbito (scope).
2. Añade o edita una regla para una extensión de archivo, una ruta, un subdominio o un dominio.
3. Introduce el valor en MB/s y, si procede, el modo por conexión.
4. Selecciona «Save speed limits».

:::info
Solo se admite una regla por tipo. Edita la regla existente en lugar de añadir duplicados; para quitar una regla, elimínala y vuelve a guardar.
:::

Por ejemplo, limita las descargas de `.zip` a 5 MB/s por conexión.

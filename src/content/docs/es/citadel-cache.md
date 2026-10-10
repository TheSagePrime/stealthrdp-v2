---
order: 35
title: "Configurar y purgar la caché de Citadel"
sidebarTitle: Caché y purga
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/cache
summary: "Activa la caché de Citadel para CSS, JavaScript, imágenes y fuentes, excluye rutas dinámicas como /api/ y purga la caché tras cada despliegue."
relatedSlugs:
  - citadel-bandwidth
  - citadel-security
translationOf: citadel-cache
locale: es
publishAt: 2026-10-17
primaryKeyword: purgar caché citadel
---
## Configurar la caché

1. Abre la página «Cache» del dominio y activa la caché.
2. Selecciona las extensiones de archivo que quieras incluir, como CSS, JavaScript, imágenes o fuentes.
3. Añade los prefijos de ruta que no deben cachearse, como `/api/` y `/admin/`.
4. Guarda la configuración de la caché.

La caché reduce el trabajo repetido del servidor de origen con las respuestas estáticas que cumplen los criterios. Para purgar la caché de Citadel tras un despliegue que cambie los archivos estáticos, usa «Purge all» o «Purge path», según convenga.

:::info
Los límites de velocidad de envío hacia los visitantes se configuran en [Bandwidth](/es/citadel/docs/bandwidth), no en «Cache».
:::

---
order: 33
title: "Páginas de error personalizadas en Citadel"
sidebarTitle: Personalizar páginas de desafío
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/branding
summary: "Crea páginas de error personalizadas en Citadel con tu propio HTML. Citadel sigue aportando los controles de mitigación."
relatedSlugs:
  - citadel-security
  - citadel-challenge-levels
  - citadel-allowlists
translationOf: citadel-branding
locale: es
publishAt: 2026-10-24
primaryKeyword: páginas de error personalizadas
---
## Páginas de error personalizadas

Citadel admite páginas de error personalizadas en forma de shells HTML visuales para la página de desafío JS, «Interaction», «Lockdown», el 403 de bloqueo, el 429 por límite de peticiones y los errores del origen o de la pasarela 502, 503 y 504. El desafío de cookie establece en silencio una cookie de paso y redirige, así que no tiene página personalizada. Un error 500 normal de una aplicación con un origen en funcionamiento se muestra tal como lo devuelve la aplicación.

## Guardar un shell

1. Abre la página «Branding» del dominio y selecciona un tipo de página.
2. Pega el HTML o inserta el shell de ejemplo. Los marcadores opcionales son `{{BRAND}}` y `{{MESSAGE}}`.
3. Selecciona **«Save custom shell»**. El estado cambia a «Custom».
4. Usa **«Restore this default»** o **«Restore all defaults»** para volver a las páginas predeterminadas de Citadel.

Citadel inserta sus controles reales de prueba de trabajo (proof-of-work), el botón de verificación humana y los controles de estado justo antes de `</body>`.

:::warn
No añadas tu propio formulario de verificación ni envíes resultados de proof-of-work fuera de `/__l7/`.
:::

Las URL externas `javascript:` en los atributos se eliminan al guardar. Mantén los shells por debajo de unos 150 KB; se admiten CSS en línea e imágenes HTTPS. Personalizar las páginas no cambia la dificultad de la prueba de trabajo ni los endpoints de verificación.

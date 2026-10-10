---
order: 32
title: Niveles de desafío de Citadel explicados
sidebarTitle: Niveles de desafío
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/challenge-levels
summary: "Elige entre los niveles de desafío de Citadel «Off», «Cookie», «JS», «Interaction», «Auto» o «Lockdown», según tu situación."
relatedSlugs:
  - citadel-security
  - citadel-allowlists
  - citadel-branding
translationOf: citadel-challenge-levels
locale: es
publishAt: 2026-10-15
primaryKeyword: niveles de desafío citadel
---
## Por qué los niveles de desafío de Citadel detienen los ataques de capa 7

Un ataque de capa 7 envía peticiones HTTP que parecen de visitantes normales: cargas repetidas de página, intentos de inicio de sesión, búsquedas o llamadas a la API. Cada petición es pequeña, así que el ataque se oculta en el tráfico habitual. Un desafío obliga al cliente a demostrar que es un navegador real o una persona real antes de que Citadel reenvíe la petición a tu servidor de origen. Los bots que no superan el desafío nunca llegan a tu servidor.

## Elige el nivel adecuado

- Empieza los sitios web públicos en «Auto» (Balanced). Arranca en un nivel más sosegado y sube cuando hay un ataque.
- Usa «Interaction» durante un abuso activo si «Auto» no es suficiente, y añade primero las APIs a la lista de permitidos.
- Usa «Lockdown» solo en emergencias y combínalo con listas de permitidos por IP o por ruta para los administradores y las integraciones.
- «Off» puede ser adecuado para una aplicación privada que ya esté protegida en otro lugar; los registros del proxy y los límites de peticiones configurados siguen aplicándose.

«Cookie» y «JS» son comprobaciones del navegador más ligeras, situadas entre «Off» e «Interaction».

## Comportamiento tras un reinicio

Tras reiniciar el proxy, «Auto» vuelve a su nivel base, más tranquilo, si había subido. Los niveles fijos guardados, incluido «Interaction», se mantienen tal como los configuraste.

:::warn
Una mayor fricción puede interrumpir las APIs y los monitores headless que no estén en listas de permitidos.
:::

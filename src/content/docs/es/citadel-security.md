---
order: 31
title: "Configurar seguridad en Citadel"
sidebarTitle: Configurar seguridad
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/security
summary: "Configura la seguridad en Citadel: elige el nivel de desafío y revisa las listas de permitidos, las de bloqueo y la limitación de peticiones."
relatedSlugs:
  - citadel-allowlists
  - citadel-challenge-levels
  - citadel-branding
  - citadel-cache
illustration:
  src: /citadel-docs/security-challenge.svg
  alt: Citadel challenge-level selector
  caption: Save a challenge level and allowlist APIs that cannot complete human interaction.
  width: 960
  height: 280
translationOf: citadel-security
locale: es
publishAt: 2026-10-15
primaryKeyword: configurar seguridad citadel
---
## Establecer un nivel de desafío

Para configurar seguridad en Citadel, abre la página «Security» del dominio, elige «Off», «Cookie», «JS», «Interaction», «Auto» o «Lockdown» y selecciona «Save level». Las sesiones del navegador ya abiertas deben verificarse de nuevo después de cambiar el nivel. Los perfiles de protección «Balanced» y «Strict» incluyen ajustes predefinidos.

- «Off» no aplica ningún desafío en el navegador, aunque las reglas de limitación de peticiones (rate limiting) y las listas de bloqueo configuradas pueden seguir aplicándose.
- «Cookie» y «JS» usan comprobaciones ligeras en el navegador.
- «Interaction» exige que una persona haga clic.
- «Auto» sube de nivel durante un ataque y vuelve a bajar cuando el tráfico se normaliza.
- «Lockdown» solo deja pasar a los clientes incluidos en la lista de permitidos.

## Proteger clientes automatizados

Las API y los webhooks no pueden completar un clic humano. Añade [listas de permitidos por ruta, IP o User-Agent](/es/citadel/docs/allowlists), sobre todo antes de usar «Interaction» o «Lockdown». Revisa también las reglas de limitación de peticiones (rate limiting), las listas de bloqueo y los controles de incidentes en la misma página «Security».

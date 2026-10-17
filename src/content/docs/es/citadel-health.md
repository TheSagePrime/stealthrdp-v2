---
order: 29
title: "Comprobar el estado del origen en Citadel"
sidebarTitle: Estado del origen
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/health
summary: "Comprueba en Citadel la latencia, el estado y los errores de tu origen, encuentra la causa de los errores 502 y corrige el host, el puerto, TLS o el firewall."
relatedSlugs:
  - citadel-origin
  - citadel-security
translationOf: citadel-health
locale: es
publishAt: 2026-10-10
primaryKeyword: estado del origen citadel
---
## Ejecutar una comprobación de estado

Abre el dominio y selecciona «Health». Revisa la latencia, el estado y el texto de error de la última sonda, o ejecuta una nueva después de cambiar los ajustes de «Origin».

## Si falla una sonda

Comprueba la IP o el nombre de host del origen, el puerto, el ajuste de TLS y las reglas del firewall, que deben permitir el tráfico saliente de Citadel. Guarda las correcciones en «Origin» y vuelve a comprobar «Health». Si los visitantes ven un error 502 (Bad Gateway), lo habitual es que el origen no sea accesible.

La monitorización del estado del origen no cambia en silencio un nivel de desafío fijo a «Interaction». En «Security» se mantiene el nivel que guardaste.

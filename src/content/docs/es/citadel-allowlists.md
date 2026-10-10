---
order: 34
title: "Configurar lista de permitidos en Citadel"
sidebarTitle: "Reglas de la lista de permitidos"
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/allowlists
summary: "Configura la lista de permitidos en Citadel para omitir los desafíos de rutas, IP y User-Agent de confianza en todos los nombres de host."
relatedSlugs:
  - citadel-security
  - citadel-challenge-levels
translationOf: citadel-allowlists
locale: es
publishAt: 2026-10-18
primaryKeyword: lista de permitidos citadel
illustration:
  src: /citadel-docs/allowlist-paths.svg
  alt: Citadel allowlist paths, IPs and User-Agent controls
  caption: Path, IP and User-Agent bypass rules apply across protected hostnames.
  width: 960
  height: 300
---
## Añadir una excepción a la lista de permitidos

Para configurar la lista de permitidos en Citadel, abre «Security» → «Allowlist / bypass», añade reglas específicas y pulsa «Save allowlist». Los visitantes que coincidan con una regla omiten los desafíos, incluido Lockdown, en el dominio raíz (apex), en `www` y en los subdominios protegidos de ese dominio.

## Reglas de rutas

Las rutas deben empezar por `/`. `/api/` coincide con `/api`, con `/api/` y con descendientes como `/api/auth/google`. `/api` también coincide con los descendientes, pero no con `/apiv2`. Mantén las reglas concretas, porque otras funciones de seguridad pueden seguir dependiendo del orden de las reglas.

## Reglas de IP y User-Agent

Introduce una dirección IPv4 o IPv6 exacta, o un bloque CIDR, como `203.0.113.0/24`. Cuando el tráfico pasa por los nodos perimetrales de Cloudflare de confianza, Citadel usa la IP de origen del visitante o del webhook a partir de `CF-Connecting-IP` o `X-Real-IP`.

:::warn
No incluyas en la lista de permitidos las IP compartidas de Cloudflare.
:::

La regla de User-Agent usa una coincidencia de subcadena, como `Stripe/` o `UptimeRobot`, y es más fácil de falsificar que la coincidencia por ruta o por IP.

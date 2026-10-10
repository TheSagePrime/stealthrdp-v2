---
order: 17
title: Cómo instalar cPanel y WHM en Linux
sidebarTitle: Instalar cPanel y WHM
category: Web panels
date: Jan 27, 2025
sourceTitle: Install Cpanel and WHM in Linux (You need a license)
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946509-install-cpanel-and-whm-in-linux-you-need-a-license
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Cómo instalar cPanel y WHM en un servidor Linux nuevo con el instalador oficial. Necesitas una licencia de pago de cPanel para la IP de tu servidor."
relatedSlugs: []
translationOf: 1737946509-install-cpanel-and-whm-in-linux-you-need-a-license
locale: es
publishAt: 2026-10-19
primaryKeyword: instalar cpanel
---
En este tutorial vas a aprender a instalar cPanel y WHM en un servidor Linux, de la forma más sencilla posible. Tendrás que comprar la licencia de cPanel en el sitio web de cPanel.

:::warn
**Nota importante:**

cPanel, L.L.C. diseña software para hosting comercial. Por eso, cPanel solo concede licencias para direcciones IP estáticas y visibles públicamente. No concede licencias para IP dinámicas, reservadas, sticky ni internas. cPanel no ofrece desinstalador. Si quieres eliminar el software, debes reformatear el servidor.

Instala cPanel y WHM solo en un sistema operativo recién instalado. Debes iniciar sesión en el servidor como usuario root para instalar cPanel y WHM. Si no tienes acceso de root, contacta con tu administrador de sistemas o con tu proveedor de hosting.

cPanel recomienda usar el instalador de cPanel y WHM, que instala todos los servicios que necesita. Si instalas servicios antes de instalar cPanel y WHM, encontrarás problemas de compatibilidad.

Las instalaciones nuevas de cPanel y WHM usan por defecto el modo de instalación rápida. Para desactivarlo, sigue los pasos de la documentación «Customize Your Installation» de cPanel.
:::

## Requisitos del sistema

Antes de instalar cPanel y WHM o cPanel DNSOnly®, comprueba que tu sistema cumple todos los requisitos mínimos de cPanel para instalaciones nuevas. Los requisitos mínimos dependen del sistema operativo de tu servidor:

- [Requisitos del sistema para AlmaLinux](https://docs.cpanel.net/installation-guide/system-requirements-almalinux)
- [Requisitos del sistema para Ubuntu](https://docs.cpanel.net/installation-guide/system-requirements-ubuntu/)
- [Requisitos del sistema para CloudLinux™](https://docs.cpanel.net/installation-guide/system-requirements-cloudlinux)

## Instalar cPanel y WHM

Para instalar cPanel y WHM en tu servidor, ejecuta el siguiente comando:

```bash title="Ejecuta el instalador de cPanel y WHM"
cd /home && curl -o latest -L https://securedownloads.cpanel.net/latest && sh latest
```

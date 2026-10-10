---
order: 16
title: 'Cómo instalar DirectAdmin en un servidor Linux'
sidebarTitle: Instalar DirectAdmin
category: Web panels
date: Jan 27, 2025
sourceTitle: How to install Direct admin in a Linux server?
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946490-how-to-install-direct-admin-in-a-linux-server
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'Aprende a instalar DirectAdmin en un VPS Linux limpio: revisa los requisitos del sistema y compara DirectAdmin con cPanel antes de comprar una licencia.'
relatedSlugs: []
translationOf: 1737946490-how-to-install-direct-admin-in-a-linux-server
locale: es
publishAt: 2026-10-16
primaryKeyword: instalar directadmin
---
Esta guía te muestra cómo instalar DirectAdmin en tu servidor Linux.

### 1. Comprueba los requisitos del sistema

Asegúrate de cumplir los requisitos del sistema: una instalación limpia del sistema operativo y al menos una dirección IP externa.

- Al menos 4 GB de memoria y 4 GB de swap, además de 2 GB de espacio libre en disco una vez instalado el sistema operativo.

#### Sistemas operativos compatibles

- **Red Hat Enterprise Linux y sus derivados:** CentOS Stream, Rocky Linux y AlmaLinux
- **Debian**
- **Ubuntu**

DirectAdmin enumera las versiones compatibles y sus fechas de fin de vida en su página de requisitos del sistema. Usa un sistema de 64 bits (amd64 o arm64).

### 2. Verifica que los datos de tu licencia son correctos

Inicia sesión en tu área de cliente y haz clic en el enlace «view» junto a tu licencia aquí: [https://www.directadmin.com/clients/](https://www.directadmin.com/clients/)

Comprueba que la dirección IP del servidor y el sistema operativo son correctos. Asegúrate también de que la licencia figura como «Active» y «Verified» (si no es así, el sistema de facturación de DirectAdmin todavía no ha procesado tu pedido).

### 3. Instalar DirectAdmin

Inicia sesión como root en tu servidor, descarga el script de instalación y ejecútalo:

```bash title="Ejecuta el instalador web de DirectAdmin"
sh <(curl -fsSL https://download.directadmin.com/setup.sh)
```

El script realiza la configuración inicial del sistema e imprime una URL. Abre esa URL en tu navegador para terminar la instalación. Si prefieres instalar desde la línea de comandos, añade tu clave de licencia, que usa las opciones de configuración predeterminadas:

```bash title="Ejecuta el instalador de DirectAdmin por línea de comandos"
sh <(curl -fsSL https://download.directadmin.com/setup.sh) 'YOUR-LICENSE-KEY'
```

:::warn
El nombre de host no debe ser igual que el dominio principal. Por ejemplo, gary.com no es un buen nombre de host, pero server.gary.com sí lo es. Si el host y el dominio principal coinciden, tendrás problemas con el correo y con FTP. Además, asegúrate de que el nombre de host se resuelve una vez configurado el DNS.
:::

## Acceder al panel de control

Puedes acceder a DirectAdmin en `http://server.ip.address:2222`. Usa el usuario y la contraseña de administrador de la información que muestra setup.sh (la misma información se guarda en el archivo `/usr/local/directadmin/conf/setup.txt`).

## DirectAdmin frente a cPanel

Ambos son paneles comerciales y requieren una licencia de pago. cPanel se usa junto con WHM para la administración a nivel de servidor. DirectAdmin usa una única interfaz con niveles de administrador, revendedor y usuario. Compara los precios actuales de las licencias y los sistemas operativos compatibles en el sitio web de cada proveedor antes de elegir. Si quieres un panel gratuito, consulta [CyberPanel](/es/docs/install-cyber-panel-with-open-lite-speed-in-linux) o [CentOS Web Panel](/es/docs/how-to-install-centos-web-panel-cwp-free-web-panel).

---
order: 3
title: Cómo instalar FASTPANEL en Linux
sidebarTitle: Instalar FASTPANEL
category: Web panels
date: Jan 27, 2025
sourceTitle: Install Fast Panel in Linux (Good Web Hosting Free Panel)
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946569-install-fast-panel-in-linux-good-web-hosting-free-panel
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Instala FASTPANEL, un panel de hosting web gratuito, en un VPS Linux nuevo por SSH y entra en el puerto 8888 para gestionar sitios, correo y bases de datos."
relatedSlugs: []
translationOf: 1737946569-install-fast-panel-in-linux-good-web-hosting-free-panel
locale: es
publishAt: 2026-10-16
primaryKeyword: instalar fastpanel
---
FASTPANEL es un panel de control de hosting web gratuito. Te permite crear sitios, gestionar correo, bases de datos, copias de seguridad y tareas programadas, y ver estadísticas de tráfico desde el navegador. También puedes dar acceso a otros usuarios a sus propios sitios. Esta guía explica cómo instalar FASTPANEL en tu servidor. Sitio oficial: [fastpanel.direct](https://fastpanel.direct/).

## Antes de empezar

- **Un servidor nuevo.** Instala FASTPANEL solo en un sistema operativo recién instalado. Si lo instalas en un servidor que ya tiene un stack web instalado, puedes romper los sitios existentes. En StealthRDP puedes [reconstruir el servidor](/es/docs/how-to-rebuild-a-server) para empezar desde cero.
- **Un sistema operativo compatible (64 bits).** FASTPANEL admite Debian 9 a 12, Ubuntu 18.04, 20.04, 22.04 y 24.04, CentOS 7, AlmaLinux 8 y Rocky Linux 8. Consulta la web oficial para ver la lista actual.
- **Acceso root por SSH.**

### 1. Conéctate por SSH

```bash title="Conectarse al servidor"
ssh root@your_server_ip
```

### 2. Instala wget si falta

```bash tab="Debian o Ubuntu" title="Instalar wget en Debian o Ubuntu"
apt-get update && apt-get install -y wget
```

```bash tab="CentOS, AlmaLinux o Rocky Linux" title="Instalar wget en CentOS, AlmaLinux o Rocky Linux"
yum makecache && yum install -y wget
```

### 3. Instala FASTPANEL con el instalador

```bash title="Ejecutar el instalador de FASTPANEL"
wget http://repo.fastpanel.direct/install_fastpanel.sh -O - | bash -
```

El instalador configura el servidor web, PHP, la base de datos y los servicios de correo. Al terminar, muestra los datos de acceso.

### 4. Inicia sesión en el panel

FASTPANEL usa el puerto **8888**. Abre esta dirección en tu navegador: `https://your_server_ip:8888`

- **Usuario:** `fastuser`
- **Contraseña:** la contraseña que aparece al final de la instalación.

En el primer inicio de sesión, el panel pide una licencia. Introduce tu correo electrónico y te enviarán la licencia gratuita. Cambia la contraseña de `fastuser` después de iniciar sesión.

## Próximos pasos

- Apunta el registro A del DNS de tu dominio a la IP del servidor y luego añade el sitio en FASTPANEL.
- Emite un certificado gratuito de Let's Encrypt para el sitio y [fuerza HTTPS](/es/docs/how-to-force-https-using-htaccess).
- Si el puerto 8888 no se abre, permítelo en tu cortafuegos, por ejemplo con `ufw allow 8888/tcp`.

¿Comparas paneles? Consulta [CyberPanel](/es/docs/install-cyber-panel-with-open-lite-speed-in-linux), [CentOS Web Panel](/es/docs/how-to-install-centos-web-panel-cwp-free-web-panel) y [DirectAdmin](/es/docs/how-to-install-direct-admin-in-a-linux-server).

---
order: 18
title: 'Instalar CyberPanel con OpenLiteSpeed en Linux'
sidebarTitle: Instalar CyberPanel
category: Web panels
date: Jan 27, 2025
sourceTitle: Install Cyber Panel With OpenLiteSpeed in Linux
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946534-install-cyber-panel-with-open_lite_speed-in-linux
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'Cómo instalar CyberPanel con OpenLiteSpeed en un VPS Linux nuevo por SSH y abrir después el panel para gestionar sitios web, correo y bases de datos.'
relatedSlugs: []
translationOf: 1737946534-install-cyber-panel-with-open_lite_speed-in-linux
locale: es
publishAt: 2026-10-17
primaryKeyword: instalar cyberpanel
---
En este tutorial vamos a instalar CyberPanel en un servidor Linux y intentaré que el tutorial sea lo más fácil posible. Usaremos el plan gratuito, que incluye:

- Dominios ilimitados
- Subdominios ilimitados
- Bases de datos ilimitadas
- Varias versiones de PHP
- SSL de Let's Encrypt
- LSCache para WordPress
- Soporte de la comunidad
- Servidor OpenLiteSpeed

CyberPanel necesita una instalación nueva de uno de estos sistemas, con al menos 1024 MB de RAM y 10 GB de espacio en disco:

- Ubuntu 18.04, 20.04 o 22.04
- AlmaLinux 8 o 9
- CloudLinux 8

La guía de instalación de CyberPanel no incluye Ubuntu 24.04 ni AlmaLinux 10, así que elige uno de los de la lista anterior al hacer el pedido.

### 1. Actualiza las listas de repositorios

Abre una ventana de terminal y escribe lo siguiente:

```bash tab="Ubuntu" title="Actualizar las listas de paquetes"
sudo apt update
```

```bash tab="AlmaLinux 8 or 9" title="Actualizar las listas de paquetes"
sudo yum update
```

### 2. Instalar CyberPanel

Ya podemos instalar CyberPanel. Introduce este único comando y, después, sigue el instalador paso a paso:

```bash title="Ejecutar el instalador de CyberPanel"
sh <(curl https://cyberpanel.net/install.sh || wget -O - https://cyberpanel.net/install.sh)
```

:::tip
Si no sabes solucionar errores de SQL, instálalo sin SQL remoto para evitar problemas técnicos más adelante.
:::

## Acceso

Tras una instalación correcta, puedes acceder a CyberPanel con los datos siguientes (hasta que hayas definido tus credenciales de acceso durante la instalación). Asegúrate de cambiarlos.

- Visita: `https://YOUR-SERVER-IP:8090`
- Usuario: `admin`
- Contraseña: `1234567` (cámbiala tras el primer inicio de sesión)

## Error 503 después de la instalación

Si recibes un error 503 tras instalar CyberPanel, puedes hacer una de estas cosas.

### Comprueba el estado de LSCPD

```bash title="Comprobar el estado de LSCPD"
systemctl status lscpd
```

Si LSCPD no está en ejecución, inícialo:

```bash title="Iniciar LSCPD"
systemctl start lscpd
```

### Configura manualmente el entorno virtual

```bash title="Recrear el entorno virtual de CyberCP"
source /usr/local/CyberCP/bin/activate
pip install --ignore-installed -r /usr/local/CyberCP/requirments.txt
deactivate
virtualenv --system-site-packages /usr/local/CyberCP
systemctl restart lscpd
```

### Revisa los registros de instalación

Si sigues con problemas, busca errores en el registro de instalación en `/var/log/installLogs.txt`.

---
order: 5
title: 'Cómo instalar CentOS Web Panel (CWP) en Linux'
sidebarTitle: Instalar Control Web Panel
category: Web panels
date: Jan 27, 2025
sourceTitle: How to install Centos Web Panel (CWP) (Free Web Panel)
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946470-how-to-install-centos-web-panel-cwp-free-web-panel
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'Aprende a instalar CentOS Web Panel (CWP), también llamado Control Web Panel, en un VPS con AlmaLinux 8 o 9 por SSH y gestionar webs, correo y DNS.'
relatedSlugs: []
translationOf: 1737946470-how-to-install-centos-web-panel-cwp-free-web-panel
locale: es
publishAt: 2026-10-24
primaryKeyword: instalar centos web panel
---
En este tutorial vamos a instalar CentOS Web Panel (CWP), también llamado Control Web Panel, en un servidor Linux con AlmaLinux, y lo haremos de la forma más sencilla posible. Usaremos la versión gratuita, que incluye:

- Servidor web Apache (ModSecurity + reglas actualizadas automáticamente, opcional)
- Selector de versión de PHP (en AlmaLinux 9, de PHP 7.4 a 8.4 y posteriores)
- MySQL/MariaDB + phpMyAdmin
- Postfix + Dovecot + Roundcube webmail (antivirus y SpamAssassin opcionales)
- Cortafuegos CSF
- Bloqueo del sistema de archivos (para evitar hackeos de webs: todos tus archivos quedan bloqueados frente a cambios)
- Copias de seguridad (opcional)
- AutoFixer para la configuración del servidor
- CloudLinux + CageFS + PHP Selector
- Softaculous
- Instalador de scripts (gratuito y de pago)
- LiteSpeed Enterprise (servidor web)
- Configuración de servidor para alojamiento web (webs como WordPress)
- API para gestionar cuentas más fácilmente, y API de facturación
- Versión NAT, con soporte para IP NAT

:::info
Algunas funciones solo están disponibles en CWP Pro, una mejora de pago.
:::

## Notas

:::warn
- No hay desinstalador para CWP. Después de instalar CWP, tienes que reinstalar el servidor para eliminarlo.
- Solo admite direcciones IP estáticas. No admite IP dinámicas, sticky ni internas.
- Instala CWP solo en un sistema operativo recién instalado y sin cambios de configuración.
:::

Para empezar desde un sistema compatible, elige AlmaLinux 8 o 9 al hacer el pedido en un [VPS Linux de StealthRDP](/es/plans).

## Requisitos del sistema

Asegúrate de completar las siguientes tareas antes de empezar la instalación.

### Nombre de host

Define un nombre de host completo (FQDN) que no coincida con ningún dominio del servidor:

```bash title="Definir el nombre de host"
hostname srv1.example.com
```

### Requisitos de software

Necesitas una instalación limpia de un sistema operativo compatible:

- **AlmaLinux 8 o 9, minimal (recomendado):** la opción con mejor soporte en CWP. AlmaLinux 10 no está en la lista de CWP.
- **Rocky Linux 8 o 9, minimal:** compatible, pero CWP informa de algunos problemas y prefiere AlmaLinux.
- **CentOS 7:** no recomendado. CentOS 7 alcanzó su fin de soporte (EOL) en junio de 2024, así que no lo uses para un servidor CWP nuevo.

### Requisitos de hardware

Los sistemas de 64 bits necesitan al menos 2 GB de RAM.

**Sistema recomendado:** 4 GB de RAM o más, para tener toda la funcionalidad, como el escaneo antivirus del correo electrónico.

## Preparar el servidor

### 1. Instala EPEL y wget

```bash title="Instalar EPEL y wget"
dnf install epel-release -y
dnf -y install wget
```

### 2. Actualiza el servidor

```bash title="Actualizar paquetes"
yum -y update
```

### 3. Reinicia el servidor

```bash title="Reiniciar"
reboot
```

## Instalar CentOS Web Panel (CWP)

Ya puedes empezar la instalación de CWP. El instalador de CWP puede tardar más de 30 minutos, porque tiene que compilar Apache y PHP desde el código fuente.

```bash tab="AlmaLinux 9 (instalador EL9)" title="Instalar CWP en AlmaLinux 9"
cd /usr/local/src
wget http://centos-webpanel.com/cwp-el9-latest
sh cwp-el9-latest
```

```bash tab="AlmaLinux 8 (instalador EL8)" title="Instalar CWP en AlmaLinux 8"
cd /usr/local/src
wget http://centos-webpanel.com/cwp-el8-latest
sh cwp-el8-latest
```

Rocky Linux 8 y 9 usan los mismos instaladores: `cwp-el8-latest` y `cwp-el9-latest`.

## Argumentos opcionales

Argumentos con nombre largo disponibles:

- `--restart yes` para reiniciar automáticamente tras una instalación correcta
- `--phpfpm <versión>` (solo puedes usar uno). En el instalador EL9 se admiten de PHP 7.4 a 8.4 y posteriores.
- `--softaculous yes` para instalar Softaculous, el instalador de scripts

Argumentos con nombre corto disponibles:

- `-r yes` para reiniciar automáticamente tras una instalación correcta
- `-p <versión>` (solo puedes usar uno)
- `-s yes` para instalar Softaculous, el instalador de scripts

Ejemplo para AlmaLinux 9 (puedes combinar argumentos de nombre largo y corto):

```bash title="Instalar CWP en AlmaLinux 9 con opciones"
sh cwp-el9-latest -r yes -s yes
```

Cualquiera de estos complementos también se puede instalar más tarde desde la interfaz gráfica de CWP.

## Reiniciar el servidor

Reinicia el servidor para que se apliquen todas las actualizaciones y se inicie CWP.

```bash title="Reiniciar"
reboot
```

## CloudLinux (opcional)

Necesitas una licencia para usar CloudLinux.

```bash title="Instalar CloudLinux"
wget https://repo.cloudlinux.com/cloudlinux/sources/cln/cldeploy
sh cldeploy -k YOUR-KEY
cd /usr/local/src/
wget https://dl1.centos-webpanel.com/files/c_scripts/cloudlinux.sh
sh cloudlinux.sh
```

:::warn
Cuando termine el instalador de CloudLinux, el servidor se reiniciará automáticamente.
:::

Después del reinicio, tienes que inicializar CageFS y activarlo:

```bash title="Inicializar y activar CageFS"
/usr/sbin/cagefsctl --init
cagefsctl --enable-all
```

## Configuración

Inicia sesión en tu servidor CWP con el enlace que te muestra el instalador en el servidor:

- Interfaz de administración de Control WebPanel: `http://SERVER-IP:2030/`
- Usuario: `root`
- Contraseña: tu contraseña de root

Después, configura el correo del usuario root, configura al menos un paquete de alojamiento (o edita el paquete predeterminado) y define la IP compartida, que debe ser tu dirección IP pública.

## Configurar los nameservers

Ya estás listo para alojar dominios.

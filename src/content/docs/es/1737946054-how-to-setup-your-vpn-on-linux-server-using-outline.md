---
order: 2
title: Instalar Outline VPN con Docker en un VPS Linux
sidebarTitle: Outline VPN con Docker
category: VPN and networking
date: Jan 27, 2025
sourceTitle: How to Setup your VPN on Linux Server using outline?
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737946054-how-to-setup-your-vpn-on-linux-server-using-outline
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Cómo instalar Outline VPN en un VPS Linux con Docker: instala Docker, ejecuta el script, abre los puertos y conecta Outline Manager."
relatedSlugs: []
translationOf: 1737946054-how-to-setup-your-vpn-on-linux-server-using-outline
locale: es
publishAt: 2026-10-24
primaryKeyword: instalar outline vpn
---
Outline es una VPN de código abierto de Jigsaw que funciona con contenedores Docker en tu propio servidor. Esta guía explica cómo instalar Outline VPN en un VPS Linux y crear tu propio servidor VPN. Lo gestionas con la aplicación de escritorio Outline Manager y compartes las claves de acceso con tus usuarios, que se conectan con Outline Client.

## Lo que necesitas

- Un VPS Linux con acceso root o sudo, como un [VPS Linux de StealthRDP](/es/linux-vps).
- Un ordenador local con [Outline Manager](https://getoutline.org/get-started/) instalado (Windows, macOS o Linux).
- El uso de una VPN debe cumplir la legislación de tu país y las [condiciones de uso del servicio de StealthRDP](/es/docs/use-of-service).

### 1. Instala Docker

Outline se ejecuta en Docker. Si Docker no está instalado, instálalo con el script de instalación que ofrece Docker:

```bash title="Instalar y arrancar Docker"
curl -fsSL https://get.docker.com | sudo sh
sudo systemctl enable --now docker
```

Comprueba que Docker se está ejecutando:

```bash title="Comprobar el estado de Docker"
sudo systemctl status docker
```

La salida debe mostrar `active (running)`. Si omites este paso, el script de instalación de Outline te ofrece instalar Docker por ti.

### 2. Ejecuta el script para instalar Outline VPN

Abre Outline Manager, elige **Set up Outline anywhere** y copia el comando de instalación que muestra. En el momento de escribir esta guía, es:

```bash title="Comando de instalación de Outline"
sudo bash -c "$(wget -qO- https://raw.githubusercontent.com/OutlineFoundation/outline-apps/master/server_manager/install_scripts/install_server.sh)"
```

Ejecútalo en el servidor. El script crea claves secretas e inicia dos contenedores: `shadowbox` (el servidor VPN) y `watchtower` (que lo mantiene actualizado).

### 3. Abre los puertos del cortafuegos

Cuando termine el script, muestra los dos puertos que usa:

- un **puerto de administración** (TCP), que usa Outline Manager;
- un **puerto de claves de acceso** (TCP y UDP), que usan los clientes VPN.

Si usas `ufw`, permite ambos, sustituyendo los números por los que mostró el script:

```bash title="Permitir los puertos de Outline"
sudo ufw allow 12345/tcp
sudo ufw allow 23456/tcp
sudo ufw allow 23456/udp
```

### 4. Conecta Outline Manager

El script termina con una línea como esta:

```json title="Salida del script de instalación"
{ "apiUrl": "https://[your-server-ip]:12345/xxxxxxxx", "certSha256": "xxxxxxxx" }
```

Copia la línea completa en Outline Manager y haz clic en **Done**.

:::warn
Mantén esta línea en privado. Cualquiera que la tenga puede administrar tu servidor.
:::

### 5. Comparte las claves de acceso

Outline Manager crea una primera clave llamada **My access key**. Crea una clave por persona, haz clic en **Share** y envía la clave. Cada usuario instala Outline Client en su dispositivo y añade la clave para conectarse.

## Solución de problemas

- **Outline Manager no puede conectarse:** comprueba que el puerto de administración está abierto en todos los cortafuegos y que el contenedor `shadowbox` está en marcha con `sudo docker ps`.
- **Los clientes se conectan pero no tienen acceso a Internet:** comprueba que el puerto de claves de acceso está abierto tanto para TCP como para UDP.

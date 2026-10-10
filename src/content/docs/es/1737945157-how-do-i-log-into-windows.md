---
order: 12
title: 'Conexión a escritorio remoto a tu VPS Windows'
sidebarTitle: Conectar con RDP
category: Windows
date: Jan 27, 2025
sourceTitle: How do I log into Windows RDP?
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737945157-how-do-i-log-into-windows
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: Guía de conexión a escritorio remoto para tu VPS Windows desde Windows 10 u 11, Mac, iPhone, iPad, Android o Linux, con la IP y la contraseña del correo.
relatedSlugs:
  - 1737944563-how-to-re_activate-and-extend-your-180_day-windows-trial
translationOf: 1737945157-how-do-i-log-into-windows
locale: es
publishAt: 2026-10-13
primaryKeyword: conexión a escritorio remoto
---
Para establecer la conexión a escritorio remoto necesitas tres datos del correo que te envía StealthRDP tras el pago: la dirección IP del servidor, el nombre de usuario (`Administrator`) y la contraseña. Después, elige el apartado de tu dispositivo.

## Windows 10 y Windows 11: conexión a escritorio remoto

La **Conexión a Escritorio remoto** (Remote Desktop Connection) viene integrada en Windows 10 y Windows 11.

### 1. Abre la Conexión a Escritorio remoto

Pulsa la **tecla Windows**, escribe **Conexión a Escritorio remoto** y ábrela. También puedes pulsar **Windows + R**, escribir `mstsc` y pulsar Intro.

### 2. Introduce la dirección del servidor

En **Equipo** (Computer), escribe la dirección IP del servidor que aparece en tu correo.

### 3. Conéctate e inicia sesión

Selecciona **Conectar** (Connect). Cuando Windows pida credenciales, elige **Más opciones** (More choices) > **Usar otra cuenta** (Use a different account), y escribe `Administrator` y la contraseña.

### 4. Acepta la advertencia del certificado

En la primera conexión, Windows muestra una advertencia de certificado. Selecciona **Sí** para continuar.

## Mac: Microsoft Remote Desktop (Windows App)

En Mac, usa el cliente gratuito de Microsoft. Microsoft lo llama ahora **Windows App**; en Macs más antiguos puede seguir apareciendo **Microsoft Remote Desktop**.

### 1. Instala Windows App

Instala **Windows App** desde la App Store de Mac.

### 2. Añade un PC

Selecciona **+** > **Añadir PC** (Add PC).

### 3. Introduce los datos del PC

En **Nombre del PC** (PC name), escribe la dirección IP del servidor. Añade `Administrator` y la contraseña como cuenta de usuario.

### 4. Conéctate al PC

Haz doble clic en el PC para conectar. Acepta el aviso del certificado en la primera conexión.

## iPhone, iPad y Android

Instala la app **Windows App** de Microsoft (o la anterior **Remote Desktop**) desde la App Store o Google Play. Añade un PC con la dirección IP del servidor y, después, inicia sesión como `Administrator` con tu contraseña. Un teclado y un ratón hacen que usar el móvil o la tableta resulte mucho más cómodo en sesiones largas.

## Linux: qué cliente RDP usar

Hay dos clientes habituales disponibles en los repositorios de la mayoría de distribuciones:

- **Remmina**: un cliente gráfico. Crea una conexión nueva, elige el protocolo **RDP** e introduce la dirección IP, `Administrator` y la contraseña.
- **FreeRDP**: un cliente de línea de comandos. Por ejemplo:

```bash title="Conectar con FreeRDP"
xfreerdp /v:SERVER_IP /u:Administrator
```

Sustituye `SERVER_IP` por la dirección IP de tu correo. FreeRDP te pide la contraseña al conectar.

## Si la conexión falla

- Comprueba que has copiado la dirección IP y la contraseña exactamente, sin espacios.
- Espera un minuto tras el pago. La mayoría de servidores están activos en menos de 60 segundos tras la confirmación del pago; en horas punta puede tardar unos minutos.
- Si el servidor se detuvo tras mucho tiempo con una evaluación de Windows Server, lee [cómo reactivar Windows Server](/es/docs/how-to-re-activate-and-extend-your-180-day-windows-trial).
- ¿Sigues atascado? Contacta con soporte por WhatsApp, con un ticket en el área de cliente o por correo electrónico de soporte. El soporte está disponible 24/7.

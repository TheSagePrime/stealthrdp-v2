---
order: 1
title: 'Ampliar evaluación Windows Server: slmgr -rearm'
sidebarTitle: Rearmar evaluación de Windows
category: Windows
date: Jan 28, 2025
sourceTitle: How to Re-activate and Extend Your 180-Day Windows Trial
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737944563-how-to-re_activate-and-extend-your-180_day-windows-trial
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Usa slmgr /rearm para restablecer el temporizador de evaluación de Windows Server, mira los rearmes restantes con slmgr /dlv y qué pasa cuando caduca."
relatedSlugs: []
translationOf: 1737944563-how-to-re_activate-and-extend-your-180_day-windows-trial
locale: es
publishAt: 2026-10-10
primaryKeyword: slmgr rearm
---
Las ediciones de evaluación de Windows Server duran 180 días. Puedes restablecer ese temporizador con el comando `slmgr -rearm` un número limitado de veces. Esta guía muestra los comandos, cómo comprobar cuántos rearmes quedan y qué ocurre cuando caduca la evaluación.

## 1. Abre PowerShell como administrador

Para empezar, necesitas ejecutar los comandos con privilegios de administrador. Así se hace:

1. Pulsa la **tecla Windows**, escribe **PowerShell** y, cuando aparezca, haz clic con el botón derecho sobre él.

2. Selecciona **Ejecutar como administrador** (Run as administrator) en el menú contextual.

## 2. Ejecuta el comando slmgr -rearm

Con PowerShell abierto con privilegios de administrador, escribe el siguiente comando para rearmar el periodo de evaluación:

```powershell title="Re-arm the evaluation"
slmgr -rearm
```

`slmgr /rearm` es el mismo comando. Windows acepta tanto la forma con guion como la forma con barra.

Este comando restablece el temporizador de evaluación de 180 días donde Microsoft lo permite para la edición de evaluación instalada.

:::info
Rearmar restablece el temporizador de activación de la evaluación donde Microsoft lo admite. No convierte una edición de evaluación en una edición de producción con licencia.
:::

## 3. Reinicia el sistema

Para terminar, reinicia el equipo para que los cambios surtan efecto. El reinicio es necesario para que el rearme se aplique por completo.

## 4. Comprueba el estado de la evaluación

Tras reiniciar, puedes consultar el periodo de evaluación restante y el número de rearmes con este comando en PowerShell:

```powershell title="Check evaluation status"
slmgr -dlv
```

Este comando muestra el estado detallado de la evaluación, incluidos los rearmes que quedan y el tiempo restante del periodo de evaluación.

En la salida, lee estas dos líneas. Los nombres son los del Windows en inglés; si tu sistema está en español, el texto puede aparecer traducido:

- **Remaining Windows rearm count** indica cuántas veces más puedes ejecutar `slmgr -rearm`. Cuando llega a 0, la evaluación no se puede volver a ampliar.
- **Timebased activation expiration** indica cuánto tiempo de evaluación queda.

## ¿Qué ocurre cuando caduca la evaluación de Windows Server?

Cuando termina el periodo de evaluación y no queda ningún rearme, Windows Server muestra avisos de activación y el servidor puede detenerse por sí solo. Si tu servidor se detiene en momentos aleatorios, comprueba antes el estado de la evaluación con `slmgr -dlv`. El artículo [el servidor se detiene aleatoriamente](/es/docs/server-stops-randomly) explica este caso.

Para mantener un servidor en producción, usa una licencia de Microsoft adecuada en lugar de rearmar. Consulta [Licencias de Windows](/es/docs/windows-licensing).

## Paso 5: opcional, activar solo con una clave de licencia válida

:::warn
Este paso no forma parte de la ampliación del periodo de evaluación. StealthRDP no proporciona claves ni licencias de Microsoft Windows. El siguiente comando es un comando de activación de Microsoft y no significa que StealthRDP suministre una licencia.
:::

El siguiente comando de Microsoft se muestra solo como referencia técnica:

```powershell title="Attempt activation (Microsoft command)"
slmgr -ato
```

Este comando de Microsoft intenta la activación. No significa que StealthRDP haya proporcionado una licencia.

## Licencias y uso en producción

Estos pasos rearman o amplían el periodo de evaluación de Microsoft donde la edición de evaluación instalada lo admite. No activan Windows, no proporcionan una licencia comercial ni autorizan el uso en producción. Para cargas de trabajo de producción, los clientes deben obtener la licencia de Microsoft adecuada. StealthRDP no suministra esa licencia.

Si tienes algún problema o necesitas más ayuda, contacta con nuestro equipo de soporte.

Consulta [Licencias de Windows](/es/docs/windows-licensing). StealthRDP solo proporciona la infraestructura y no suministra licencias de Microsoft Windows. Los clientes que usen Windows son responsables de cumplir las condiciones de licencia de Microsoft.

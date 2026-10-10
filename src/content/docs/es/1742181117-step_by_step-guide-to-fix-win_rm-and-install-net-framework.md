---
order: 21
title: Habilitar WinRM e instalar .NET Framework
sidebarTitle: Habilitar WinRM y .NET
category: Server management
date: Mar 17, 2025
sourceTitle: Step-by-Step Guide to Fix WinRM and Install .NET Framework
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1742181117-step_by_step-guide-to-fix-win_rm-and-install-net-framework
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "Sigue estos pasos para habilitar WinRM y resolver el problema de instalación de .NET Framework:"
relatedSlugs: []
translationOf: 1742181117-step_by_step-guide-to-fix-win_rm-and-install-net-framework
locale: es
publishAt: 2026-10-17
primaryKeyword: habilitar winrm
---
Sigue estos pasos para habilitar WinRM y resolver el problema de instalación de .NET Framework.

## 1. Abre el símbolo del sistema como administrador

1. Pulsa **Windows + X** y elige **Símbolo del sistema (administrador)** (Command Prompt (Admin)) o **Windows PowerShell (administrador)** (Windows PowerShell (Admin)) en el menú.

2. Si aparece el **Control de cuentas de usuario** (User Account Control, UAC), pulsa **Sí** (Yes) para continuar.

## 2. Comprueba la configuración actual de WinRM

1. En la ventana del símbolo del sistema, escribe el siguiente comando y pulsa **Intro**:

   ```cmd title="Mostrar la configuración de WinRM"
   winrm get winrm/config
   ```

2. Este comando muestra la configuración actual de WinRM. Busca errores o configuraciones incorrectas en la salida.

## 3. Habilitar WinRM (recomendado)

Si la salida indica que WinRM no está bien configurado, puedes configurarlo rápidamente con este comando:

```cmd title="Configuración rápida de WinRM"
winrm quickconfig
```

- Este comando configura WinRM con los ajustes predeterminados: habilita el servicio WinRM y crea una excepción en el firewall.
- Sigue las indicaciones de la pantalla para completar la configuración.

## 4. Comprueba que WinRM está en ejecución

1. Después de configurar WinRM, comprueba que está en ejecución con el siguiente comando:

   ```cmd title="Listar los receptores (listeners) de WinRM"
   winrm enumerate winrm/config/listener
   ```

2. Este comando debería devolver los detalles del receptor (listener) de WinRM. Si no lo hace, puede que todavía haya un problema en la configuración.

## 5. Vuelve a intentar la instalación de .NET Framework

1. Cuando WinRM esté bien configurado, vuelve a intentar instalar .NET Framework.

2. La instalación debería continuar ahora sin problemas relacionados con WinRM.

Un saludo, el equipo de [StealthRDP](/es).

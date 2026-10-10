---
order: 21
title: WinRM aktivieren, .NET Framework installieren
sidebarTitle: WinRM und .NET
category: Server management
date: Mar 17, 2025
sourceTitle: Step-by-Step Guide to Fix WinRM and Install .NET Framework
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1742181117-step_by_step-guide-to-fix-win_rm-and-install-net-framework
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: "WinRM aktivieren und das Problem bei der Installation von .NET Framework beheben. Befolgen Sie dazu diese Schritte:"
relatedSlugs: []
translationOf: 1742181117-step_by_step-guide-to-fix-win_rm-and-install-net-framework
locale: de
publishAt: 2026-10-17
primaryKeyword: winrm aktivieren
---
Mit den folgenden Schritten können Sie WinRM aktivieren und das Problem bei der Installation von .NET Framework beheben.

## 1. Eingabeaufforderung (Command Prompt) als Administrator öffnen

1. Drücken Sie `Windows + X` und wählen Sie im Menü **Eingabeaufforderung (Administrator)** (Command Prompt (Admin)) oder **Windows PowerShell (Administrator)** (Windows PowerShell (Admin)).

2. Wenn die Benutzerkontensteuerung (User Account Control, UAC) nachfragt, klicken Sie auf **Ja** (Yes), um fortzufahren.

## 2. Die aktuelle WinRM-Konfiguration prüfen

1. Geben Sie im Fenster der Eingabeaufforderung den folgenden Befehl ein und drücken Sie **Eingabe** (Enter):

   ```cmd title="Show the WinRM configuration"
   winrm get winrm/config
   ```

2. Dieser Befehl zeigt die aktuelle Konfiguration von WinRM an. Suchen Sie in der Ausgabe nach Fehlern oder falschen Einstellungen.

## 3. WinRM aktivieren (empfohlen)

Wenn die Ausgabe zeigt, dass WinRM nicht richtig konfiguriert ist, können Sie es mit dem folgenden Befehl schnell einrichten:

```cmd title="Quick-configure WinRM"
winrm quickconfig
```

- Dieser Befehl richtet WinRM mit den Standardeinstellungen ein. Dazu gehören das Aktivieren des WinRM-Dienstes und eine Firewallausnahme.
- Folgen Sie den Anweisungen auf dem Bildschirm, um die Konfiguration abzuschließen.

## 4. Prüfen, ob WinRM läuft

1. Prüfen Sie nach der Einrichtung, ob WinRM läuft, indem Sie den folgenden Befehl ausführen:

   ```cmd title="List the WinRM listeners"
   winrm enumerate winrm/config/listener
   ```

2. Dieser Befehl sollte Details zum WinRM-Listener zurückgeben. Falls nicht, liegt womöglich weiterhin ein Konfigurationsproblem vor.

## 5. Die Installation von .NET Framework erneut versuchen

1. Sobald WinRM richtig konfiguriert ist, versuchen Sie erneut, .NET Framework zu installieren.

2. Die Installation sollte nun ohne WinRM-bedingte Probleme durchlaufen.

Mit freundlichen Grüßen, Ihr [StealthRDP](/de) Team

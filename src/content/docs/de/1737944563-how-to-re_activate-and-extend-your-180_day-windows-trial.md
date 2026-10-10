---
order: 1
title: 'Windows Server verlängern: slmgr rearm'
sidebarTitle: Testversion mit slmgr verlängern
category: Windows
date: Jan 28, 2025
sourceTitle: How to Re-activate and Extend Your 180-Day Windows Trial
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737944563-how-to-re_activate-and-extend-your-180_day-windows-trial
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'Verlängern Sie die Windows-Server-Testversion mit slmgr rearm, prüfen Sie die verbleibenden Rearms mit slmgr -dlv und erfahren Sie, was beim Ablauf passiert.'
relatedSlugs: []
translationOf: 1737944563-how-to-re_activate-and-extend-your-180_day-windows-trial
locale: de
publishAt: 2026-10-10
primaryKeyword: slmgr rearm
---
Windows-Server-Testversionen laufen 180 Tage. Mit dem Rearm-Befehl `slmgr -rearm` setzen Sie den Timer einer Testversion zurück, allerdings nur begrenzt oft. Diese Anleitung zeigt, wie Sie die verbleibende Anzahl an Rearms prüfen und was passiert, wenn die Testversion abläuft.

## 1. PowerShell als Administrator öffnen

Zuerst müssen Sie die Befehle mit Administratorrechten ausführen. So geht's:

1. Drücken Sie die **Windows-Taste** (Windows key), geben Sie **PowerShell** ein und klicken Sie das Ergebnis mit der rechten Maustaste an.

2. Wählen Sie im Kontextmenü **Als Administrator ausführen** (Run as administrator).

## 2. Den Befehl slmgr rearm ausführen

Sobald PowerShell mit Administratorrechten geöffnet ist, geben Sie den folgenden Befehl ein, um den Testzeitraum zurückzusetzen:

```powershell title="Testzeitraum zurücksetzen"
slmgr -rearm
```

`slmgr /rearm` ist derselbe Befehl. Windows akzeptiert sowohl die Schreibweise mit Bindestrich als auch die mit Schrägstrich.

Dieser Befehl setzt den 180-Tage-Timer der Testversion zurück, sofern Microsoft das Rearm für die installierte Evaluation-Edition zulässt.

:::info
Das Rearm setzt den Aktivierungstimer der Testversion zurück, soweit Microsoft das unterstützt. Es macht eine Evaluation-Edition nicht zu einer lizenzierten Produktionsedition.
:::

## 3. System neu starten

Um den Vorgang abzuschließen, starten Sie Ihren Server neu, damit die Änderungen wirksam werden. Ein Neustart ist nötig, damit das Rearm vollständig wirksam wird.

## 4. Status der Testversion prüfen

Prüfen Sie nach dem Neustart in PowerShell den verbleibenden Testzeitraum und die Anzahl der Rearms mit folgendem Befehl:

```powershell title="Status der Testversion prüfen"
slmgr -dlv
```

Dieser Befehl zeigt den detaillierten Status der Testversion an, einschließlich der verbleibenden Rearms und der Restzeit des Testzeitraums.

In der Ausgabe lesen Sie zwei Zeilen (englische Bezeichnungen; je nach Sprache der Installation kann die Ausgabe abweichen):

- **Remaining Windows rearm count** (verbleibende Anzahl an Rearms) zeigt, wie oft Sie `slmgr -rearm` noch ausführen können. Steht der Wert auf 0, lässt sich der Testzeitraum nicht noch einmal verlängern.
- **Timebased activation expiration** (zeitbasiertes Ablaufdatum) zeigt, wie viel Testzeit noch übrig ist.

## Was passiert, wenn die Windows-Server-Testversion abläuft?

Wenn der Testzeitraum endet und kein Rearm mehr übrig ist, zeigt Windows Server Aktivierungswarnungen an, und der Server kann von selbst herunterfahren. Wenn Ihr Server zu zufälligen Zeiten stoppt, prüfen Sie zuerst den Status mit `slmgr -dlv`. Der Artikel [Server stoppt zufällig](/de/docs/server-stops-randomly) behandelt diesen Fall.

Um einen Server produktiv zu betreiben, verwenden Sie eine passende Microsoft-Lizenz statt eines Rearms. Siehe [Windows-Lizenzierung](/de/docs/windows-licensing).

## Schritt 5: Optional — nur mit einem gültigen Lizenzschlüssel aktivieren

:::warn
Dieser Schritt gehört nicht zur Verlängerung des Testzeitraums. StealthRDP stellt keine Microsoft-Lizenzschlüssel und keine Windows-Lizenzen bereit. Der folgende Befehl ist ein Microsoft-Aktivierungsbefehl. Er bedeutet nicht, dass StealthRDP eine Lizenz liefert.
:::

Der folgende Microsoft-Befehl wird nur als technische Referenz angezeigt:

```powershell title="Aktivierung versuchen (Microsoft-Befehl)"
slmgr -ato
```

Dieser Microsoft-Befehl versucht die Aktivierung. Er bedeutet nicht, dass StealthRDP eine Lizenz bereitgestellt hat.

## Lizenzierung und Produktivbetrieb

Diese Schritte verlängern den Microsoft-Testzeitraum, soweit die installierte Evaluation-Edition das unterstützt. Sie aktivieren Windows nicht, liefern keine kommerzielle Lizenz und autorisieren keinen Produktivbetrieb. Für den Produktivbetrieb müssen Kunden eine passende Microsoft-Lizenz erwerben. StealthRDP stellt diese Lizenzierung nicht bereit.

Bei Problemen oder wenn Sie weitere Hilfe benötigen, wenden Sie sich an unser Support-Team.

Siehe [Windows-Lizenzierung](/de/docs/windows-licensing). StealthRDP stellt nur die Infrastruktur bereit und liefert keine Microsoft-Windows-Lizenzen. Kunden, die Windows nutzen, sind für ihre eigene Lizenzkonformität verantwortlich.

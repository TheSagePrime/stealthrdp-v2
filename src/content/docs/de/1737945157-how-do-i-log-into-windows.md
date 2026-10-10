---
order: 12
title: 'Remotedesktopverbindung einrichten: Windows-RDP vom PC, Mac oder Handy'
sidebarTitle: Mit RDP verbinden
category: Windows
date: Jan 27, 2025
sourceTitle: How do I log into Windows RDP?
sourceUrl: https://docs.stealthrdp.com/hc/stealth-rdp-docs/articles/1737945157-how-do-i-log-into-windows
migration:
  source: Verified StealthRDP documentation snapshot
  date: 2026-08-13
  redactions:
    - example endpoint placeholder redacted
summary: 'Remotedesktopverbindung einrichten: Verbinden Sie sich mit Ihrem Windows-VPS über Windows 10 oder 11, Mac, iPhone, iPad, Android oder Linux, mit IP-Adresse und Passwort aus Ihrer E-Mail.'
relatedSlugs:
  - 1737944563-how-to-re_activate-and-extend-your-180_day-windows-trial
translationOf: 1737945157-how-do-i-log-into-windows
locale: de
publishAt: 2026-10-12
primaryKeyword: remotedesktopverbindung einrichten
---
Bevor Sie die Remotedesktopverbindung einrichten, benötigen Sie drei Angaben aus der E-Mail, die StealthRDP nach der Zahlung sendet: die Server-IP-Adresse, den Benutzernamen (`Administrator`) und das Passwort. Wählen Sie danach den Abschnitt für Ihr Gerät.

## Windows 10 und Windows 11: Remotedesktopverbindung einrichten

Die **Remotedesktopverbindung** (Remote Desktop Connection) ist in Windows 10 und Windows 11 bereits enthalten.

### 1. Remotedesktopverbindung öffnen

Drücken Sie die **Windows-Taste**, geben Sie **Remotedesktopverbindung** ein und öffnen Sie das Programm. Alternativ drücken Sie **Windows + R**, geben `mstsc` ein und bestätigen mit der **Eingabetaste**.

### 2. Serveradresse eingeben

Geben Sie unter **Computer** die Server-IP-Adresse aus Ihrer E-Mail ein.

### 3. Verbinden und anmelden

Wählen Sie **Verbinden** (Connect). Wenn Windows nach Anmeldedaten fragt, wählen Sie **Weitere Optionen** (More choices) > **Anderes Konto verwenden** (Use a different account) und geben Sie danach `Administrator` und das Passwort ein.

### 4. Zertifikatswarnung bestätigen

Beim ersten Verbindungsaufbau zeigt Windows eine Zertifikatswarnung an. Wählen Sie **Ja** (Yes), um fortzufahren.

## Mac: Microsoft Remote Desktop (Windows App)

Für den RDP-Zugriff vom Mac verwenden Sie den kostenlosen Client von Microsoft. Microsoft nennt ihn jetzt **Windows App**; auf älteren Macs steht eventuell noch **Microsoft Remote Desktop**.

### 1. Windows App installieren

Installieren Sie **Windows App** aus dem Mac App Store.

### 2. Einen PC hinzufügen

Wählen Sie **+** > **PC hinzufügen** (Add PC).

### 3. PC-Daten eingeben

Tragen Sie unter **PC-Name** (PC name) die Server-IP-Adresse ein. Geben Sie außerdem als Benutzerkonto `Administrator` und Ihr Passwort ein.

### 4. Mit dem PC verbinden

Doppelklicken Sie auf den PC, um die Verbindung herzustellen. Bestätigen Sie die Zertifikatsabfrage bei der ersten Verbindung.

## iPhone, iPad und Android

Installieren Sie Microsofts **Windows App** (oder die ältere App **Remote Desktop**) aus dem App Store oder von Google Play. Fügen Sie einen PC mit der Server-IP-Adresse hinzu und melden Sie sich anschließend als `Administrator` mit Ihrem Passwort an. Mit einer Tastatur und einer Maus lassen sich Smartphone und Tablet bei längeren Sitzungen deutlich bequemer bedienen.

## Linux: Welcher RDP-Client sich eignet

Zwei gängige Clients sind in den Paketquellen der meisten Distributionen verfügbar:

- **Remmina**: ein grafischer Client. Legen Sie eine neue Verbindung an, wählen Sie das Protokoll **RDP** und geben Sie danach die IP-Adresse, `Administrator` und das Passwort ein.
- **FreeRDP**: ein Kommandozeilen-Client. Zum Beispiel:

```bash title="Mit FreeRDP verbinden"
xfreerdp /v:SERVER_IP /u:Administrator
```

Ersetzen Sie `SERVER_IP` durch die Adresse aus Ihrer E-Mail. FreeRDP fragt beim Verbinden nach dem Passwort.

## Wenn die Verbindung fehlschlägt

- Prüfen Sie, ob Sie IP-Adresse und Passwort genau und ohne Leerzeichen eingegeben haben.
- Warten Sie nach der Zahlung eine Minute. Die meisten Server sind innerhalb von 60 Sekunden nach der Zahlungsbestätigung betriebsbereit; zu Stoßzeiten kann es einige Minuten dauern.
- Ist der Server nach langer Zeit mit einer Windows-Server-Testversion gestoppt, lesen Sie [Windows-Server-Testversion neu aktivieren](/de/docs/how-to-re-activate-and-extend-your-180-day-windows-trial).
- Sie kommen nicht weiter? Kontaktieren Sie den Support über WhatsApp, ein Ticket im Kundenbereich oder per E-Mail. Der Support ist rund um die Uhr erreichbar.

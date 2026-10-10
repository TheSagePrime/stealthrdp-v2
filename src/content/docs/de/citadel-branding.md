---
order: 33
title: Eigene Challenge- und Fehlerseiten in Citadel
sidebarTitle: Challenge-Seiten anpassen
category: "Citadel: Protection"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/branding
summary: "Gestalten Sie eigene Fehlerseiten als HTML-Vorlagen für Challenge-, Sperr- und Fehlerseiten. Citadel liefert weiterhin die Schutzfunktionen."
relatedSlugs:
  - citadel-security
  - citadel-challenge-levels
  - citadel-allowlists
translationOf: citadel-branding
locale: de
publishAt: 2026-10-22
primaryKeyword: eigene fehlerseiten
---
## Anpassbare Challenge- und Fehlerseiten

Citadel unterstützt eigene visuelle HTML-Vorlagen für die „JS“-Challenge, die „Interaction“-Seite, die „Lockdown“-Seite, die Sperrseite (403), die Rate-Limit-Seite (429) sowie die Origin- und Gateway-Fehler 502, 503 und 504. Die „Cookie“-Challenge setzt stillschweigend ein Pass-Cookie und leitet weiter, daher gibt es für sie keine eigene Seite. Ein normaler Anwendungsfehler 500 eines funktionierenden Origins bleibt unverändert, so wie die Anwendung ihn zurückgibt.

## Eigene Fehlerseite speichern

1. Öffnen Sie die Seite „Branding“ der Domain und wählen Sie einen Seitentyp.
2. Fügen Sie HTML ein oder setzen Sie die Beispielvorlage ein. Optionale Platzhalter sind `{{BRAND}}` und `{{MESSAGE}}`.
3. Wählen Sie **„Save custom shell“**. Der Status wechselt zu „Custom“.
4. Verwenden Sie **„Restore this default“** oder **„Restore all defaults“**, um zu den Standardseiten von Citadel zurückzukehren.

Citadel fügt vor `</body>` die echten Proof-of-Work-Elemente, die Schaltfläche für die Mensch-Prüfung und die Statusanzeige ein.

:::warn
Fügen Sie kein eigenes Verifizierungsformular hinzu und senden Sie Lösungen nicht außerhalb von `/__l7/`.
:::

Beim Speichern entfernt Citadel externe `javascript:`-Attribut-URLs. Halten Sie Vorlagen unter etwa 150 KB; Inline-CSS und HTTPS-Bilder werden unterstützt. Das Branding ändert weder die Proof-of-Work-Schwierigkeit noch die Verifizierungsendpunkte.

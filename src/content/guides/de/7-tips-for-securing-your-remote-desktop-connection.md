---
order: 12
title: "RDP absichern: 7 Tipps für Remote Desktop"
sidebarTitle: Remote Desktop absichern
excerpt: "RDP absichern unter Windows: sieben Maßnahmen von der sicheren Aktivierung bis zu MFA, VPN, Gateway und NLA."
category: Remote Desktop
author: StealthRDP Team
date: 2025-06-11
readingTime: 17
image: https://assets.seobotai.com/cdn-cgi/image/quality=75,w=1536,h=1024/stealthrdp.com/6848cc1a5559d477e7526a0e-1749637212671.jpg
sources:
  - title: What's new in the Remote Desktop client for Windows
    url: https://learn.microsoft.com/en-us/previous-versions/remote-desktop-client/whats-new-windows
    publisher: Microsoft Learn
    accessedAt: 2026-10-09
  - title: Use features of the Remote Desktop client for Windows - Azure Virtual Desktop
    url: https://learn.microsoft.com/en-us/previous-versions/remote-desktop-client/client-features-windows-msrdc
    publisher: Microsoft Learn
    accessedAt: 2026-10-09
  - title: Configure Network Level Authentication for Remote Desktop Services Connections
    url: https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-r2-and-2008/cc732713(v=ws.11)
    publisher: Microsoft Learn
    accessedAt: 2026-10-09
  - title: RemoteDesktopServices Policy CSP
    url: https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-remotedesktopservices
    publisher: Microsoft Learn
    accessedAt: 2026-10-09
  - title: "One simple action you can take to prevent 99.9 percent of attacks on your accounts"
    url: https://www.microsoft.com/en-us/security/blog/2019/08/20/one-simple-action-you-can-take-to-prevent-99-9-percent-of-account-attacks/
    publisher: Microsoft Security Blog
    accessedAt: 2026-10-09
  - title: "Samsam infected thousands of LabCorp systems via brute force RDP"
    url: https://www.csoonline.com/article/565911/samsam-infected-thousands-of-labcorp-systems-via-brute-force-rdp.html
    publisher: CSO Online
    accessedAt: 2026-10-09
  - title: "Cybercriminals Abuse Remote Desktop Protocol (RDP) in 90% of Attacks Handled by Sophos Incident Response in 2023"
    url: https://www.sophos.com/en-us/press/press-releases/2024/04/cybercriminals-abuse-remote-desktop-protocol-rdp-90-attacks-handled
    publisher: Sophos
    accessedAt: 2026-10-09
  - title: "Widespread, Easily Exploitable Windows RDP Bug Opens Users to Data Theft"
    url: https://threatpost.com/windows-bug-rdp-exploit-unprivileged-users/177599/
    publisher: Threatpost
    accessedAt: 2026-10-09
  - title: "2026 Data Breach Investigations Report: Executive Summary"
    url: https://www.verizon.com/business/resources/executivebriefs/2026-dbir-executive-summary.pdf
    publisher: Verizon
    accessedAt: 2026-10-09
translationOf: 7-tips-for-securing-your-remote-desktop-connection
locale: de
publishAt: 2026-10-15
primaryKeyword: rdp absichern
---
**Angreifer nutzten RDP in 90 % der Cyberangriffe, die [Sophos](https://www.sophos.com/en-us/press/press-releases/2024/04/cybercriminals-abuse-remote-desktop-protocol-rdp-90-attacks-handled) im Jahr 2023 bearbeitet hat.** <a class="seo-article-citation" href="#source-7" aria-label="Source 7">[7]</a> Mit diesen 7 Tipps können Sie RDP absichern und Ihre Remote-Desktop-Verbindung vor Angriffen schützen:

1. **Starke Authentifizierung einrichten**: Verwenden Sie einzigartige, komplexe Passwörter und aktivieren Sie Multi-Faktor-Authentifizierung (MFA), um Brute-Force-Angriffe zu blockieren.
2. **[RDP-Software](/de) aktuell halten**: Installieren Sie regelmäßig Updates und Sicherheitspatches, um Schwachstellen zu schließen.
3. **Netzwerkzugriff kontrollieren**: Beschränken Sie den RDP-Zugriff auf vertrauenswürdige IP-Adressen, konfigurieren Sie Firewalls und ändern Sie den Standard-RDP-Port (3389).
4. **Ein VPN verwenden**: Verschlüsseln Sie Ihre Verbindung und blockieren Sie unbefugten Zugriff mit einem VPN.
5. **Ein RDP-Gateway einrichten**: Leiten Sie den Datenverkehr über ein gesichertes Gateway, um zusätzliche Verschlüsselung und Überwachung zu erhalten.
6. **Verschlüsselung und Tunnelung aktivieren**: Verwenden Sie Network Level Authentication (NLA) und SSH-Tunnelung, um Daten während der Übertragung zu schützen.
7. **Zero-Trust-Sicherheit anwenden**: Überprüfen Sie Benutzer fortlaufend, vergeben Sie nur die minimal nötigen Rechte und überwachen Sie Aktivitäten.

**Warum jetzt handeln?** RDP ist ein bevorzugtes Ziel für Hacker. Diese Maßnahmen bilden eine mehrschichtige Verteidigung, die Ihr System gegen sich ständig weiterentwickelnde Bedrohungen schützt.

## Alles Wichtige zur Absicherung von RDP in 30 Minuten (CCB Cyber Tips) [#everything-you-need-to-know-about-securing-rdp-in-30-minutes-ccb-cyber-tips]

<iframe class="sb-iframe" src="https://www.youtube.com/embed/-u2ZuGfixHM" frameborder="0" loading="lazy" allowfullscreen style="width: 100%; height: auto; aspect-ratio: 16/9;"></iframe>

## 1. Starke Authentifizierung einrichten [#1-set-up-strong-authentication]

Beim Schutz des Remote Desktop Protocol (RDP) ist starke Authentifizierung Ihre erste und wichtigste Verteidigungslinie. Schwache Passwörter machen Ihre Verbindung anfällig für automatisierte Angriffe, die Zugangsdaten knacken sollen. Mit stärkerer Authentifizierung verringern Sie das Risiko eines Einbruchs deutlich.

### Sichere und einzigartige Passwörter erstellen [#create-strong-and-unique-passwords]

Ihr Passwort ist das Tor zu Ihrer RDP-Verbindung, und schwache Passwörter sind bevorzugte Ziele von Brute-Force-Angriffen. Wählen Sie deshalb Passwörter mit mindestens 8 Zeichen, die Groß- und Kleinbuchstaben, Ziffern und Sonderzeichen kombinieren. Vermeiden Sie leicht zu erratende Wörter, persönliche Angaben und vorhersehbare Muster.

Ein wirksamer Ansatz ist eine Passphrase, die zufällige Wörter zu einem sicheren, aber gut merkbaren Passwort verbindet. Ein Beispiel wäre „Coffee!Mountain$Dance92“: Es ist stark und trotzdem leicht zu behalten. Ebenso wichtig: Verwenden Sie niemals dasselbe Passwort für mehrere Konten. Wird ein Konto kompromittiert, bleiben die anderen dank eindeutiger Passwörter sicher.

Mehrere starke Passwörter zu verwalten, kann schwierig sein. Ein Passwort-Manager speichert Ihre Zugangsdaten sicher, erzeugt komplexe Passwörter und vereinfacht die Anmeldung. So behalten Sie robuste Sicherheit, ohne sich unzählige Passwörter merken zu müssen.

Sobald Ihre Passwörter abgesichert sind, ergänzen Sie eine weitere Schutzebene mit Multi-Faktor-Authentifizierung.

### Multi-Faktor-Authentifizierung (MFA) aktivieren [#enable-multi-factor-authentication-mfa]

Starke Passwörter sind unverzichtbar, doch in Kombination mit Multi-Faktor-Authentifizierung (MFA) entsteht eine noch stärkere Abwehr. MFA verlangt eine zweite Form der Bestätigung und erschwert Angreifern den Zugang, selbst wenn sie Ihr Passwort kennen. Laut [Microsoft](https://www.microsoft.com/en-us/security/blog/2019/08/20/one-simple-action-you-can-take-to-prevent-99-9-percent-of-account-attacks/) kann MFA mehr als 99,9 % der Angriffe auf Konten verhindern. <a class="seo-article-citation" href="#source-5" aria-label="Source 5">[5]</a>

MFA-Optionen sind unter anderem Codes aus einer App, SMS-Nachrichten, Telefonanrufe, biometrische Verfahren oder Hardware-Token. Für mehr Komfort eignen sich Methoden mit wenig manueller Eingabe, etwa die Bestätigung per Anruf oder per App-Benachrichtigung. Wenn Sie zum Beispiel [Microsoft Entra ID](https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id) mit der NPS-Erweiterung für MFA nutzen, können Sie automatische Anrufe oder Push-Benachrichtigungen wählen, um den Ablauf zu vereinfachen.

Fehlendes MFA kann gravierende Folgen haben. Ein Beispiel ist der Ransomware-Vorfall bei [LabCorp](https://www.labcorp.com/): Im Juli 2018 verbreitete ein Brute-Force-Angriff auf RDP Ransomware auf 7.000 Systeme und 1.900 Server, bevor LabCorp den Vorfall innerhalb von 50 Minuten eindämmte, laut [CSO Online](https://www.csoonline.com/article/565911/samsam-infected-thousands-of-labcorp-systems-via-brute-force-rdp.html). <a class="seo-article-citation" href="#source-6" aria-label="Source 6">[6]</a> Das zeigt, wie entscheidend MFA ist, um solch schnelle und verheerende Angriffe zu verhindern.

Es gibt mehrere Wege, MFA in Ihre RDP-Umgebung einzubinden. Sie können Microsoft Entra ID mit einer NPS-Erweiterung, Lösungen von Drittanbietern, ein RDP-Gateway mit integrierter MFA oder ein VPN mit MFA-Unterstützung nutzen. Über die Sicherheit hinaus hilft MFA Organisationen auch, Compliance-Standards wie HIPAA, PCI DSS und die DSGVO (GDPR) zu erfüllen.

Um Ihr MFA-Setup weiter zu stärken, verwenden Sie TLS 1.2 oder höher und aktivieren Sie Network Level Authentication (NLA) für eine bessere Verschlüsselung. Protokollierung und Überwachung helfen außerdem, Zugriffsversuche nachzuvollziehen und verdächtige Aktivitäten zu erkennen.

## 2. Ihre RDP-Software aktuell halten [#2-keep-your-rdp-software-updated]

Veraltete Software gleicht einer unverschlossenen Haustür: Angreifer wissen genau, wo die Schwachstellen liegen. Ist Ihre RDP-Software nicht auf dem neuesten Stand, liefern Sie Cyberkriminellen praktisch eine Anleitung zur Ausnutzung. Aktuelle Sicherheitspatches sind daher entscheidend, denn Angreifer suchen ständig nach neuen Schwachstellen.

Die Risiken veralteter RDP-Software sind real. Ein Beispiel ist die im Januar 2022 entdeckte Schwachstelle CVE-2022-21893. Sie ermöglichte es einem Angreifer ohne erhöhte Rechte, auf die Dateisysteme anderer verbundener Benutzer zuzugreifen, laut [Threatpost](https://threatpost.com/windows-bug-rdp-exploit-unprivileged-users/177599/). <a class="seo-article-citation" href="#source-8" aria-label="Source 8">[8]</a> Dadurch konnten Daten aus der Zwischenablage und dem Dateisystem offengelegt werden, was zu Datenschutzverletzungen, unbefugten Bewegungen innerhalb von Netzwerken oder Rechteausweitung führen kann. Dieser Fall ist nur ein Beispiel dafür, warum Updates nicht optional, sondern unverzichtbar sind.

Über das Schließen von Sicherheitslücken hinaus stellen Updates auch sicher, dass Ihre Software moderne Verschlüsselungsprotokolle unterstützt. Ohne diese Updates kann selbst eine scheinbar sichere Verbindung gefährlich ungeschützt sein.

### Automatische Updates aktivieren [#turn-on-automatic-updates]

Der einfachste Weg, sicher zu bleiben? Aktivieren Sie automatische Updates. So werden Patches sofort nach ihrer Veröffentlichung eingespielt und das Zeitfenster für Angriffe bleibt minimal. Der Ablauf hängt vom verwendeten RDP-Client ab, das Ziel ist jedoch immer dasselbe: Ihre Software muss sicher sein.

Beim **[Microsoft Remote Desktop](https://www.microsoft.com/en-us/d/microsoft-remote-desktop/9wzdncrfj3ps) Client (MSI-Version)** prüfen Sie Updates manuell: Öffnen Sie die Anwendung Remote Desktop, klicken Sie oben rechts auf die drei Punkte und wählen Sie „Info“ (About). Der Client sucht dann nach Updates. Ist eines verfügbar, klicken Sie auf „Update installieren“ (Install update), um es anzuwenden.

Administratoren können die Update-Einstellungen über Registrierungswerte feinjustieren. Der Schlüssel `AutomaticUpdates` unter `HKLM\Software\Microsoft\MSRDC\Policies` legt fest, wie Updates behandelt werden:

- **Wert 0**: Schaltet automatische Updates und Benachrichtigungen vollständig aus.
- **Wert 1**: Aktiviert Benachrichtigungen, die Installation erfordert jedoch eine Aktion des Benutzers.
- **Wert 2** (Standard): Bei Installationen pro Benutzer werden Updates im Hintergrund still installiert, sobald der Client geschlossen ist. Benachrichtigungen erscheinen nur, während er läuft. Bei Installationen pro Computer gibt es nur Benachrichtigungen. <a class="seo-article-citation" href="#source-2" aria-label="Source 2">[2]</a>

Die **Microsoft-Remote-Desktop-App aus dem Microsoft Store** wird nicht mehr unterstützt: Der Support endete im September 2025, und die App ist nicht mehr zum Herunterladen oder Installieren verfügbar. Microsofts Nachfolger für Verbindungen zu Azure Virtual Desktop und Windows 365 ist **Windows App**. Verbindungen zu Remote Desktop Services und Remote-PCs sind von dieser Änderung nicht betroffen. Außerdem hat Microsoft den Support für den MSI-Client in öffentlichen Cloud-Umgebungen am 27. März 2026 eingestellt. <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a>

Ein Vorteil der in Windows integrierten RDP-Funktion ist, dass Updates Teil der regulären Windows-Updates sind. So erhalten Sie zusätzliche Sicherheit ohne weiteren Aufwand.

### Drittanbieter-RDP-Clients prüfen [#check-third-party-rdp-clients]

Für RDP-Clients von Drittanbietern gelten dieselben Regeln: Stellen Sie sicher, dass sie aktuell und unterstützt sind. Anders als native RDP-Software bieten viele Clients von Drittanbietern keine automatischen Updates. Sie müssen deshalb manuell prüfen, ob Sie die neueste Version nutzen. Nicht unterstützte oder veraltete Software erhält keine Sicherheitspatches, sodass bekannte Schwachstellen dauerhaft offen bleiben.

Achten Sie bei der Auswahl von RDP-Clients auf moderne Sicherheitsstandards. Suchen Sie nach Funktionen wie der Unterstützung aktueller Verschlüsselungsprotokolle und Network Level Authentication. Ältere oder schlecht gepflegte Clients bieten diesen wichtigen Schutz oft nicht und gefährden Ihr System.

Um das Risiko zu verringern, begrenzen Sie die Anzahl der RDP-Clients in Ihrer Umgebung. Ein einziger, gut gepflegter Client vereinfacht das Update-Management und verkleinert die möglichen Angriffspunkte. Werden Schwachstellen in Drittanbieter-Clients bekannt, patchen Sie zuerst jene, für die bereits öffentliche Exploits existieren. Diese sind besonders gefährlich, weil Angreifer die nötigen Werkzeuge bereits besitzen.

## 3. Netzwerkzugriff mit Firewall-Regeln kontrollieren [#3-control-network-access-with-firewall-rules]

Eine Firewall, die unbefugte [RDP-Verbindungen](https://dash.stealthrdp.com/index.php?rp=/login) blockiert, ist ein entscheidender Schritt zur Absicherung Ihres Netzwerks. Eine starke Firewall-Konfiguration bietet eine wichtige Schutzschicht für RDP-Dienste. Laut [Sophos](https://www.sophos.com/en-us/press/press-releases/2024/04/cybercriminals-abuse-remote-desktop-protocol-rdp-90-attacks-handled) und seinen Daten aus der Reaktion auf Sicherheitsvorfälle war **RDP-Missbrauch 2023 in 90 % der von Sophos bearbeiteten Angriffe beteiligt**.

> Unternehmen sollten RDP aus dem öffentlichen Internet entfernen, um das Risiko zu verringern, ins Visier von Cyberkriminellen zu geraten.
>
> – Ryan Gregory, Coalition

Firewalls können den Zugriff auf Remote-Desktop-Ports wie den Standard-TCP-Port 3389 begrenzen. Mit der richtigen Konfiguration blockieren Sie unbefugten externen Datenverkehr und erlauben gleichzeitig genehmigten Benutzern die Verbindung zu Ihrem Netzwerk.

### Zugriff nur von vertrauenswürdigen IP-Adressen erlauben [#allow-access-from-trusted-ips-only]

Den RDP-Zugriff auf bestimmte IP-Adressen oder Netzwerksegmente zu beschränken, verkleinert Ihre Angriffsfläche erheblich. So konfigurieren Sie das in der Windows-Firewall:

- Öffnen Sie **Windows-Sicherheit** (Windows Security) und wechseln Sie zu **Firewall- und Netzwerkschutz &gt; Erweiterte Einstellungen**.
- Suchen Sie die Regel „Remotedesktop – Benutzermodus (TCP eingehend)“ (Remote Desktop – User Mode (TCP-In)) und bearbeiten Sie sie so, dass nur autorisierte IP-Adressen zugelassen werden.

Um festzustellen, welche externen IP-Adressen Zugriff haben sollten, verwenden Sie ein IP-Prüftool.

Überprüfen Sie Ihre Liste vertrauenswürdiger IP-Adressen regelmäßig, denn Netzwerkkonfigurationen ändern sich mit der Zeit. RDP-Ports dem gesamten Internet zu öffnen, ist niemals ratsam. Diese Kombination aus IP-Filterung und sorgfältiger Überwachung bildet eine solide Grundlage für Ihr Sicherheitskonzept.

### Den Standard-RDP-Port ändern [#change-the-default-rdp-port]

Eine weitere wirksame Maßnahme ist die Änderung des Standard-RDP-Ports (3389). Das ersetzt andere Sicherheitsmaßnahmen nicht, kann aber die Gefahr durch automatisierte Scans verringern. Experten empfehlen, einen Port zwischen **49152 und 65535** zu wählen, um Konflikte mit anderen Diensten zu vermeiden.

So ändern Sie den RDP-Port:

#### Mit dem Registrierungs-Editor [#using-the-registry-editor]

1. Öffnen Sie den **Registrierungs-Editor** (Registry Editor).
2. Navigieren Sie zu:

   `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp`
3. Suchen Sie den Eintrag `PortNumber`, doppelklicken Sie darauf, wählen Sie **Dezimal** und geben Sie Ihre neue Portnummer ein.
4. Klicken Sie auf **OK** und starten Sie den Remotedesktopdienst (oder Ihren Computer) neu, damit die Änderungen wirksam werden.

#### Mit PowerShell [#using-powershell]

- Prüfen Sie den aktuellen Port mit:

  `Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "PortNumber"`
- Aktualisieren Sie den Port mit:

  `Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "PortNumber" -Value <new_port>`
- Fügen Sie Firewall-Regeln für den neuen Port hinzu:

  ```powershell title="PowerShell"
  New-NetFirewallRule -DisplayName "RDP New Port TCP" -Profile Public -Direction Inbound -Action Allow -Protocol TCP -LocalPort <new_port>  
  New-NetFirewallRule -DisplayName "RDP New Port UDP" -Profile Public -Direction Inbound -Action Allow -Protocol UDP -LocalPort <new_port>  
  ```

Erstellen Sie nach der Portänderung eine passende eingehende Regel in der Windows-Firewall. Testen Sie den neuen Port, indem Sie sich im Format `IP-Adresse:neuer_Port` verbinden (z. B. `192.168.1.1:33091`), und prüfen Sie die Aktivität mit diesem Befehl:

```
netstat -an | find "<new_port>"
```

### Mit NAT eine zusätzliche Schutzebene schaffen [#add-an-extra-layer-with-nat]

Network Address Translation (NAT) ist eine weitere Option, Ihr RDP-Setup abzusichern. Mit NAT können Sie einen externen Port auf Ihren internen RDP-Port abbilden. Das ergänzt die Verschleierung und erschwert Angreifern das Auffinden Ihrer Verbindung. In Kombination mit Firewall-Regeln stärkt dieser Ansatz Ihre gesamte [RDP-Sicherheitsstrategie](/de/docs).

## 4. Ein VPN für sicheren Fernzugriff nutzen [#4-use-a-vpn-for-secure-remote-access]

Ein VPN baut einen verschlüsselten Tunnel zwischen Ihrem Gerät und dem Netzwerk auf, sodass abgefangene Daten unlesbar bleiben. Eine VPN-Verbindung vor dem Start Ihrer RDP-Sitzung bietet zusätzlichen Schutz vor Cyberangriffen. So richten Sie den VPN-Zugang für Ihre Remote-Desktop-Verbindung ein.

### VPN-Zugang für RDP einrichten [#setting-up-vpn-access-for-rdp]

**Die passende VPN-Lösung wählen**

Für den VPN-Zugang stehen zwei Hauptoptionen zur Verfügung. Fertige VPN-Lösungen wie [OpenVPN](https://openvpn.net/), [TunnelBear](https://www.tunnelbear.com/) und [Proton VPN](https://protonvpn.com/?srsltid=AfmBOor8HXnCA2hWvi-oC3wu6rVy1Ltz7ADWnMJHp-JWc0hanxkEcfgA) sind häufig ohne großen Konfigurationsaufwand mit RDP kompatibel. Manche Dienste benötigen jedoch spezielle Anpassungen, damit alles reibungslos läuft.

**Einen eigenen VPN-Server einrichten**

Wenn Sie mehr Kontrolle über Ihre Sicherheit möchten, ist ein eigener VPN-Server eine gute Wahl. Sie können dann Verschlüsselungseinstellungen anpassen, den Benutzerzugriff steuern und maßgeschneiderte Sicherheitsmaßnahmen umsetzen. Wählen Sie dafür einen VPS-Anbieter, der die VPN-Installation unterstützt, etwa [DigitalOcean](https://www.digitalocean.com/), [Linode](https://www.linode.com/) oder [AWS](https://aws.amazon.com/). Die Einrichtung umfasst in der Regel folgende Schritte:

- Verbindung zu Ihrem VPS per SSH herstellen.
- VPN-Server-Software wie OpenVPN installieren.
- Den Zugriff für Ihre Geräte konfigurieren.

Wählen Sie beim Einrichten des Servers einen Standort nahe Ihrer Zielregion, um die Leistung zu verbessern. Verwenden Sie stets starke Verschlüsselung, etwa AES-256-Bit, um Ihre Daten zu schützen.

**Wichtige Sicherheitskonfigurationen**

Sobald Ihr VPN läuft, sollten Sie folgende Schritte zur weiteren Absicherung umsetzen:

- Aktivieren Sie die Zwei-Faktor-Authentifizierung (2FA) für alle VPN-Sitzungen.
- Beschränken Sie den VPN-Zugriff auf autorisierte Geräte.
- Passen Sie Ihre Firewall-Regeln so an, dass sie reibungslos mit dem VPN zusammenarbeiten und unbefugten Zugriff blockieren.
- Nutzen Sie Werkzeuge wie [Fail2Ban](https://en.wikipedia.org/wiki/Fail2ban), deaktivieren Sie den Root-Login und überwachen Sie Protokolle regelmäßig auf ungewöhnliche Aktivitäten.
- Ändern Sie die Standardports, damit Ihr VPN-Server für Angreifer schwerer zu finden ist.

**Mit dem VPN verbinden**

## 5. Ein RDP-Gateway einrichten [#5-set-up-an-rdp-gateway]

Ein RDP-Gateway ist ein wichtiger Kontrollpunkt und erhöht die Sicherheit Ihres Netzwerks. Es stellt sicher, dass jeder externe Zugriff auf interne Systeme streng kontrolliert wird: Es authentifiziert Benutzer und verschlüsselt den Datenverkehr, bevor der Zugriff auf bestimmte Ressourcen gewährt wird.

### So verbessern RDP-Gateways die Sicherheit [#how-rdp-gateways-enhance-security]

RDP-Gateways leiten den Remote-Desktop-Datenverkehr über HTTPS auf Port 443 statt über den Standard-RDP-Port 3389. Da RDP über HTTPS getunnelt wird, sind sensible Daten vor Man-in-the-Middle-Angriffen geschützt, während Ihr internes Netzwerk abgeschirmt bleibt. Benutzer können nur auf autorisierte Ressourcen zugreifen, was Schwachstellen deutlich reduziert.

> RD Gateway kapselt das Remote Desktop Protocol (RDP) in RPC, das wiederum in HTTP über eine SSL-Verbindung (Secure Sockets Layer) eingebettet ist. – Microsoft

Ein weiterer Vorteil ist die zentrale Authentifizierung und Protokollierung. Das Gateway erfasst und überwacht jeden Verbindungsversuch, was die Nachverfolgung von Benutzeraktivitäten erleichtert und ungewöhnliches Verhalten sichtbar macht. Für maximale Sicherheit ist es wichtig, die Gateway-Richtlinien korrekt zu konfigurieren.

### Tipps für die richtige Gateway-Konfiguration [#tips-for-proper-gateway-configuration]

Um Ihr RDP-Gateway optimal zu nutzen, richten Sie **Connection Authorization Policies (CAP)** und **Resource Authorization Policies (RAP)** ein:

- **CAP-Richtlinien**: Sie legen fest, wer sich verbinden darf. Sie können beispielsweise Konten nach mehreren fehlgeschlagenen Anmeldeversuchen sperren oder den Zugriff auf bestimmte IP-Bereiche beschränken. So können nur vertrauenswürdige Geräte Verbindungen aufbauen.
- **RAP-Richtlinien**: Sie steuern, auf welche Ressourcen Benutzer nach der Verbindung zugreifen dürfen. Nach dem Prinzip der minimalen Berechtigung beschränken Sie den Zugriff auf die Ressourcen, die jeder Benutzer tatsächlich braucht. So verringern Sie den Schaden, falls ein Konto kompromittiert wird.

Weitere wichtige Schritte sind:

- **MFA aktivieren**: Multi-Faktor-Authentifizierung für den Gateway-Zugang erhöht die Sicherheit deutlich.
- **Vertrauenswürdige SSL-Zertifikate verwenden**: Beziehen Sie Zertifikate von anerkannten Anbietern wie [DigiCert](https://www.digicert.com/), [GlobalSign](https://www.globalsign.com/en) oder [Let's Encrypt](https://letsencrypt.org/). Erzwingen Sie TLS 1.2 oder höher, deaktivieren Sie schwache Verschlüsselungsalgorithmen und erneuern Sie Zertifikate regelmäßig, um sichere Verbindungen zu gewährleisten.
- **Zugriff beschränken**: Erlauben Sie nach der Bereitstellung nur bestimmten Benutzern und Systemen den Zugriff. Stellen Sie sicher, dass alle Remote-Desktop-Dienste Verbindungen ausschließlich über das RD-Gateway annehmen.
- **Protokolle überwachen**: Protokollieren Sie alle Verbindungsversuche und prüfen Sie diese regelmäßig auf Auffälligkeiten.

> Der RD-Gateway-Server fungiert als Vermittler zwischen dem Remote-Client und dem RDSH. Er authentifiziert den Benutzer und verschlüsselt den Datenverkehr und bietet so eine zusätzliche Sicherheitsebene. – Limitless Technology

## 6. Verschlüsselung und Tunnelung hinzufügen [#6-add-encryption-and-tunneling]

Um Ihre Sitzungen mit dem Remote Desktop Protocol (RDP) vor unbefugtem Abfangen oder Mitlesen zu schützen, sind Verschlüsselungs- und Tunneltechnologien unverzichtbar. Mit mehreren Verschlüsselungsschichten entsteht ein starker Schutz gegen Abhörversuche und Angriffe. Ein wichtiger Schritt dafür ist die Stärkung der Authentifizierung, etwa durch die Aktivierung von Network Level Authentication (NLA).

### Network Level Authentication (NLA) aktivieren [#turn-on-network-level-authentication-nla]

Network Level Authentication (NLA) bietet zusätzlichen Schutz, indem Benutzer sich *bevor* eine Remote-Desktop-Sitzung beginnt authentifizieren müssen. Unbefugte erreichen so nicht einmal den Anmeldebildschirm, was NLA zu einer wichtigen Sicherheitsbarriere macht.

NLA verringert Risiken wie Brute-Force-Angriffe, Denial-of-Service-(DoS)-Versuche und den Diebstahl von Zugangsdaten während des Verbindungsaufbaus. Außerdem verbessert es die Ressourceneffizienz, da unbefugte Versuche keinen Arbeitsspeicher und keine CPU des Servers beanspruchen. Für berechtigte Benutzer unterstützt NLA das NT-Single-Sign-On (SSO) und macht den Zugriff komfortabler.

Aktivieren Sie NLA für maximale Sicherheit immer bei Ihren RDP-Verbindungen. Falls Kompatibilitätsprobleme dazu zwingen, NLA zu deaktivieren, gleichen Sie das unbedingt durch andere Schutzmaßnahmen aus, etwa starke Passwörter, konfigurierte Firewalls und strikte Zugriffskontrollen.

### SSH- oder IPSec-Tunnelung verwenden [#use-ssh-or-ipsec-tunneling]

Die SSH-Tunnelung ist eine weitere wirksame Methode, Ihre RDP-Sitzungen abzusichern. Indem Sie den RDP-Datenverkehr in einen verschlüsselten SSH-Tunnel packen, erhalten Sie zusätzlichen Schutz bei der Übertragung.

[CloudThat](https://www.cloudthat.com/), ein AWS- und Microsoft-Partner, hat eine Anleitung veröffentlicht, wie Sie RDP-Zugriff über einen SSH-Tunnel mit [PuTTY](https://www.putty.org/) einrichten. Der Schritt-für-Schritt-Prozess umfasst:

- PuTTY mit Ihren SSH-Serverdaten konfigurieren (z. B. Hostname, Port 22, SSH-Verbindung).
- Tunnelung einrichten, um einen lokalen Port (z. B. 127.0.0.1:9999) an den internen RDP-Port (localhost:3389) weiterzuleiten.
- Die SSH-Sitzung aktiv halten und sich per RDP über „localhost:9999“ verbinden.

Chrissy LeMaire, SQL- und PowerShell-MVP, formuliert es so:

> Wenn Sie unsichere Protokolle dem Netz ausgesetzt haben, sollten Sie sie in die sichere Obhut von SSH nehmen.

Verwenden Sie für mehr Sicherheit nicht standardmäßige SSH-Ports und eigene interne Portweiterleitungen, damit Ihr Setup weniger vorhersehbar ist. Da OpenSSH inzwischen in Windows 10 integriert ist, lässt sich diese Methode heute noch einfacher umsetzen. Sie können den Ansatz außerdem mit einem Bastion-Host oder Jump-Server erweitern. Er dient als zusätzlicher Kontrollpunkt und steuert den Zugriff auf sensible Ressourcen in Ihrem geschützten Netzwerk. Diese mehrschichtige Tunnelstrategie stärkt Ihre RDP-Sicherheit deutlich.

## 7. Zero-Trust-Sicherheitsprinzipien anwenden [#7-apply-zero-trust-security-principles]

Bei moderner RDP-Sicherheit reichen Verschlüsselung und kontrollierter Zugriff allein nicht aus. Um interne Risiken wirklich zu adressieren, ist ein Zero-Trust-Ansatz unverzichtbar. Dieses Modell folgt einer einfachen, aber wirksamen Regel: **„Never trust, always verify“** (Niemals vertrauen, immer überprüfen).

Zero Trust ist für RDP-Verbindungen besonders wichtig, weil kompromittierte Zugangsdaten ein häufiger Weg in Remote-Systeme sind. Anders als klassische Sicherheitsmodelle, die sich auf den Schutz von Netzwerkgrenzen verlassen, verlangt Zero Trust, dass sich jeder Benutzer und jedes Gerät unabhängig vom Standort ausweist.

### Grundprinzipien von Zero Trust [#core-principles-of-zero-trust]

Zero Trust stärkt die RDP-Sicherheit auf Grundlage dreier Prinzipien:

| Grundprinzip | Beschreibung |
| --- | --- |
| **Kontinuierlich überprüfen** | Kein Benutzer und kein Gerät ist standardmäßig vertrauenswürdig. Die Überprüfung läuft fortlaufend und passt sich dynamisch an Echtzeit-Risiken an. |
| **Den Wirkungsradius begrenzen** | Minimieren Sie den möglichen Schaden eines Einbruchs, indem Sie die Bewegungsmöglichkeiten eines Angreifers im Netzwerk einschränken. |
| **Kontextdaten automatisch erfassen und reagieren** | Sammeln Sie Daten aus Ihrer gesamten IT-Umgebung und automatisieren Sie die Reaktion auf Bedrohungen in Echtzeit. |

Wenn Sie diese Prinzipien anwenden, verbessern Sie Ihre RDP-Sicherheit deutlich.

### Fortlaufende Überprüfung verlangen [#require-ongoing-verification]

Klassische RDP-Setups authentifizieren Benutzer nur bei der Anmeldung. Zero Trust geht einen Schritt weiter und verlangt eine kontinuierliche Authentifizierung und Validierung während der gesamten Sitzung. So wird jede Aktion auch innerhalb einer aktiven Sitzung überwacht und überprüft.

Stellen Sie sich einen Benutzer vor, der normalerweise aus New York arbeitet und plötzlich sensible Dateien von einer unbekannten IP-Adresse herunterlädt. Ein Zero-Trust-System würde diese Aktivität erkennen und eine zusätzliche Überprüfung anfordern. So lassen sich Bedrohungen stoppen, bevor sie eskalieren.

### Minimal notwendige Rechte vergeben [#give-minimum-required-access]

Ein weiterer Grundpfeiler von Zero Trust ist das Prinzip der minimalen Rechte (Least Privilege). Benutzer und Anwendungen sollten nur auf die Ressourcen zugreifen dürfen, die sie für ihre Aufgaben tatsächlich benötigen. Hubert Brychczynski formuliert es so:

> Zero Trust bedeutet, dass jede Person in der Organisation ein potenzieller Angriffsvektor sein kann, ob absichtlich oder nicht.

Um das Prinzip der minimalen Rechte umzusetzen:

- Beschränken Sie den Zugriff auf die Ressourcen, die für die Rolle jedes Benutzers nötig sind.
- Entfernen Sie übermäßige oder ungenutzte Berechtigungen.
- Halten Sie die Zahl privilegierter Konten auf ein Minimum.
- Stellen Sie sicher, dass NTFS- und Freigabeberechtigungen dem Least-Privilege-Prinzip entsprechen.

Nutzen Sie Werkzeuge wie [Active Directory](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview) und Microsoft-Entra-ID-Gruppen, um Zugriffsrechte zentral zu verwalten und zu kontrollieren. Beschränken Sie den RDP-Zugriff auf eine vorab genehmigte Liste von IP-Adressen und Benutzerkonten. Verhindern Sie außerdem direkten RDP-Zugriff aus externen Netzwerken, indem Sie als ersten Schritt eine VPN-Verbindung verlangen.

Um potenzielle Einbrüche weiter einzudämmen, setzen Sie auf **Mikrosegmentierung**. Dabei teilen Sie Ihre Infrastruktur in kleinere Segmente auf, was die seitliche Bewegung von Angreifern im Netzwerk einschränkt. Kombinieren Sie dies mit Least-Privilege-Richtlinien und der kontinuierlichen Überwachung des gesamten Netzwerkverkehrs, um den Überblick zu behalten und Bedrohungen früh zu erkennen.

## Wie Sie Remote Desktop unter Windows sicher aktivieren [#how-to-enable-remote-desktop-safely-on-windows]

:::info

Alle oben genannten Tipps setzen voraus, dass Remote Desktop nur dort aktiviert ist, wo Sie es wirklich brauchen. Windows 10 und Windows 11 Pro, Enterprise und Education können RDP-Verbindungen annehmen. Die Home-Editionen können keine Sitzung hosten. Es gibt drei gängige Wege, Remote Desktop einzuschalten. Welchen Sie auch wählen: Lassen Sie Network Level Authentication aktiviert und beschränken Sie, wer sich verbinden darf.

:::

### Remote Desktop in den Windows-11-Einstellungen erlauben [#allow-remote-desktop-in-windows-11-settings]

Auf einem einzelnen Rechner öffnen Sie **Einstellungen → System → Remotedesktop** (Settings → System → Remote Desktop) und schalten **Remotedesktop** ein. Lassen Sie die Option **Geräte müssen zum Herstellen einer Verbindung Network Level Authentication verwenden** (Require devices to use Network Level Authentication to connect) aktiviert. Fügen Sie anschließend unter **Remotedesktopbenutzer** (Remote Desktop users) nur die Konten hinzu, die Zugriff benötigen. Administratoren können standardmäßig eine Verbindung herstellen.

### Remote Desktop mit PowerShell aktivieren [#enable-remote-desktop-with-powershell]

Auf einem Server oder einem entfernten Rechner ist PowerShell schneller. Führen Sie diese Befehle in einer Sitzung mit erhöhten Rechten aus. Der erste erlaubt RDP-Verbindungen, der zweite öffnet die integrierten Firewall-Regeln für Remote Desktop:

```powershell title="PowerShell"
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name "fDenyTSConnections" -Value 0
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
```

Schränken Sie diese Firewall-Regeln anschließend auf vertrauenswürdige Adressen ein, wie in Tipp 3 beschrieben, statt Port 3389 dem Internet offenzulassen.

### Remote Desktop per Gruppenrichtlinie aktivieren [#use-group-policy-to-enable-remote-desktop]

In Domänen mit vielen Rechnern empfiehlt sich die Gruppenrichtlinie. Öffnen Sie im Gruppenrichtlinien-Editor den Pfad **Computerkonfiguration → Administrative Vorlagen → Windows-Komponenten → Remotedesktopdienste → Remotedesktop-Sitzungshost → Verbindungen** (Computer Configuration → Administrative Templates → Windows Components → Remote Desktop Services → Remote Desktop Session Host → Connections). Aktivieren Sie dort **Benutzern das Herstellen von Remoteverbindungen mithilfe von Remotedesktopdiensten erlauben**. Aktivieren Sie im selben Zweig unter **Sicherheit** die Option **Benutzerauthentifizierung für Remoteverbindungen mithilfe von Network Level Authentication erforderlich**. <a class="seo-article-citation" href="#source-3" aria-label="Source 3">[3]</a> <a class="seo-article-citation" href="#source-4" aria-label="Source 4">[4]</a> Kombinieren Sie die Richtlinie mit einer Firewall-Regel, die nur Ihr Verwaltungsnetz oder VPN-Netz zulässt.

Wenn Sie Windows auf einem [Windows-VPS](/de/windows-vps) betreiben, gelten dieselben Schritte. Ändern Sie das Administratorpasswort bei der ersten Anmeldung und beschränken Sie RDP auf die Adressen, von denen Sie sich verbinden.

## Fazit: RDP absichern [#conclusion-secure-your-rdp-connection]

Das Remote Desktop Protocol (RDP) ist ein wichtiges Werkzeug, bringt aber erhebliche Sicherheitsrisiken mit sich. Da RDP-Missbrauch 2023 in 90 % der von Sophos bearbeiteten Angriffe eine Rolle spielte, sind die sieben Maßnahmen dieses Leitfadens unverzichtbar, um sich gegen immer raffiniertere Bedrohungen zu verteidigen.

Aktuelle Zahlen unterstreichen die Dringlichkeit: Der [Verizon 2026 Data Breach Investigations Report](https://www.verizon.com/business/resources/executivebriefs/2026-dbir-executive-summary.pdf) stellt fest, dass der menschliche Faktor 2026 in 62 % der Datenpannen eine Rolle spielte, nach 60 % im Vorjahr. <a class="seo-article-citation" href="#source-9" aria-label="Source 9">[9]</a> Die gute Nachricht: Viele dieser Vorfälle lassen sich mit den richtigen Vorkehrungen und etwas Aufmerksamkeit vermeiden.

Wenn Sie zentrale Maßnahmen kombinieren, schaffen Sie mehrere Schutzschichten für Ihren Fernzugriff. Jeder Schritt stärkt Ihre Verteidigung:

- **Starke Authentifizierung** stoppt Brute-Force-Angriffe von vornherein.
- **Regelmäßige Updates** beseitigen Schwachstellen, die Angreifer häufig ausnutzen.
- **Firewalls und VPNs** sorgen für sichere, private Verbindungen.
- **RDP-Gateways** bieten eine zusätzliche Schutzschicht auf Unternehmensniveau.
- **Verschlüsselung** hält Ihre Daten für Unbefugte unlesbar.
- **Zero-Trust-Prinzipien** überprüfen jeden Zugriffsversuch und verzichten auf blindes Vertrauen.

Die Bedrohungslage entwickelt sich rasant. Die Gefahren reichen von klassischen Viren bis zu fortgeschrittenen Angriffen mit Phishing, Malware und sogar KI-gestützten Werkzeugen. Ransomware-Angriffe, befeuert durch den Aufstieg von Ransomware-as-a-Service-Anbietern, werden komplexer und teurer.

Kombiniert ergeben diese bewährten Methoden ein mehrschichtiges Verteidigungssystem, das Angreifern deutlich schwerer zusetzt. Eine starke Kombination aus Multi-Faktor-Authentifizierung, Software-Updates, sicheren Netzwerkkonfigurationen und Zero-Trust-Prinzipien macht Ihr RDP-Setup zu einer Festung, die selbst ausgefeilten Angriffen standhält.

Warten Sie nicht und sichern Sie Ihre RDP-Verbindung jetzt ab. Überprüfen und aktualisieren Sie Zugriffsrechte regelmäßig, überwachen Sie Benutzeraktivitäten auf ungewöhnliche Muster und schulen Sie Ihr Team zu Sicherheitsrichtlinien, neuen Bedrohungen und dem Erkennen von Phishing-Versuchen. Wenn Sie diese Maßnahmen konsequent anwenden, bleiben Sie Angreifern einen Schritt voraus und schützen Ihre Organisation vor heutigen und künftigen Bedrohungen.

## FAQs [#faqs]

<h3 id="why-does-changing-the-default-rdp-port-improve-security-against-cyberattacks" data-faq-q>Warum verbessert das Ändern des Standard-RDP-Ports die Sicherheit gegen Cyberangriffe?</h3>

<h2 id="changing-the-default-rdp-port">Das Ändern des Standard-RDP-Ports</h2>

Wenn Sie den Standard-Port des Remote Desktop Protocol (RDP) von **3389** auf einen nicht standardmäßigen Port umstellen, wird es für Angreifer schwerer, Ihren Remote-Desktop-Dienst zu finden und anzugreifen. Da Port 3389 weithin bekannt und häufig von automatisierten Werkzeugen gescannt wird, verringert die Änderung die Sichtbarkeit Ihrer RDP-Verbindung. Brute-Force-Angriffe und unbefugte Zugriffsversuche werden dadurch weniger wahrscheinlich.

Dieser Ansatz, oft als „Sicherheit durch Verschleierung“ (security through obscurity) bezeichnet, sollte nicht Ihre einzige Verteidigungslinie sein. In Kombination mit Firewalls, starken Passwörtern und Multi-Faktor-Authentifizierung erhöht er jedoch den Schutz Ihres Systems.

<h3 id="why-should-i-use-a-vpn-with-remote-desktop-and-how-does-it-enhance-security" data-faq-q>Warum sollte ich ein VPN mit Remote Desktop nutzen, und wie erhöht es die Sicherheit?</h3>

Ein **VPN** in Verbindung mit Remote Desktop bietet eine starke Schutzschicht, weil es Ihre Verbindung verschlüsselt. Diese Verschlüsselung schützt Ihre Daten vor Abhören und unbefugtem Zugriff und sichert den RDP-Datenverkehr, während er durch ein privates Netzwerk läuft. Das verringert das Risiko von Cyberbedrohungen wie Hacking oder Abhören deutlich.

Ein weiterer Vorteil eines VPN ist, dass es Ihre IP-Adresse verbirgt und so zusätzliche Privatsphäre bietet. Dadurch wird es für Angreifer deutlich schwerer, Ihr System zu finden oder anzugreifen. Mit einem VPN in Kombination mit RDP greifen Sie sicher auf sensible Informationen zu und schützen Ihre Daten und Ihre Privatsphäre. Das ist ein kluger und wirksamer Weg, Remote-Verbindungen zu sichern.

<h3 id="what-is-zero-trust-security-and-how-does-it-help-protect-remote-desktop-protocol-rdp-connections" data-faq-q>Was ist Zero-Trust-Sicherheit, und wie schützt sie RDP-Verbindungen?</h3>

Zero Trust ist ein Sicherheitsmodell, das für jeden Benutzer und jedes Gerät, das auf ein System zugreifen will, eine strikte Identitätsprüfung verlangt, unabhängig davon, ob es sich innerhalb oder außerhalb des Unternehmensnetzwerks befindet. Es folgt dem Prinzip „Never trust, always verify“ (Niemals vertrauen, immer überprüfen) und stellt sicher, dass niemand automatisch Vertrauen genießt.

Bei RDP-Verbindungen hebt Zero Trust die Sicherheit auf die nächste Stufe, indem es Benutzeridentitäten fortlaufend überprüft und sicherstellt, dass Geräte Compliance-Standards erfüllen. Der Zugriff wird strikt nach dem Prinzip der minimalen Rechte (Least Privilege) gesteuert: Benutzer erhalten nur Zugriff auf die Ressourcen, die sie für ihre konkreten Aufgaben benötigen. Auch nach der Anmeldung wird ihre Aktivität eng überwacht, um unbefugten Zugriff und seitliche Bewegungen im Netzwerk zu erkennen und zu verhindern. Das verringert potenzielle Schwachstellen deutlich und stärkt die Abwehr gegen Cyberbedrohungen, die Remote-Desktop-Umgebungen ins Visier nehmen.

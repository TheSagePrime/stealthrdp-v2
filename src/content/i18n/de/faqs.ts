import type { Faq } from '../../../lib/stealth/content';

/* /de/faq. Only answers backed by PRODUCT_FACTS.md. English entries whose claims are not approved
   (bandwidth tiers, discount percentages, payment methods, upgrades, cancellation, data-centre
   security) are left out until the owner confirms them. Ids match faqs.json where the question
   matches, so anchors stay stable across languages. */

const faq = (displayOrder: number, _id: string, category: string, question: string, answer: string): Faq =>
  ({ _id, category, question, answer, displayOrder, isPublished: true });

const services = 'Leistungen und Tarife';
const billing = 'Abrechnung';
const account = 'Konto';
const support = 'Support und Sicherheit';

const faqs: Faq[] = [
  faq(1, '681b38574f70a98a746bfc2a', services, 'Was bietet StealthRDP an?', 'StealthRDP bietet Windows- und Linux-VPS (auch RDP-Server genannt) mit Standorten in den USA und der EU sowie Citadel, einen separaten Layer-7-DDoS-Schutz für HTTP/HTTPS-Anwendungen. Neben den Standard-Tarifen können Sie einen VPS im Konfigurator selbst zusammenstellen.'),
  faq(2, '681b69d1e75118f3793b13ca', services, 'Wo stehen Ihre Rechenzentren?', 'In Phoenix, Arizona (USA-Tarife) und in Amsterdam, Niederlande (EU-Tarife). Beide sind DSGVO-konform. Wählen Sie den Standort, der Ihnen oder den Diensten, mit denen der Server arbeitet, am nächsten ist; das hält die Latenz niedrig.'),
  faq(3, '681b72067bfe24c6e835c48f', services, 'Was unterscheidet USA- und EU-Tarife?', 'Vor allem der Standort: USA-Tarife laufen in Phoenix, EU-Tarife in Amsterdam. Wählen Sie die Region nahe an Ihnen oder Ihrer Zielgruppe, um die Latenz gering zu halten. Ausstattung und Preise vergleichbarer Tarife können je Region leicht abweichen.'),
  faq(4, '68235345089f47364fbefe63', services, 'Was bedeutet „Eigenen VPS zusammenstellen“?', 'Im Server-Konfigurator wählen Sie CPU-Kerne, RAM und NVMe-Speicher selbst, dazu Betriebssystem, Standort (USA oder EU) und Abrechnungszeitraum. So zahlen Sie für die Ressourcen, die Sie wirklich brauchen.'),
  faq(5, '68235350089f47364fbefe65', services, 'Welche Betriebssysteme gibt es?', 'Windows Server 2019, 2022 und 2025. Linux-Images: AlmaLinux 8, 9 und 10; Alpine Linux 3.15, 3.19 und 3.23; CentOS 7, Stream 8 und Stream 9; Debian 10, 11, 12 und 13; Fedora 37 bis 44; FreeBSD 13.2 bis 15.0; Rocky Linux 8, 9 und 10; Ubuntu 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS und 26.04 LTS; openSUSE Leap 15; CloudLinux 9; Arch Linux in der aktuellen Version sowie Oracle Linux 8 und 9.'),
  faq(6, '6824a2fd105d77ad34fbf0b2', services, 'Wie schnell ist ein Dienst aktiv?', 'Die meisten Server sind innerhalb von 60 Sekunden nach der Zahlungsbestätigung bereit. Je nach Betriebssystem und Auslastung kann es einige Minuten dauern. Sie erhalten eine E-Mail mit den Zugangsdaten, sobald der Server bereit ist.'),
  faq(7, '6824a33f105d77ad34fbf0b8', services, 'Welchen Zugriff habe ich auf den Server?', 'Alle Tarife enthalten vollen Administratorzugriff (Windows) oder Root-Zugriff (Linux). Sie installieren Software, ändern Einstellungen und verwalten Benutzer selbst, im Rahmen der Nutzungsbedingungen.'),
  faq(8, '6824a262105d77ad34fbf0ac', billing, 'Gibt es eine Testphase?', 'Eine kostenlose Testphase gibt es nicht. Jeder neue Dienst kann aber innerhalb von 7 Tagen nach der Zahlung erstattet werden, als Guthaben auf Ihr StealthRDP-Konto.'),
  faq(9, '6824a270105d77ad34fbf0ae', billing, 'Bekomme ich eine Erstattung, wenn ich nicht zufrieden bin?', 'Ja. Ein neuer Dienst kann innerhalb von 7 Tagen nach der Zahlung erstattet werden. Die Erstattung erfolgt als Guthaben auf Ihr StealthRDP-Konto, nicht auf das ursprüngliche Zahlungsmittel. Nach diesen 7 Tagen sind Dienste nicht erstattungsfähig. Details stehen in den Zahlungsbedingungen (auf Englisch).'),
  faq(10, 'bd1ec784d5cc89de37f5febc', billing, 'Kann ich die IP-Adresse meines Servers ändern?', 'Ja. Jeder Server hat eine dedizierte IPv4-Adresse. Ein IP-Wechsel kostet 5 € pro Wechsel. Beantragen Sie ihn per WhatsApp, über ein Ticket im Kundenbereich oder per E-Mail an support@stealthrdp.com.'),
  faq(11, '6824a283105d77ad34fbf0b0', account, 'Wie bestelle ich einen Server?', 'Wählen Sie auf der Website Tarif und Abrechnungszeitraum und schließen Sie die Bestellung ab. Nach der Zahlungsbestätigung erhalten Sie die Zugangsdaten per E-Mail; die meisten Server sind innerhalb von 60 Sekunden bereit.'),
  faq(12, '6824a351105d77ad34fbf0ba', support, 'Was tue ich bei technischen Problemen?', 'Schreiben Sie dem Support per WhatsApp an +44 7441 426993, über das Ticketsystem im Kundenbereich oder per E-Mail an support@stealthrdp.com. Der Support ist rund um die Uhr erreichbar. Für dringende Fälle nutzen Sie am besten WhatsApp.'),
  faq(13, 'gdpr', support, 'Ist StealthRDP DSGVO-konform?', 'Ja. Das Hosting in beiden Rechenzentren, Amsterdam und Phoenix, ist DSGVO-konform.'),
  faq(14, '6824a3b0105d77ad34fbf0c0', support, 'Gibt es Backups?', 'Wir erstellen wöchentliche Backups der gesamten Infrastruktur für den Notfall. Nutzen Sie den Server trotzdem nicht als einzigen Speicherort für wichtige Daten: Server können Hardwareprobleme haben oder nicht mehr reagieren, und einzelne Dateien können wir nicht wiederherstellen. Für regelmäßige eigene Backups sind Sie verantwortlich.'),
  faq(15, '6824a3d4105d77ad34fbf0c3', support, 'Was passiert bei Verstößen gegen die Nutzungsbedingungen?', 'Verstöße können zur sofortigen Sperrung oder Kündigung ohne Erstattung führen. Verboten sind unter anderem die Verbreitung illegaler Inhalte, unerlaubte Scans oder Hacking-Versuche, Spam, Botnetze und Ressourcenmissbrauch zulasten anderer Kunden. Leichte Verstöße können eine Verwarnung nach sich ziehen, schwere führen zur sofortigen Kündigung.'),
  faq(16, '68c9a0114f70a98a746b0001', support, 'Ist eine Microsoft-Windows-Lizenz enthalten?', 'Nein. StealthRDP stellt keine Microsoft-Windows-Lizenzen, SPLA-Lizenzen, RDS-Lizenzen, Aktivierungsschlüssel oder Lizenzierungsdienste bereit, auch nicht auf Anfrage. Windows Server Evaluation kann zu Test- und Evaluierungszwecken bereitgestellt werden; das ist Testsoftware und keine dauerhaft lizenzierte Windows-Installation. Für die Lizenzen, die Ihr Einsatz erfordert, sind Sie selbst verantwortlich. Eigene, berechtigte Microsoft-Lizenzen dürfen Sie nutzen, soweit Microsofts Lizenzbedingungen das erlauben. Alle Details stehen auf der Seite zur Windows-Lizenzierung (Englisch).'),
];

export default faqs;

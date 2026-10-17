import type { OsCopy } from '../en/os';
import Link from 'next/link';

const os: OsCopy = {
  session: {
    computer: 'Ihr Computer',
    signedInAs: 'Angemeldet als',
    regionNote: 'Standort je Tarif wählbar',
    facts: ['In ca. 60 Sek. online', 'Dedizierte IPv4', 'Unbegrenzte Bandbreite'],
    windows: { client: 'Remotedesktop', session: 'RDP-Sitzung' },
    linux: { client: 'SSH-Client', session: 'SSH-Sitzung' },
    linuxImage: 'Linux',
  },
  journey: {
    kicker: 'Von der Bestellung zur Anmeldung',
    title: {
      windows: 'In vier Schritten von der Bestellung zum Windows-Desktop',
      linux: 'In vier Schritten von der Bestellung zur Root-Shell',
    },
    intro: 'Die meisten Server sind innerhalb von 60 Sekunden nach der Zahlungsbestätigung bereit. Bei hoher Auslastung kann es einige Minuten dauern.',
    pick: {
      title: 'Tarif und Standort wählen',
      text: 'Vergleichen Sie oben CPU, RAM, Speicher, Bandbreite und Preis, in den USA oder in der EU.',
    },
    windowsOs: { title: 'Windows Server bei der Bestellung wählen', text: 'Bei der Bestellung wählen Sie das Betriebssystem: Windows Server 2019, 2022 oder 2025.' },
    linuxOs: { title: 'Distribution bei der Bestellung wählen', text: 'Bei der Bestellung wählen Sie das Betriebssystem aus den aufgeführten Linux-Images.' },
    credentials: {
      title: 'Zugangsdaten erhalten',
      text: 'StealthRDP sendet sie nach der Zahlungsbestätigung per E-Mail.',
      time: 'In der Regel innerhalb von 60 Sekunden',
    },
    windowsConnect: {
      title: 'Per Remotedesktop verbinden',
      text: 'Geben Sie die Server-IP aus der E-Mail ein und melden Sie sich als Administrator an.',
      linkLabel: 'Anleitung: Bei Windows anmelden (Englisch)',
    },
    linuxConnect: { title: 'Als root anmelden', text: 'Verbinden Sie sich per SSH mit der Server-IP aus der E-Mail und den Root-Zugangsdaten.' },
  },
  versions: {
    kicker: 'Umgebung',
    title: 'Die Windows-Version, die Ihre Software braucht',
    intro: 'Diese Windows-Server-Versionen stehen zur Wahl. Wählen Sie bei der Bestellung die Version, die Ihre Software voraussetzt.',
    product: 'Windows Server',
    selected: 'Wahl bei der Bestellung',
    licensing: (
      <>
        <strong>Windows-Lizenz nicht enthalten.</strong>
        {' '}
        StealthRDP stellt nur die Infrastruktur bereit. Eine Microsoft-Windows-Lizenz ist nicht enthalten und wird von
        StealthRDP nicht angeboten. Für die korrekte Lizenzierung sind Sie selbst verantwortlich.
        {' '}
        <Link href="/docs/windows-licensing">Mehr zur Windows-Lizenzierung (Englisch)</Link>
        .
      </>
    ),
  },
  distros: {
    kicker: 'Umgebung',
    title: 'Diese Linux-Distributionen stehen bereit',
    intro: 'Wählen Sie die Distribution, die Ihr Stack braucht, und bestätigen Sie Image und Version bei der Bestellung.',
    directAdmin: 'Anleitung: DirectAdmin unter Linux installieren (Englisch)',
  },
  resources: {
    kicker: 'Ressourcen',
    title: 'Den Server passend zum Stack dimensionieren',
    intro: 'Zählen Sie, was gleichzeitig läuft. Jeder Punkt unten ist ein Tarif aus dem aktuellen Angebot.',
    items: {
      cpu: {
        label: 'CPU',
        unit: 'vCPU',
        carries: 'Parallele Last',
        text: {
          windows: 'Passend zu aktiver Rechenlast und gleichzeitigen Aufgaben.',
          linux: 'Vergleichen Sie die CPU mit Anwendung, Diensten, Workern und erwarteter Last.',
        },
      },
      ram: {
        label: 'RAM',
        unit: 'GB',
        carries: 'Laufende Dienste',
        text: {
          windows: 'Planen Sie Windows, Anwendungen und gleichzeitig angemeldete Benutzer ein.',
          linux: 'Planen Sie Speicher für das System plus Webserver, App-Prozesse, Datenbanken, Panels und Jobs ein.',
        },
      },
      storage: {
        label: 'Speicher',
        unit: 'GB',
        carries: 'Dateien und Daten',
        text: {
          windows: 'Rechnen Sie Betriebssystem, installierte Software, Dateien und künftigen Bedarf ein.',
          linux: 'Rechnen Sie Betriebssystem, Pakete, Datenbanken, Dateien und künftigen Bedarf ein.',
        },
      },
    },
    scaleLabel: (label, min, max, unit, count) => `${label} von ${min} bis ${max} ${unit} in ${count} Tarifen`,
  },
  regions: {
    kicker: 'Standorte',
    title: 'USA oder EU',
    intro: 'Wählen Sie den Standort passend zu Ihren Nutzern, der Latenz und Ihren Anforderungen. Die Rechenzentren stehen in Phoenix (USA) und Amsterdam (EU), beide DSGVO-konform. Die Zahlen stammen aus dem aktuellen Angebot.',
    names: { USA: 'USA', EU: 'EU' },
    plans: 'Tarife',
    from: 'Ab',
    perMonth: '/Monat',
    stock: 'Server verfügbar',
    view: region => `${region}-Tarife ansehen`,
  },
  support: {
    kicker: 'Support und Regeln',
    title: 'Hilfe, wenn Sie sie brauchen, und die Regeln, die gelten',
    heading: 'Support',
    whatsapp: 'WhatsApp-Support',
    tickets: 'Ticketsystem im Kundenbereich',
    email: 'Support per E-Mail',
    faqLink: 'Support-Details in den häufigen Fragen',
    responsibilities: 'Ihre Verantwortung',
    access: { windows: 'Voller Windows-Administratorzugriff', linux: 'Voller Root-Zugriff' },
    accessRest: 'gibt Ihnen die Kontrolle über den Server und die installierte Software. Für regelmäßige Backups wichtiger Daten sind Sie selbst verantwortlich.',
    lawful: 'Die Nutzung muss legal sein. Die Bedingungen verbieten Missbrauch, Scans, Hacking, Spam, Botnetze und ähnliche Zwecke.',
    terms: 'Nutzungsbedingungen (Englisch)',
    guides: 'Anleitungen (Englisch)',
    windowsGuides: [
      { href: '/docs/how-do-i-log-into-windows', label: 'Bei Windows anmelden' },
      { href: '/docs/how-to-re-activate-and-extend-your-180-day-windows-trial', label: '180-Tage-Testzeitraum von Windows verlängern' },
      { href: '/docs/step-by-step-guide-to-fix-win-rm-and-install-net-framework', label: 'WinRM reparieren und .NET Framework installieren' },
      { href: '/docs/how-to-rebuild-a-server', label: 'Server neu aufsetzen' },
    ],
    linuxGuides: [
      { href: '/docs/how-to-install-direct-admin-in-a-linux-server', label: 'DirectAdmin installieren' },
      { href: '/docs/install-cyber-panel-with-open-lite-speed-in-linux', label: 'CyberPanel mit OpenLiteSpeed installieren' },
      { href: '/docs/how-to-setup-your-vpn-on-linux-server-using-outline', label: 'Outline-VPN-Server einrichten' },
      { href: '/docs/how-to-rebuild-a-server', label: 'Server neu aufsetzen' },
    ],
    allHelp: 'Alle Hilfeartikel (Englisch)',
  },
  faq: {
    kicker: 'Häufige Fragen',
    intro: 'Kurze Antworten zu Software, Zugriff, Aktivierung und Support.',
    other: 'Andere Umgebung wählen',
  },
};

export default os;

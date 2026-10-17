import type { PlansCopy } from '../en/plans';
import Link from 'next/link';
import pricing from './pricing';

/* /de/plans. Keywords: keyword-map-de-de.json (primary "vserver mieten"). */

const page: PlansCopy = {
  meta: {
    title: 'vServer mieten: Windows- und Linux-VPS | StealthRDP',
    description: 'vServer mieten mit Windows oder Linux in den USA und der EU: NVMe-Speicher, voller Admin-Zugriff und Support rund um die Uhr. Tarif wählen, online bestellen.',
  },
  jsonLd: {
    listName: 'StealthRDP VPS-Tarife',
    describe: plan => `${pricing.spec(plan.specs.cpu)}, ${plan.specs.ram} RAM, ${plan.specs.storage}, Standort ${plan.location}`,
  },
  kicker: 'Windows und Linux VPS',
  title: 'vServer mieten: Windows- und Linux-VPS-Tarife',
  lede: 'Vergleichen Sie alle Windows- und Linux-vServer an einem Ort. Wählen Sie Ressourcen, Standort und Abrechnungszeitraum, bevor Sie zur Bestellung gehen.',
  compareButton: 'Standard-Tarife vergleichen',
  buildButton: 'Eigenen VPS zusammenstellen',
  facts: {
    plans: 'Tarife',
    start: lowest => pricing.money(lowest),
    startText: 'pro Monat zum Einstieg',
    stock: 'Server verfügbar',
  },
  grid: { kicker: 'STANDARD-TARIFE', title: 'vServer günstig nach Ressourcen wählen' },
  os: {
    kicker: 'Betriebssysteme',
    title: 'Die VPS-Umgebung, die zu Ihrer Arbeit passt.',
    windows: {
      badge: 'Windows VPS',
      title: 'Windows VPS für grafischen Fernzugriff.',
      text: 'Wählen Sie Windows, wenn Ihre Arbeit einen grafischen Desktop oder Microsoft-kompatible Software braucht. Vergleichen Sie oben CPU, RAM, NVMe-Speicher, Bandbreite, Standort und Abrechnungszeitraum.',
      licensing: (
        <>
          <strong>Windows-Lizenz:</strong>
          {' '}
          StealthRDP stellt nur die Infrastruktur bereit.
          Eine Microsoft-Windows-Lizenz ist nicht enthalten und wird von StealthRDP nicht angeboten.
          Wer Windows nutzt, ist selbst für die korrekte Lizenzierung verantwortlich.
          {' '}
          <Link href="/docs/windows-licensing">Mehr zur Windows-Lizenzierung (Englisch).</Link>
        </>
      ),
      guide: 'Zum Windows vServer',
      compare: 'Windows-VPS-Ressourcen vergleichen',
    },
    linux: {
      badge: 'Linux VPS',
      title: 'Linux VPS für Server- und Open-Source-Anwendungen.',
      text: 'Wählen Sie Linux für die Administration auf der Kommandozeile, Webhosting, Open-Source-Anwendungen, Automatisierung und Server-Tools. Vergleichen Sie dieselben Ressourcenstufen, bevor Sie zur Bestellung gehen.',
      guide: 'Zum Linux VPS',
      compare: 'Linux-VPS-Ressourcen vergleichen',
    },
  },
  included: {
    kicker: 'In jedem Tarif enthalten',
    title: 'Das Wichtigste ist schon dabei.',
    text: 'Sie wählen den Tarif nach Ressourcen. Diese Leistungen gehören zu jedem Server.',
    items: [
      { title: 'Voller Admin-Zugriff', text: 'Kontrolle über den Server vom ersten Tag an' },
      { title: 'NVMe-SSD-Speicher', text: 'Schnelle Datenträger für den Alltag' },
      { title: 'Isolierte VMs', text: 'Eigene virtuelle Maschine pro Server' },
      { title: 'Schnelle Aktivierung', text: 'Meist innerhalb von 60 Sekunden nach der Zahlung' },
      { title: 'Support rund um die Uhr', text: 'Hilfe, wenn Sie sie brauchen' },
    ],
  },
  faqTitle: 'Fragen zu den VPS-Tarifen',
  questions: lowest => [
    ['Wo stehen die VPS-Server?', 'In Phoenix, Arizona (USA) und in Amsterdam, Niederlande (EU), beide DSGVO-konform. Jeder Tarif zeigt seinen Standort. Ein USA-VPS passt zu Nutzern und Diensten in Nordamerika, ein EU-VPS zu Nutzern und Diensten in Europa.'],
    ['Wie miete ich einen VPS Server?', 'Wählen Sie oben Tarif und Abrechnungszeitraum und gehen Sie weiter zur Bestellung. Dort wählen Sie Windows oder Linux und die genaue Version. Die meisten Server sind innerhalb von 60 Sekunden nach der Zahlungsbestätigung bereit.'],
    ['Wie günstig ist ein vServer bei StealthRDP?', `Der kleinste Tarif kostet ${lowest} pro Monat. Mit einer Laufzeit von 3, 6, 12 oder 24 Monaten sinkt der Preis pro Monat; der reguläre Preis steht zum Vergleich daneben.`],
    ['Welchen vServer-Tarif soll ich wählen?', 'Gehen Sie von Ihrer Software, der Zahl der Nutzer oder Sitzungen und Ihren Daten aus. Vergleichen Sie CPU, RAM und NVMe-Speicher als getrennte Grenzen. Passt kein Standard-Tarif, stellen Sie Ihren Server im Konfigurator selbst zusammen.'],
    ['Was bedeutet „virtuellen Server mieten“?', 'Sie mieten eine virtuelle Maschine mit eigener Zuteilung von CPU, RAM und NVMe-Speicher, statt eigene Hardware zu kaufen. Sie zahlen pro Abrechnungszeitraum und verwalten das System mit vollem Admin-Zugriff.'],
    ['Ist ein vServer dasselbe wie ein Cloud Server?', 'Die Begriffe werden oft gleich verwendet. Bei StealthRDP mieten Sie einen virtuellen Server (VPS) mit festen Ressourcen je Tarif, den Sie monatlich oder für einen längeren Zeitraum bezahlen.'],
    ['Ist Support enthalten?', 'Ja. Support gibt es rund um die Uhr per WhatsApp, über das Ticketsystem im Kundenbereich und per E-Mail.'],
    ['Kann ich meine IP-Adresse ändern?', 'Ja. Jeder Server hat eine dedizierte IPv4-Adresse. Ein IP-Wechsel kostet 5 € pro Wechsel; beantragen Sie ihn beim Support per WhatsApp, Ticket im Kundenbereich oder E-Mail.'],
  ],
  other: {
    title: 'Unsicher, welches System?',
    text: 'Lesen Sie vor der Wahl die Seiten zum Windows vServer und zum Linux VPS.',
    href: '/windows-vps',
    label: 'Windows vServer',
  },
  build: {
    kicker: 'Für alles dazwischen',
    title: 'Einen Server nach Ihren genauen Vorgaben zusammenstellen.',
    text: 'Wählen Sie CPU, RAM, Speicher, Standort und Abrechnungszeitraum selbst im Server-Konfigurator.',
    labels: ['CPU', 'RAM', 'Speicher', 'Standort'],
    button: 'Konfigurieren und bestellen',
  },
};

export default page;

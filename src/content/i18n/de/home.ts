import type { HomeCopy } from '../en/home';
import pricing from './pricing';

/* /de. Keywords: keyword-map-de-de.json (primary "vps server"). Only approved facts from
   PRODUCT_FACTS.md: no "instant", no unverified promises. */

const home: HomeCopy = {
  meta: {
    title: 'VPS Server mit Windows oder Linux | StealthRDP',
    description: 'VPS Server mit Windows oder Linux mieten: NVMe-Speicher, voller Admin-Zugriff, Standorte in den USA und der EU, DSGVO-konform und flexible Abrechnung.',
  },
  jsonLd: {
    name: 'StealthRDP VPS-Hosting',
    serviceType: 'Windows- und Linux-VPS-Hosting',
    description: 'Windows- und Linux-VPS mit Standorten in den USA und der EU.',
  },
  hero: {
    aria: 'Windows- und Linux-VPS',
    badge: 'Windows & Linux VPS · Meist in 60 Sekunden bereit',
    title: system => `Ihr ${system} VPS Server. `,
    titleSpan: 'Meist in 60 Sekunden bereit.',
    lede: mode => mode === 'windows'
      ? 'Ein VPS Server für Remotedesktop mit vollem Administratorzugriff, NVMe-Speicher und dedizierter IPv4, in den USA oder in der EU. Die gemessene Verfügbarkeit sehen Sie öffentlich auf der Statusseite.'
      : 'Ein VPS Server für Linux mit vollem Root-Zugriff, NVMe-Speicher und dedizierter IPv4, in den USA oder in der EU. Die gemessene Verfügbarkeit sehen Sie öffentlich auf der Statusseite.',
    choose: 'Server auswählen',
    presales: 'Frage vor dem Kauf stellen',
    metaAria: 'Leistungen',
    startingFrom: 'Ab ',
    price: from => pricing.money(from),
    perMonth: price => `${price}/Monat`,
    benefits: ['Support rund um die Uhr', 'Dedizierte IPv4', 'DSGVO-konform'],
  },
  osBand: {
    aria: 'Unterstützte Betriebssysteme',
    list: 'Windows Server, Ubuntu, Debian, Rocky Linux, AlmaLinux, CentOS, Fedora, Alpine Linux und FreeBSD',
  },
  plans: {
    kicker: 'Server auswählen',
    title: 'VPS Hosting mit den Ressourcen, die Sie brauchen.',
    text: 'Wählen Sie Standort und Abrechnungszeitraum und vergleichen Sie dann CPU, RAM, Speicher, Bandbreite, Betriebssysteme und Verfügbarkeit.',
  },
  pricing: {
    linuxOnly: 'Nur Linux',
    both: 'Windows + Linux',
    mostPopular: 'Beliebt',
    popular: 'Beliebt',
    billedMonthly: 'Monatliche Abrechnung',
    effective: perMonth => `effektiv ${perMonth.toFixed(2).replace('.', ',')} €/Monat · heute fällig`,
    orderNow: 'Jetzt bestellen',
    orderAria: plan => `Jetzt bestellen: ${plan}`,
    outOfStock: 'Ausverkauft',
    inStock: 'Verfügbar',
    available: count => `${count} verfügbar`,
    left: count => `noch ${count}`,
    bandwidth: value => `Bandbreite: ${value.toLowerCase()}`,
    ipv4: 'Dedizierte IPv4',
    viewSpecs: 'Alle Daten ansehen',
    viewAll: 'Alle Tarife ansehen',
  },
  useCases: {
    kicker: 'Einsatzbereiche',
    title: 'Was können Sie auf einem VPS betreiben?',
    text: 'Praxisnahe Anleitungen für Remotedesktop, Webhosting, Automatisierung, Trading und Backups, mit Tipps zu Dimensionierung und Einrichtung.',
    browse: 'Alle VPS-Anleitungen (Englisch)',
    read: 'Anleitung lesen (Englisch)',
    items: [
      { title: 'Remotedesktop', text: 'Wann ein VPS als entfernter Arbeitsplatz gut funktioniert, was die Reaktionszeit beeinflusst und wie Sie ihn dimensionieren.', href: '/blog/vps-for-remote-desktop.html' },
      { title: 'Webhosting', text: 'Wann sich der Umstieg vom Shared Hosting lohnt und wie Sie einen VPS für den ganzen Web-Stack planen.', href: '/blog/vps-for-web-hosting.html' },
      { title: 'Automatisierung und Bots', text: 'Wie Sie Ressourcen für Skripte, Worker, Webhook-Dienste, Bots und dauerhafte Automatisierung wählen.', href: '/blog/vps-for-automation-bots.html' },
      { title: 'Trading', text: 'Was ein VPS für Trading-Software verbessern kann, was nicht, und warum der Standort zählt.', href: '/blog/vps-for-trading.html' },
      { title: 'Backups und Speicher', text: 'Wie Sie einen VPS als externes Backup-Ziel bewerten, einschließlich Aufbewahrung, Übertragung und Wiederherstellung.', href: '/blog/vps-for-backups-storage.html' },
    ],
  },
  infra: {
    kicker: 'Infrastruktur',
    title: 'Infrastruktur, auf die Sie sich verlassen können.',
    text: 'Als VPS-Anbieter bieten wir Tempo, Kontrolle, Reichweite und Transparenz auf jedem Server, mit einer Statusseite, auf der Sie die Verfügbarkeit selbst prüfen.',
    statusLink: 'Serverstatus ansehen',
    items: [
      { title: 'NVMe-SSD-Speicher', text: 'Schneller Datenträgerzugriff für Anwendungen, Datenbanken, Automatisierung und Desktop-Arbeit.', label: 'Leistung' },
      { title: 'Voller Admin-Zugriff', text: 'Jeder Server läuft in einer eigenen virtuellen Maschine, mit vollem Administratorzugriff unter Windows oder root unter Linux.', label: 'Kontrolle' },
      { title: 'Rechenzentren in USA und EU', text: 'Phoenix und Amsterdam, beide DSGVO-konform. Wählen Sie den Standort nahe an Ihrer Anwendung, mit dedizierter IPv4.', label: 'Reichweite' },
      { title: 'Gemessene Verfügbarkeit, öffentlich', text: 'Jeder überwachte Dienst zeigt seine gemessene Verfügbarkeit auf der Statusseite, und der Support antwortet rund um die Uhr.', label: 'Transparenz' },
    ],
  },
  products: {
    kicker: 'StealthRDP-Produkte',
    title: 'Das Produkt, das Ihre Anwendung braucht.',
    text: 'Mieten Sie einen Virtual Private Server mit Windows oder Linux für Rechenleistung, oder leiten Sie eine bestehende HTTP/HTTPS-Anwendung für Layer-7-Schutz über Citadel. Beide Produkte sind getrennt und unabhängig nutzbar.',
    compare: 'VPS-Tarife vergleichen',
    explore: 'DDoS-Schutz ansehen',
    flowAria: 'StealthRDP-Produkte',
    hosting: { kicker: 'Hosting', title: 'Windows & Linux VPS', small: 'USA + EU · NVMe · Dedizierte IPv4 · Admin-Zugriff', link: 'Hosting ansehen' },
    protection: { kicker: 'Layer-7-DDoS-Schutz', title: 'Citadel von StealthRDP', small: 'HTTP/HTTPS-Prüfungen · Ratenbegrenzung · Lockdown · Origin-Status', link: 'Schutz ansehen' },
  },
  reviews: {
    kicker: 'Kundenstimmen',
    title: 'Was Kunden sagen (auf Englisch).',
    featured: 'Ausgewählte Bewertung',
    customer: 'StealthRDP-Kunde',
    viewOn: source => `Auf ${source} ansehen`,
    sources: {
      'Discord review': 'Discord-Bewertung',
      'Customer testimonial': 'Kundenstimme',
      'Trustpilot': 'Trustpilot',
      'Third-party review': 'Externe Bewertung',
    },
    streamTitle: 'Unabhängige und eigene Bewertungen',
    hover: 'Zum Anhalten darüberfahren',
    swipe: 'Zum Blättern wischen →',
    marqueeAria: 'Weitere Kundenstimmen',
    sourceAria: author => `Quelle der Bewertung von ${author} ansehen`,
  },
  final: {
    eyebrow: '12.000+ VPS bereitgestellt',
    title: 'Bereit für Ihren nächsten VPS?',
    text: 'Wählen Sie Standort, Ressourcen und Betriebssystem. Die meisten Server sind etwa 60 Sekunden nach der Zahlung online.',
    start: lowest => pricing.money(lowest),
    startLabel: 'Einstiegspreis',
    setup: ['60 Sek.', 'typische Einrichtung'],
    support: ['24/7', 'Support'],
    choose: 'Server auswählen',
    presales: 'Frage vor dem Kauf stellen',
  },
};

export default home;

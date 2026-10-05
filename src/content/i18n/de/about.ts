import type { AboutCopy } from '../en/about';
import { formatEuro } from '../../../lib/stealth/i18n';

/* /de/about. No keyword target in keyword-map-de-de.json: the page says who runs the servers,
   where they stand and what every server includes. Facts from PRODUCT_FACTS.md only. */

const about: AboutCopy = {
  meta: {
    title: 'Über uns: VPS aus Amsterdam und Phoenix | StealthRDP',
    description: 'StealthRDP betreibt Windows- und Linux-VPS in Amsterdam und Phoenix: DSGVO-konform, über 12.000 bereitgestellte VPS und Support rund um die Uhr.',
  },
  jsonLd: {
    pageName: 'Über StealthRDP',
    description: 'Windows- und Linux-VPS-Hosting aus Rechenzentren in Phoenix (Arizona) und Amsterdam (Niederlande) sowie Citadel, ein Layer-7-DDoS-Schutz.',
    crumb: 'Über uns',
  },
  hero: {
    kicker: 'Über StealthRDP',
    title: 'Für alle, die Server brauchen, die',
    titleSpan: 'einfach laufen.',
    lede: 'StealthRDP betreibt Windows- und Linux-VPS in Rechenzentren in Phoenix, Arizona, und Amsterdam, Niederlande. Tarif wählen, bezahlen, und die meisten Server sind innerhalb von 60 Sekunden bereit, mit vollem Administrator- oder Root-Zugriff.',
    compare: 'VPS-Tarife vergleichen',
    status: 'Serverstatus ansehen',
  },
  map: {
    from: price => `Ab ${formatEuro(price, 'de')}/Monat`,
    noPlans: 'Tarife je Region',
    usa: 'Region USA',
    eu: 'Region EU',
    citadelNote: 'Layer-7-DDoS-Schutz',
    linuxNote: 'Ubuntu, Debian +3',
    clientArea: 'Kundenbereich',
    clientAreaNote: 'Rechnungen und Tickets',
    livePlans: count => `${count} aktive Tarife`,
  },
  proofLabel: 'StealthRDP in Zahlen',
  proof: [
    { value: '12.000+', label: 'bereitgestellte VPS' },
    { value: '2', label: 'Rechenzentren, USA und EU' },
    { value: '60 Sek.', label: 'typische Einrichtung' },
    { value: '24/7', label: 'Support' },
  ],
  products: {
    kicker: 'Was wir machen',
    title: 'Zwei Produkte, ein Support-Team.',
    text: 'Ein VPS für die Arbeit, die Sie ausführen, und Citadel für Websites, die online bleiben müssen. Beide Produkte sind getrennt: Für Citadel brauchen Sie keinen StealthRDP-VPS.',
    vps: {
      title: 'Windows- und Linux-VPS',
      text: from => `Windows Server 2019, 2022 und 2025 oder Linux wie Ubuntu, Debian und AlmaLinux. NVMe-Speicher, eine dedizierte IPv4-Adresse und wöchentliche Backups in jedem Tarif. Ab ${formatEuro(from, 'de')}/Monat.`,
      link: 'VPS-Tarife vergleichen',
    },
    citadel: {
      title: 'Citadel DDoS-Schutz',
      text: 'Layer-7-Schutz für HTTP- und HTTPS-Websites und -Anwendungen. Starter 0\u00A0€, Growth 49\u00A0€ und Scale 149\u00A0€ pro Monat.',
      link: 'Citadel ansehen',
    },
  },
  standards: {
    kicker: 'Wie wir arbeiten',
    title: 'Derselbe Standard auf jedem Server.',
    text: 'Egal welchen Tarif und welches Betriebssystem Sie wählen: Jeder StealthRDP-VPS bringt das mit.',
    items: [
      { label: 'Einrichtung', title: 'Meist in 60 Sekunden bereit', text: 'Die meisten Server sind innerhalb von 60 Sekunden nach der Zahlungsbestätigung bereit. Bei hoher Auslastung kann es einige Minuten dauern.' },
      { label: 'Kontrolle', title: 'Administrator- oder Root-Zugriff', text: 'Voller Administratorzugriff unter Windows und voller Root-Zugriff unter Linux, ab der ersten Anmeldung.' },
      { label: 'Netzwerk', title: 'Eine dedizierte IPv4-Adresse', text: 'Jeder Server hat eine eigene IPv4-Adresse. Sie brauchen eine neue? Der Support wechselt sie für 5\u00A0€.' },
      { label: 'Speicher', title: 'NVMe in jedem Tarif', text: 'NVMe-Speicher in jedem Tarif, in den USA und in Europa.' },
      { label: 'Backups', title: 'Wöchentliche Backups', text: 'Jeder Server wird einmal pro Woche gesichert.' },
      { label: 'Verfügbarkeit', title: 'Gemessene Verfügbarkeit, öffentlich', text: 'Die Statusseite zeigt für jeden überwachten Dienst die Verfügbarkeit über 30 und 90 Tage sowie Störungen.' },
    ],
  },
  regions: {
    kicker: 'Wo Ihr Server läuft',
    title: 'Zwei Rechenzentren, eines pro Region.',
    text: 'Jeder Tarif nennt seine Region. Beide Standorte sind DSGVO-konform. Wählen Sie den, der Ihren Nutzern und den angebundenen Diensten am nächsten ist; aus Deutschland ist das meist Amsterdam.',
    label: region => `${region}-Tarife`,
    from: price => `Ab ${formatEuro(price, 'de')}/Monat`,
    usa: { city: 'Phoenix, Arizona', text: 'Das Rechenzentrum für die USA-Tarife. Die richtige Wahl für Nutzer und Dienste in Nordamerika.' },
    eu: { city: 'Amsterdam, Niederlande', text: 'Das Rechenzentrum für die EU-Tarife. Die richtige Wahl für Nutzer und Dienste in Europa.' },
  },
  reviews: {
    kicker: 'Kundenbewertungen',
    title: 'Was Kunden auf Trustpilot sagen (auf Englisch).',
    text: 'Unveränderte Bewertungen unserer Kunden, jeweils mit Link zur Quelle.',
    viewOn: 'Auf Trustpilot ansehen',
  },
  final: {
    kicker: 'Fragen zu unserer Infrastruktur?',
    title: 'Sprechen Sie mit unserem Team.',
    text: 'Der Support ist rund um die Uhr per WhatsApp, über Tickets im Kundenbereich und unter support@stealthrdp.com erreichbar. Rechnungen und Tickets finden Sie in Ihrem Kundenbereich.',
    talk: 'Mit dem Team sprechen',
    whatsapp: 'WhatsApp-Support schreiben',
  },
};

export default about;

/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { LinuxVpsCopy } from '../en/linux-vps';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { localeHref } from '../../../lib/stealth/i18n';
import pricing from './pricing';

/* /de/linux-vps. Keywords: keyword-map-de-de.json (primary "linux vps"). */

const page: LinuxVpsCopy = {
  meta: {
    title: 'Linux VPS und Linux vServer mieten | StealthRDP',
    description: 'Linux VPS mit vollem Root-Zugriff, NVMe-Speicher und Ubuntu, Debian, AlmaLinux oder einer anderen Distribution. Standorte in den USA und der EU.',
  },
  jsonLd: {
    name: 'Linux VPS',
    description: 'Linux VPS mit vollem Root-Zugriff, großer Auswahl an Distributionen, NVMe-Speicher und Standorten in den USA und der EU.',
  },
  kicker: 'Linux VPS',
  title: ['Linux VPS mit vollem Root-Zugriff und', 'Ihrer Wunsch-Distribution.'],
  lede: 'Ein Linux VPS von StealthRDP ist ein Linux-Server, den Sie als root verwalten, in den USA oder in der EU: mit Ubuntu, Debian, CentOS oder einem anderen aufgeführten Image, zu einem Preis, den Sie vor der Zahlung sehen.',
  compareButton: 'Linux-VPS-Tarife vergleichen',
  distrosButton: 'Linux-Distributionen',
  latest: 'Aktuell',
  pricing: { kicker: 'Aktuelles VPS-Angebot', title: 'Linux Server mieten: Ressourcen wählen' },
  resources: ({ bronze, cheapest }) => (
    <>
      <p>
        {`Das aktuelle Angebot beginnt mit ${cheapest.name} ab ${cheapest.price}/Monat. Ubuntu, Debian oder eine andere aufgeführte Distribution wählen Sie bei der Bestellung.`}
      </p>
      <p>
        {bronze.map(plan => `${plan.name}: ${pricing.spec(plan.specs.cpu)}, ${plan.specs.ram} RAM, ${plan.specs.storage}, Bandbreite ${pricing.spec(plan.specs.bandwidth).toLowerCase()}.`).join(' ')}
        {' '}
        Prüfen Sie vor der Bestellung die aktuelle Zeile im Angebot. Preise und Verfügbarkeit können sich ändern.
      </p>
      <div className="sr-inline-links">
        <Link href={`${localeHref('/plans', 'de')}#linux-vps`}>
          Linux-VPS-Angebot
          <ArrowRight size={16} />
        </Link>
        <Link href={`${localeHref('/plans', 'de')}#comparison`}>
          Tarifvergleich
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  ),
  faqTitle: 'Fragen zum Linux VPS',
  questions: ({ cheapest }) => [
    ['Was kostet ein Linux VPS?', `Der kleinste Tarif, ${cheapest.name}, kostet ${cheapest.price} pro Monat. Den aktuellen Preis und den Standort bestätigen Sie bei der Bestellung.`],
    ['Welche Linux-Distributionen kann ich nutzen?', 'AlmaLinux 8, 9 und 10; Alpine Linux 3.15, 3.19 und 3.23; CentOS 7, Stream 8 und Stream 9; Debian 10, 11, 12 und 13; Fedora 37 bis 44; FreeBSD 13.2 bis 15.0; Rocky Linux 8, 9 und 10; Ubuntu 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS und 26.04 LTS; openSUSE Leap 15; CloudLinux 9; Arch Linux in der aktuellen Version sowie Oracle Linux 8 und 9.'],
    ['Bekomme ich einen Ubuntu VPS?', 'Ja. Wählen Sie bei der Bestellung Ubuntu als Betriebssystem: 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS oder 26.04 LTS. Sie erhalten den VPS mit installiertem Ubuntu und vollem Root-Zugriff.'],
    ['Debian oder Ubuntu: Welchen Server soll ich wählen?', 'Beide eignen sich für die meisten Serveranwendungen. Ubuntu LTS ist in Anleitungen und Panel-Dokumentationen verbreitet. Debian stable ändert sich zwischen den Versionen weniger. Wenn Ihre Software eine der beiden dokumentiert, nehmen Sie diese.'],
    ['Ist ein Linux vServer ein Root Server?', 'Sie erhalten vollen Root-Zugriff auf einen virtuellen Server, genau das, was viele unter „Root Server mieten“ suchen. Der Server hat eine eigene Zuteilung von CPU, RAM und NVMe-Speicher, und Sie verwalten das System vollständig selbst.'],
    ['Ist Root-Zugriff enthalten?', 'Ja. Alle VPS-Tarife enthalten vollen Root-Zugriff.'],
    ['Gibt es Linux-Tarife in den USA und in der EU?', 'Ja. USA-Tarife laufen in Phoenix, Arizona, EU-Tarife in Amsterdam, Niederlande; beide Rechenzentren sind DSGVO-konform. Den Standort bestätigen Sie bei der Bestellung.'],
    ['Wann ist der Server aktiv?', 'Die meisten Server sind innerhalb von 60 Sekunden nach der Zahlungsbestätigung bereit. Bei hoher Auslastung kann es einige Minuten dauern.'],
    ['Wie erhalte ich die Zugangsdaten?', 'Per E-Mail nach der Zahlungsbestätigung.'],
  ],
  other: {
    title: 'Lieber Windows?',
    text: 'Für gewohnte Windows-Software und Remotedesktop-Zugriff auf einen Windows Server eignet sich ein Windows vServer.',
    href: localeHref('/windows-vps', 'de'),
    label: 'Windows vServer',
  },
  cta: {
    kicker: 'Linux-VPS-Tarife',
    title: 'Linux-VPS-Tarife vergleichen',
    text: 'Prüfen Sie Tarif, Standort und angezeigten Preis und bestätigen Sie Linux und das genaue Image bei der Bestellung.',
    compare: 'Linux-VPS-Tarife vergleichen',
    compareHref: `${localeHref('/plans', 'de')}#linux-vps`,
    checkout: 'Weiter zur Bestellung',
    checkoutHref: localeHref('/plans', 'de'),
  },
};

export default page;

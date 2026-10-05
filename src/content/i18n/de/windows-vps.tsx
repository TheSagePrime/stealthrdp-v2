/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { WindowsVpsCopy } from '../en/windows-vps';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { localeHref } from '../../../lib/stealth/i18n';

/* /de/windows-vps. Keywords: keyword-map-de-de.json (primary "windows vserver"). */

const page: WindowsVpsCopy = {
  meta: {
    title: 'Windows vServer mieten | Windows VPS | StealthRDP',
    description: 'Windows vServer mieten: Windows Server 2019, 2022 oder 2025, voller Administratorzugriff, NVMe-Speicher und Remotedesktop. Standorte in den USA und der EU.',
  },
  jsonLd: {
    name: 'Windows vServer',
    description: 'Windows vServer mit vollem Administratorzugriff, Windows Server 2019, 2022 und 2025, NVMe-Speicher und Standorten in den USA und der EU.',
  },
  kicker: 'Windows VPS',
  title: ['Windows vServer mieten für Software, die', 'Windows braucht.'],
  lede: 'Ein Windows vServer gibt Ihnen einen eigenen Windows Server per Remotedesktop: für gewohnte Software, Administration und Geschäftsabläufe, in den USA oder in der EU. Vergleichen Sie unten die Ressourcen und wählen Sie die Windows-Server-Version bei der Bestellung.',
  compareButton: 'Windows-VPS-Tarife vergleichen',
  versionsButton: 'Windows-Versionen',
  pricing: { kicker: 'Aktuelles VPS-Angebot', title: 'Windows VPS Server: Ressourcen nach Bedarf' },
  resources: (
    <>
      <p>
        Ein Windows VPS stellt Ihnen eine entfernte Windows-Umgebung für Software, Tests, Administration und
        Geschäftsabläufe bereit. Er passt auch, wenn Sie einen Windows-Desktop oder -Server brauchen, ohne die Maschine
        selbst zu betreiben.
      </p>
      <p>
        Planen Sie von der Software und den Nutzern aus. Ein Tarif, der für eine Anwendung reicht, reicht nicht
        unbedingt für mehrere gleichzeitige Sitzungen oder eine größere Installation.
      </p>
      <p>
        Sie greifen per Remotedesktop auf den Server zu. Wenn Remotedesktop der Hauptgrund für den Server ist, erklärt
        der
        {' '}
        <Link href={localeHref('/rdp-vps', 'de')}>RDP-VPS-Ratgeber</Link>
        , worauf es ankommt, und die
        {' '}
        <Link href="/docs/how-do-i-log-into-windows">Anleitung zur Remotedesktop-Anmeldung (Englisch)</Link>
        {' '}
        zeigt die Verbindung von jedem Gerät aus.
      </p>
      <div className="sr-inline-links">
        <Link href={`${localeHref('/plans', 'de')}#windows-vps`}>
          Windows-VPS-Angebot
          <ArrowRight size={16} />
        </Link>
        <Link href={`${localeHref('/plans', 'de')}#comparison`}>
          Tarifvergleich
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  ),
  faqTitle: 'Fragen zum Windows VPS',
  questions: [
    ['Was ist ein Windows vServer?', 'Ein Windows vServer, auch Windows VPS genannt, ist ein virtueller privater Server, auf dem Windows Server läuft. Er hat eigene Zuteilungen für CPU, RAM und NVMe-Speicher, und Sie verwalten ihn mit vollem Administratorzugriff.'],
    ['Kann ich bei StealthRDP einen Windows Server mieten?', 'Ja. Sie mieten den Server, statt Hardware zu kaufen: Sie zahlen monatlich oder wählen einen längeren Abrechnungszeitraum von 3, 6, 12 oder 24 Monaten. Die Windows-Lizenz ist nicht enthalten.'],
    ['Kann ich mich per Remotedesktop mit meinem Windows VPS verbinden?', 'Ja. Sie verbinden sich per Remotedesktop (RDP) von Windows, macOS, Linux, Android oder iOS. Das Hilfe-Center erklärt die Anmeldung mit jedem Client (auf Englisch).'],
    ['Gibt es Windows-VPS-Hosting in den USA und in Europa?', 'Ja. Windows-VPS-Tarife gibt es in den USA (Phoenix, Arizona) und in der EU (Amsterdam, Niederlande). Beide Rechenzentren sind DSGVO-konform. Wählen Sie den Standort, der Ihnen oder den Diensten, mit denen der Server arbeitet, am nächsten ist.'],
    ['Kann ich gewohnte Windows-Software nutzen?', 'Ein Windows VPS bietet eine Windows-Umgebung für kompatible Software. Prüfen Sie vor der Bestellung die Systemanforderungen jeder Anwendung.'],
    ['Haben die Windows-VPS-Tarife Administratorzugriff?', 'Ja. Alle VPS-Tarife enthalten vollen Administratorzugriff.'],
    ['Welche Windows-Server-Versionen laufen auf dem VPS?', 'Windows Server 2019, 2022 und 2025.'],
    ['Ist eine Microsoft-Windows-Lizenz enthalten?', 'Nein. Eine für den geplanten Einsatz nötige Microsoft-Lizenz liegt in Ihrer Verantwortung. Windows Server Evaluation kann zu Test- und Evaluierungszwecken bereitgestellt werden; das ist Testsoftware und keine dauerhaft lizenzierte Windows-Installation. Eigene, berechtigte Microsoft-Lizenzen dürfen Sie nutzen, soweit Microsofts Lizenzbedingungen das erlauben. Ob Ihre Lizenz für den gehosteten Einsatz gültig ist, prüfen Sie selbst.'],
    ['Wann ist mein Windows VPS aktiv?', 'Die meisten Server sind innerhalb von 60 Sekunden nach der Zahlungsbestätigung bereit. Bei hoher Auslastung kann es einige Minuten dauern.'],
    ['Wie erhalte ich meine Zugangsdaten?', 'StealthRDP sendet die Zugangsdaten nach der Zahlungsbestätigung per E-Mail.'],
    ['Wie wähle ich CPU, RAM und Speicher?', 'Gehen Sie von den Anforderungen Ihrer Software, der Zahl der Nutzer, der Rechenlast und der Datenmenge aus. Vergleichen Sie dann die verfügbaren Konfigurationen im Tarifvergleich.'],
    ['Wo bekomme ich Support?', 'Support gibt es rund um die Uhr per WhatsApp, über das Ticketsystem im Kundenbereich und per E-Mail.'],
    ['Darf ich jede Anwendung betreiben?', 'Nein. Die Nutzung muss legal sein und den Nutzungsbedingungen entsprechen.'],
  ],
  other: {
    title: 'Lieber Linux?',
    text: 'Für Websites, Anwendungen, Datenbanken oder Entwicklungsumgebungen eignet sich ein Linux VPS.',
    href: localeHref('/linux-vps', 'de'),
    label: 'Linux VPS',
  },
  cta: {
    kicker: 'Windows-VPS-Tarife',
    title: 'Windows-VPS-Tarife vergleichen',
    compare: 'Tarife vergleichen',
    compareHref: `${localeHref('/plans', 'de')}#windows-vps`,
    checkout: 'Weiter zur Bestellung',
    checkoutHref: localeHref('/plans', 'de'),
  },
};

export default page;

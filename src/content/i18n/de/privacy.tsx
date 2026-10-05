import type { PrivacyCopy } from '../en/privacy';

/* /de/privacy. A translation of the English policy: no added or changed terms. The English
   version is binding, and the page says so. The consent banner's names ("Akzeptieren",
   "Cookie-Einstellungen") match src/content/i18n/site.ts. */

const privacy: PrivacyCopy = {
  meta: {
    title: 'Datenschutzerklärung | StealthRDP',
    description: 'Datenschutzerklärung von StealthRDP: welche Daten wir erheben, wofür wir sie nutzen und wie wir sie schützen.',
  },
  tocLabel: 'Auf dieser Seite',
  kicker: 'Rechtliches',
  title: 'Datenschutzerklärung',
  updated: 'Zuletzt aktualisiert: Oktober 2026',
  binding: 'Dies ist eine Übersetzung zu Ihrer Information. Rechtlich maßgeblich ist die englische Fassung.',
  keyPointsLabel: 'Das Wichtigste',
  keyPoints: [
    'Wir verkaufen Ihre personenbezogenen Daten nicht.',
    'Vollständige Zahlungskartendaten speichern wir nicht auf unseren Servern.',
    'Sie können den Support bitten, Ihre Daten offenzulegen, zu berichtigen oder zu löschen.',
  ],
  sections: [
    {
      id: 'information-we-collect',
      title: 'Welche Daten wir erheben',
      body: <p>Wir erheben Daten, die Sie uns direkt geben, wenn Sie ein Konto anlegen, eine Bestellung aufgeben oder den Support kontaktieren: Ihren Namen, Ihre E-Mail-Adresse, Ihre Rechnungsdaten und alle Angaben, die Sie in Support-Anfragen machen. Außerdem erheben wir grundlegende technische Daten – IP-Adresse, Browsertyp und besuchte Seiten –, um unsere Dienste zu betreiben und zu verbessern.</p>,
    },
    {
      id: 'how-we-use-information',
      title: 'Wofür wir Ihre Daten nutzen',
      body: (
        <ul>
          <li>Bereitstellung, Wartung und Absicherung Ihrer Server und Ihres Kontos</li>
          <li>Abwicklung von Zahlungen und Betrugsvorbeugung</li>
          <li>Beantwortung von Support-Anfragen und Fehlerbehebung</li>
          <li>Versand von Dienstmitteilungen, Updates und transaktionsbezogenen Nachrichten</li>
          <li>Verbesserung unserer Website, unserer Dienste und des Kundenerlebnisses</li>
        </ul>
      ),
    },
    {
      id: 'payments',
      title: 'Zahlungen',
      body: <p>Zahlungen werden über unseren sicheren Abrechnungsdienstleister mit Verschlüsselung auf Bankniveau abgewickelt. Vollständige Zahlungskartendaten speichern wir nicht auf unseren Servern.</p>,
    },
    {
      id: 'data-sharing',
      title: 'Weitergabe von Daten',
      body: <p>Wir verkaufen Ihre personenbezogenen Daten nicht. Wir geben Daten nur an Dienstleister weiter, die uns beim Betrieb unseres Geschäfts helfen, und nur in dem Umfang, der für die Erbringung unserer Dienste nötig oder gesetzlich vorgeschrieben ist.</p>,
    },
    {
      id: 'cookies',
      title: 'Cookies, Analyse und Werbung',
      body: (
        <>
          <p>Diese Website nutzt die folgenden Dienste von Drittanbietern:</p>
          <ul>
            <li>Google Analytics 4 und Google Ads, über unseren Tag-Server unter sgtm.stealthrdp.com, um Besuche und Werbe-Conversions zu messen und Remarketing-Zielgruppen zu bilden</li>
            <li>Das Meta-Pixel, um Meta-Anzeigen zu messen</li>
            <li>DataFast, um Besuche zu zählen</li>
            <li>Ein Yandex-Webmaster-Skript von jsDelivr, um zu bestätigen, dass uns die Website gehört</li>
          </ul>
          <p>Diese Dienste können Cookies oder ähnliche Kennungen setzen und erhalten Ihre IP-Adresse, Browserdaten und die von Ihnen besuchten Seiten.</p>
          <p>In der EU, im EWR, im Vereinigten Königreich und in der Schweiz werden sie erst geladen, nachdem Sie „Akzeptieren“ gewählt haben. In anderen Ländern werden sie standardmäßig geladen. Ihre Wahl können Sie jederzeit über „Cookie-Einstellungen“ unten auf jeder Seite ändern.</p>
          <p>Außerdem speichern wir zwei technisch notwendige Angaben: Ihre Einwilligungsentscheidung in Ihrem Browser und ein Regions-Cookie (sr_region), das der Website mitteilt, welche Einwilligungsregel gilt.</p>
        </>
      ),
    },
    {
      id: 'retention-and-security',
      title: 'Aufbewahrung und Sicherheit',
      body: <p>Konto- und Abrechnungsunterlagen bewahren wir auf, soweit geschäftliche und rechtliche Gründe es erfordern. Wir treffen angemessene technische und organisatorische Maßnahmen, darunter isolierte Infrastruktur und eingeschränkte Zugriffe, um Ihre Daten zu schützen.</p>,
    },
    {
      id: 'your-rights',
      title: 'Ihre Rechte',
      body: <p>Sie können jederzeit Auskunft über Ihre personenbezogenen Daten sowie deren Berichtigung oder Löschung verlangen, indem Sie unser Support-Team kontaktieren. Datenschutzanfragen beantworten wir über den normalen Support-Prozess.</p>,
    },
    {
      id: 'contact',
      title: 'Kontakt',
      body: (
        <p>
          Bei Fragen zum Datenschutz schreiben Sie an
          {' '}
          <a href="mailto:support@stealthrdp.com">support@stealthrdp.com</a>
          {' '}
          oder nutzen Sie das StealthRDP-Supportportal.
        </p>
      ),
    },
  ],
};

export default privacy;

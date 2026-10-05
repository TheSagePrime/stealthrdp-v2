import type { FaqPageCopy } from '../en/faq';

/* /de/faq. No keyword target in keyword-map-de-de.json: the page answers questions people ask
   before they order, under the plain German heading "Häufige Fragen". */

const faq: FaqPageCopy = {
  meta: {
    title: 'Häufige Fragen zu VPS und vServer | StealthRDP',
    description: 'Antworten zu StealthRDP: Tarife, Standorte, Betriebssysteme, Einrichtung, Erstattung, IP-Wechsel, DSGVO, Windows-Lizenzen und Support.',
  },
  title: 'Häufige Fragen',
  description: 'Tarife, Einrichtung, Abrechnung, Betriebssysteme, Sicherheit und Support. Springen Sie direkt zu einem Thema.',
  topicsLabel: 'FAQ-Themen',
  unit: count => (count === 1 ? 'Antwort' : 'Antworten'),
  licensingPhrase: 'Seite zur Windows-Lizenzierung (Englisch)',
  iconHints: {
    'Leistungen und Tarife': 'Services & Plans',
    'Abrechnung': 'Pricing & Billing',
    'Konto': 'Account Management',
    'Support und Sicherheit': 'Technical Support & Security',
  },
  support: {
    title: 'Noch Fragen?',
    text: 'Fragen zu Ihrem Konto, zur Abrechnung oder zu einem bestimmten Server beantwortet der Support.',
    ticket: 'Support-Ticket eröffnen',
    whatsapp: 'Support per WhatsApp',
  },
};

export default faq;

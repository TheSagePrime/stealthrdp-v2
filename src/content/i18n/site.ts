import type { SiteLocale } from '../../config/i18n';

/* Words of the shared site frame (header, footer, cookie banner) in each language.
   German addresses the reader as "Sie", Spanish as "tú" (decisions.md, 2026-10-05). */

const en = {
  skipToContent: 'Skip to content',
  homeLabel: 'StealthRDP home',
  languageLabel: 'Language',
  whatsapp: {
    floatLabel: 'Open StealthRDP WhatsApp support',
    floatText: 'WhatsApp support',
  },
  header: {
    /* VPS plans are the button at the end of the bar, so they are not repeated here. */
    links: [
      ['DDoS Protection', '/citadel'],
      ['Server Status', '/status'],
      ['Resources', '/resources'],
      ['About', '/about'],
    ] as [string, string][],
    navLabel: 'Main navigation',
    mobileNavLabel: 'Mobile navigation',
    menu: 'Menu',
    support: 'Support',
    whatsapp: 'Message us on WhatsApp',
    login: 'Log In',
    viewPlans: 'VPS Plans',
  },
  footer: {
    description: 'Windows and Linux VPS infrastructure with USA and EU regions, NVMe storage and full administrative access.',
    highlightsLabel: 'StealthRDP service highlights',
    regions: ['USA + EU', 'regions'] as [string, string],
    support: ['24/7', 'support'] as [string, string],
    socialLabel: 'StealthRDP social links',
    navLabel: 'Footer navigation',
    /* Appended to links that lead to a page that exists in English only. */
    englishOnly: '',
    columns: [
      {
        title: 'Products',
        links: [
          ['VPS plans', '/plans'],
          ['DDoS protection', '/citadel'],
          ['Build your own VPS', 'https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps'],
        ],
      },
      {
        title: 'Resources',
        links: [
          ['Resources home', '/resources'],
          ['Guides', '/blog'],
          ['Help Center', '/docs'],
          ['Citadel Docs', '/citadel/docs'],
          ['Common questions', '/faq'],
          ['Server status', '/status'],
        ],
      },
      {
        title: 'Company',
        links: [
          ['About', '/about'],
          ['Support', 'https://dash.stealthrdp.com/submitticket.php'],
          ['WhatsApp support', 'https://wa.me/447441426993'],
          ['Privacy', '/privacy'],
          ['Use of service', '/docs/use-of-service'],
          ['Windows licensing', '/docs/windows-licensing'],
        ],
      },
    ] as { title: string; links: [string, string][] }[],
    copyright: '© 2026 StealthRDP. All rights reserved.',
    legal: [
      ['Privacy', '/privacy'],
      ['Use of service', '/docs/use-of-service'],
      ['Windows licensing', '/docs/windows-licensing'],
    ] as [string, string][],
  },
  consent: {
    title: 'Cookies for analytics and ads',
    text: 'With your consent we use Google Analytics, Google Ads, the Meta pixel and DataFast to measure visits and ads. The site works the same if you reject them.',
    details: 'Read the details',
    reject: 'Reject',
    accept: 'Accept',
    settings: 'Cookie settings',
  },
};

export type SiteCopy = typeof en;

const de: SiteCopy = {
  skipToContent: 'Zum Inhalt springen',
  homeLabel: 'StealthRDP Startseite',
  languageLabel: 'Sprache',
  whatsapp: {
    floatLabel: 'StealthRDP-Support auf WhatsApp öffnen',
    floatText: 'WhatsApp-Support',
  },
  header: {
    links: [
      ['DDoS-Schutz', '/citadel'],
      ['Serverstatus', '/status'],
      ['Ressourcen', '/resources'],
      ['Über uns', '/about'],
    ],
    navLabel: 'Hauptnavigation',
    mobileNavLabel: 'Mobile Navigation',
    menu: 'Menü',
    support: 'Support',
    whatsapp: 'Per WhatsApp schreiben',
    login: 'Anmelden',
    viewPlans: 'VPS-Tarife',
  },
  footer: {
    description: 'Windows- und Linux-VPS mit Standorten in den USA und der EU, NVMe-Speicher und vollem Administratorzugriff.',
    highlightsLabel: 'StealthRDP auf einen Blick',
    regions: ['USA + EU', 'Standorte'],
    support: ['24/7', 'Support'],
    socialLabel: 'StealthRDP in sozialen Netzwerken',
    navLabel: 'Fußzeilennavigation',
    englishOnly: ' (Englisch)',
    columns: [
      {
        title: 'Produkte',
        links: [
          ['VPS-Tarife', '/plans'],
          ['DDoS-Schutz', '/citadel'],
          ['Eigenen VPS zusammenstellen', 'https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps'],
        ],
      },
      {
        title: 'Ressourcen',
        links: [
          ['Ressourcen', '/resources'],
          ['Anleitungen', '/blog'],
          ['Hilfe-Center', '/docs'],
          ['Citadel-Dokumentation', '/citadel/docs'],
          ['Häufige Fragen', '/faq'],
          ['Serverstatus', '/status'],
        ],
      },
      {
        title: 'Unternehmen',
        links: [
          ['Über uns', '/about'],
          ['Support', 'https://dash.stealthrdp.com/submitticket.php'],
          ['WhatsApp-Support', 'https://wa.me/447441426993'],
          ['Datenschutz', '/privacy'],
          ['Nutzungsbedingungen', '/docs/use-of-service'],
          ['Windows-Lizenzierung', '/docs/windows-licensing'],
        ],
      },
    ],
    copyright: '© 2026 StealthRDP. Alle Rechte vorbehalten.',
    legal: [
      ['Datenschutz', '/privacy'],
      ['Nutzungsbedingungen', '/docs/use-of-service'],
      ['Windows-Lizenzierung', '/docs/windows-licensing'],
    ],
  },
  consent: {
    title: 'Cookies für Analyse und Werbung',
    text: 'Mit Ihrer Einwilligung nutzen wir Google Analytics, Google Ads, das Meta-Pixel und DataFast, um Besuche und Anzeigen zu messen. Die Website funktioniert genauso, wenn Sie ablehnen.',
    details: 'Details lesen',
    reject: 'Ablehnen',
    accept: 'Akzeptieren',
    settings: 'Cookie-Einstellungen',
  },
};

const es: SiteCopy = {
  skipToContent: 'Saltar al contenido',
  homeLabel: 'Inicio de StealthRDP',
  languageLabel: 'Idioma',
  whatsapp: {
    floatLabel: 'Abrir el soporte de StealthRDP en WhatsApp',
    floatText: 'Soporte por WhatsApp',
  },
  header: {
    links: [
      ['Protección DDoS', '/citadel'],
      ['Estado del servicio', '/status'],
      ['Recursos', '/resources'],
      ['Nosotros', '/about'],
    ],
    navLabel: 'Navegación principal',
    mobileNavLabel: 'Navegación móvil',
    menu: 'Menú',
    support: 'Soporte',
    whatsapp: 'Escríbenos por WhatsApp',
    login: 'Iniciar sesión',
    viewPlans: 'Planes VPS',
  },
  footer: {
    description: 'VPS Windows y Linux con regiones en EE. UU. y la UE, almacenamiento NVMe y acceso total de administrador.',
    highlightsLabel: 'StealthRDP en resumen',
    regions: ['EE. UU. + UE', 'regiones'],
    support: ['24/7', 'soporte'],
    socialLabel: 'StealthRDP en redes sociales',
    navLabel: 'Navegación del pie de página',
    englishOnly: ' (en inglés)',
    columns: [
      {
        title: 'Productos',
        links: [
          ['Planes VPS', '/plans'],
          ['Protección DDoS', '/citadel'],
          ['Configura tu propio VPS', 'https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps'],
        ],
      },
      {
        title: 'Recursos',
        links: [
          ['Recursos', '/resources'],
          ['Guías', '/blog'],
          ['Centro de ayuda', '/docs'],
          ['Documentación de Citadel', '/citadel/docs'],
          ['Preguntas frecuentes', '/faq'],
          ['Estado del servicio', '/status'],
        ],
      },
      {
        title: 'Empresa',
        links: [
          ['Sobre nosotros', '/about'],
          ['Soporte', 'https://dash.stealthrdp.com/submitticket.php'],
          ['Soporte por WhatsApp', 'https://wa.me/447441426993'],
          ['Privacidad', '/privacy'],
          ['Condiciones de uso', '/docs/use-of-service'],
          ['Licencias de Windows', '/docs/windows-licensing'],
        ],
      },
    ],
    copyright: '© 2026 StealthRDP. Todos los derechos reservados.',
    legal: [
      ['Privacidad', '/privacy'],
      ['Condiciones de uso', '/docs/use-of-service'],
      ['Licencias de Windows', '/docs/windows-licensing'],
    ],
  },
  consent: {
    title: 'Cookies de analítica y publicidad',
    text: 'Con tu consentimiento usamos Google Analytics, Google Ads, el píxel de Meta y DataFast para medir visitas y anuncios. La web funciona igual si los rechazas.',
    details: 'Leer los detalles',
    reject: 'Rechazar',
    accept: 'Aceptar',
    settings: 'Configuración de cookies',
  },
};

export const siteCopy: Record<SiteLocale, SiteCopy> = { en, de, es };

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
      ['Contact', '/contact'],
    ] as [string, string][],
    navLabel: 'Main navigation',
    mobileNavLabel: 'Mobile navigation',
    menu: 'Menu',
    closeMenu: 'Close menu',
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
          ['Windows VPS', '/windows-vps'],
          ['Linux VPS', '/linux-vps'],
          ['DDoS protection', '/citadel'],
          ['Build your own VPS', 'https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps'],
        ],
      },
      {
        title: 'Resources',
        links: [
          ['Resources home', '/resources'],
          ['Blog', '/blog'],
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
          ['Contact', '/contact'],
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
    title: 'We use cookies',
    text: 'to run the site and, if you allow, to measure visits and ads.',
    details: 'Read our terms',
    reject: 'Reject',
    accept: 'Accept',
    customize: 'Customize',
    save: 'Save choices',
    settings: 'Cookie settings',
    alwaysOn: 'Always on',
    categories: {
      necessary: ['Strictly necessary', 'Your cookie choice, the region cookie, and the login, cart and checkout sessions. The site cannot work without them.'],
      analytics: ['Analytics', 'Google Analytics and DataFast count visits and show which pages help.'],
      marketing: ['Marketing', 'Google Ads and the Meta pixel measure our ads and build audiences for them.'],
    } as Record<'necessary' | 'analytics' | 'marketing', [string, string]>,
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
      ['Kontakt', '/contact'],
    ],
    navLabel: 'Hauptnavigation',
    mobileNavLabel: 'Mobile Navigation',
    menu: 'Menü',
    closeMenu: 'Menü schließen',
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
          ['Windows VPS', '/windows-vps'],
          ['Linux VPS', '/linux-vps'],
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
          ['Kontakt', '/contact'],
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
    title: 'Wir nutzen Cookies',
    text: 'für den Betrieb der Website und, wenn Sie zustimmen, zur Messung von Besuchen und Anzeigen.',
    details: 'Unsere Bedingungen lesen',
    reject: 'Ablehnen',
    accept: 'Akzeptieren',
    customize: 'Anpassen',
    save: 'Auswahl speichern',
    settings: 'Cookie-Einstellungen',
    alwaysOn: 'Immer aktiv',
    categories: {
      necessary: ['Unbedingt erforderlich', 'Ihre Cookie-Wahl, das Regions-Cookie sowie Login-, Warenkorb- und Checkout-Sitzungen. Ohne sie funktioniert die Website nicht.'],
      analytics: ['Analyse', 'Google Analytics und DataFast zählen Besuche und zeigen, welche Seiten helfen.'],
      marketing: ['Marketing', 'Google Ads und das Meta-Pixel messen unsere Anzeigen und bilden Zielgruppen dafür.'],
    },
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
      ['Contacto', '/contact'],
    ],
    navLabel: 'Navegación principal',
    mobileNavLabel: 'Navegación móvil',
    menu: 'Menú',
    closeMenu: 'Cerrar menú',
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
          ['VPS Windows', '/windows-vps'],
          ['VPS Linux', '/linux-vps'],
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
          ['Contacto', '/contact'],
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
    title: 'Usamos cookies',
    text: 'para que la web funcione y, si lo permites, para medir visitas y anuncios.',
    details: 'Leer nuestras condiciones',
    reject: 'Rechazar',
    accept: 'Aceptar',
    customize: 'Personalizar',
    save: 'Guardar elección',
    settings: 'Configuración de cookies',
    alwaysOn: 'Siempre activas',
    categories: {
      necessary: ['Estrictamente necesarias', 'Tu elección de cookies, la cookie de región y las sesiones de acceso, carrito y pago. La web no funciona sin ellas.'],
      analytics: ['Analítica', 'Google Analytics y DataFast cuentan visitas y muestran qué páginas ayudan.'],
      marketing: ['Marketing', 'Google Ads y el píxel de Meta miden nuestros anuncios y crean audiencias para ellos.'],
    },
  },
};

export const siteCopy: Record<SiteLocale, SiteCopy> = { en, de, es };

import type { SiteLocale } from '../../config/i18n';

/* Section names of the docs shell: the sidebar switcher and the docs title. The rest of the
   Fumadocs interface takes its words from src/content/i18n/docs-ui.ts. */

const en = {
  tabs: {
    resources: 'Resources',
    guides: 'Blog',
    help: 'Help Center',
    citadel: 'Citadel Docs',
    faq: 'Common Questions',
  },
};

export type ResourcesCopy = typeof en;

const de: ResourcesCopy = {
  tabs: {
    resources: 'Ressourcen',
    guides: 'Blog',
    help: 'Hilfe-Center',
    citadel: 'Citadel-Doku',
    faq: 'Häufige Fragen',
  },
};

const es: ResourcesCopy = {
  tabs: {
    resources: 'Recursos',
    guides: 'Blog',
    help: 'Centro de ayuda',
    citadel: 'Docs de Citadel',
    faq: 'Preguntas frecuentes',
  },
};

export const resourcesCopy: Record<SiteLocale, ResourcesCopy> = { en, de, es };

/* Words of the German and Spanish resource pages: translated Help Center articles, Citadel docs and
   blog posts and their index pages (src/components/site/docs/TranslatedPages.tsx). English pages
   keep their own words. `groups` names the sidebar groups and index sections, keyed by the English
   collection title (src/lib/stealth/help-center.ts) or blog category (front matter `category`). */
export type ResourcePagesCopy = {
  languageName: string;
  home: string;
  /* {date} is the formatted date. */
  updated: string;
  published: string;
  /* {minutes} is the reading time. */
  minRead: string;
  overview: string;
  allArticles: string;
  sources: string;
  accessed: string;
  articles: string;
  answers: string;
  treeDescriptions: { help: string; citadel: string; guides: string };
  related: { docs: string; guides: string };
  support: {
    helpTitle: string;
    helpText: string;
    citadelTitle: string;
    citadelText: string;
    ticket: string;
    whatsapp: string;
    plans: string;
  };
  index: Record<'help' | 'citadel' | 'blog' | 'resources', { title: string; description: string; metaTitle: string; metaDescription: string }>;
  cards: Record<'help' | 'citadel' | 'blog' | 'faq', string>;
  latest: string;
  groups: Record<string, { title: string; description?: string }>;
};

const dePages: ResourcePagesCopy = {
  languageName: 'Deutsch',
  home: 'Startseite',
  updated: 'Aktualisiert am {date}',
  published: 'Veröffentlicht am',
  minRead: '{minutes} Min. Lesezeit',
  overview: 'Übersicht',
  allArticles: 'Alle Artikel',
  sources: 'Quellen und Referenzen',
  accessed: 'abgerufen am',
  articles: 'Artikel',
  answers: 'Antworten',
  treeDescriptions: { help: 'StealthRDP-Server', citadel: 'Layer-7-DDoS-Schutz', guides: 'VPS-Einsatzzwecke und Betrieb' },
  related: { docs: 'Weiter mit einer verwandten Aufgabe', guides: 'Weiterlesen' },
  support: {
    helpTitle: 'Brauchen Sie weitere Hilfe?',
    helpText: 'Anfragen zu Konto, Abrechnung und einzelnen Servern bearbeiten wir im Kundenbereich.',
    citadelTitle: 'Hilfe zu Citadel?',
    citadelText: 'Senden Sie die geschützte Domain, die ungefähre Uhrzeit, den Anfragepfad und eine Fehlermeldung oder einen Screenshot.',
    ticket: 'Support-Ticket öffnen',
    whatsapp: 'WhatsApp-Support',
    plans: 'VPS-Tarife ansehen',
  },
  index: {
    help: {
      title: 'StealthRDP Hilfe-Center',
      description: 'Anleitungen zu Einrichtung und Fehlerbehebung für StealthRDP-Server, geordnet nach der Aufgabe, die Sie erledigen möchten.',
      metaTitle: 'Hilfe-Center — StealthRDP',
      metaDescription: 'Anleitungen für StealthRDP-Server auf Deutsch: Einrichtung, Windows-Zugang, Fehlerbehebung, Netzwerk, Web-Panels und Richtlinien.',
    },
    citadel: {
      title: 'Citadel-Doku',
      description: 'Citadel einrichten und betreiben: Cloudflare-Routing, geschützte Domains, Challenges, Allowlists, Cache und Traffic-Auswertung.',
      metaTitle: 'Citadel-Doku — Layer-7-DDoS-Schutz',
      metaDescription: 'Citadel-Dokumentation auf Deutsch: Einrichtung, Cloudflare-Routing, Domains, Challenge-Stufen, Allowlists, Cache und Analysen.',
    },
    blog: {
      title: 'VPS-Ratgeber',
      description: 'VPS-Einsatzzwecke, Sicherheit, Leistung, Backups und Infrastrukturentscheidungen aus der Praxis.',
      metaTitle: 'VPS-Ratgeber — StealthRDP Blog',
      metaDescription: 'Praxisnahe VPS-Ratgeber auf Deutsch: Einsatzzwecke, Remote Desktop, Serververwaltung, Sicherheit, Backups und Infrastruktur.',
    },
    resources: {
      title: 'Anleitungen, Hilfe und Antworten',
      description: 'Ein Ort für VPS-Ratgeber, Einrichtungshilfe, Fehlerbehebung, Citadel-Dokumentation und häufige Fragen.',
      metaTitle: 'Ressourcen — StealthRDP',
      metaDescription: 'StealthRDP-Ratgeber, Hilfe-Artikel, Citadel-Dokumentation und Antworten auf häufige Fragen an einem Ort, auf Deutsch.',
    },
  },
  cards: {
    help: 'Einrichtung, Fehlerbehebung, Netzwerk, Windows-Zugang, Panels, Lizenzen und Richtlinien.',
    citadel: 'Cloudflare-Routing, geschützte Domains, Challenges, Allowlists und Traffic-Einblicke.',
    blog: 'VPS-Einsatzzwecke, Sicherheit, Leistung, Backups und Infrastrukturentscheidungen.',
    faq: 'Kurze Antworten zu Tarifen, Abrechnung, Einrichtung, Betriebssystemen, Erstattungen und Support.',
  },
  latest: 'Neu auf Deutsch',
  groups: {
    'Getting started': { title: 'Erste Schritte', description: 'Zugang, Neuinstallation und die ersten Verwaltungsaufgaben.' },
    'Windows & RDP': { title: 'Windows und RDP', description: 'Windows-Zugang, Testversion, Lizenzen und Korrekturen bei der Verwaltung.' },
    'Networking & VPN': { title: 'Netzwerk und VPN', description: 'VPN-Einrichtung, TUN/TAP und Netzwerkkonfiguration.' },
    'Web hosting & panels': { title: 'Webhosting und Panels', description: 'Control Panels, HTTPS und typische Aufgaben der Website-Verwaltung.' },
    'Account, billing & policies': { title: 'Konto, Abrechnung und Richtlinien', description: 'Nutzungsregeln, Zahlungsbedingungen, Pflichten und Kündigung.' },
    'Citadel: Start here': { title: 'Hier starten', description: 'Cloudflare verbinden, den Schutz verstehen und die erste Website aktivieren.' },
    'Citadel: Domains': { title: 'Domains', description: 'Geschützte Hostnamen, Origins, DNS und Erreichbarkeit verwalten.' },
    'Citadel: Protection': { title: 'Schutz', description: 'Challenge-Stufen, Ausnahmen, Branding, Cache und Maßnahmen bei Angriffen.' },
    'Citadel: Traffic': { title: 'Traffic', description: 'Anfrage-Logs, Analysen, Bandbreite und Geschwindigkeitslimits auswerten.' },
    'Citadel: Account': { title: 'Konto', description: 'Team, Benachrichtigungen, Abrechnung und Support verwalten.' },
    'Remote Desktop': { title: 'Remote Desktop' },
    'VPS Management': { title: 'VPS-Verwaltung' },
    'VPS Use Cases': { title: 'VPS-Einsatzzwecke' },
  },
};

const esPages: ResourcePagesCopy = {
  languageName: 'Español',
  home: 'Inicio',
  updated: 'Actualizado el {date}',
  published: 'Publicado el',
  minRead: '{minutes} min de lectura',
  overview: 'Resumen',
  allArticles: 'Todos los artículos',
  sources: 'Fuentes y referencias',
  accessed: 'consultado el',
  articles: 'artículos',
  answers: 'respuestas',
  treeDescriptions: { help: 'Servidores StealthRDP', citadel: 'Protección DDoS de capa 7', guides: 'Usos de un VPS y operación' },
  related: { docs: 'Sigue con una tarea relacionada', guides: 'Sigue leyendo' },
  support: {
    helpTitle: '¿Necesitas más ayuda?',
    helpText: 'Las solicitudes sobre tu cuenta, la facturación o un servidor concreto se gestionan en el área de clientes.',
    citadelTitle: '¿Necesitas ayuda con Citadel?',
    citadelText: 'Envía el dominio protegido, la hora aproximada, la ruta de la solicitud y el error o una captura de pantalla.',
    ticket: 'Abrir un ticket de soporte',
    whatsapp: 'Soporte por WhatsApp',
    plans: 'Ver planes VPS',
  },
  index: {
    help: {
      title: 'Centro de ayuda de StealthRDP',
      description: 'Guías de configuración y solución de problemas para servidores StealthRDP, organizadas según la tarea que quieres completar.',
      metaTitle: 'Centro de ayuda — StealthRDP',
      metaDescription: 'Guías en español para servidores StealthRDP: configuración, acceso a Windows, solución de problemas, red, paneles web y políticas.',
    },
    citadel: {
      title: 'Docs de Citadel',
      description: 'Configura y opera Citadel: enrutamiento con Cloudflare, dominios protegidos, desafíos, listas de permitidos, caché y análisis de tráfico.',
      metaTitle: 'Docs de Citadel — protección DDoS de capa 7',
      metaDescription: 'Documentación de Citadel en español: configuración, enrutamiento con Cloudflare, dominios, niveles de desafío, caché y análisis.',
    },
    blog: {
      title: 'Guías VPS',
      description: 'Usos de un VPS, seguridad, rendimiento, copias de seguridad y decisiones de infraestructura en la práctica.',
      metaTitle: 'Guías VPS — Blog de StealthRDP',
      metaDescription: 'Guías VPS prácticas en español: casos de uso, escritorio remoto, administración de servidores, seguridad, copias e infraestructura.',
    },
    resources: {
      title: 'Guías, ayuda y respuestas',
      description: 'Un solo lugar para guías VPS, ayuda de configuración, solución de problemas, documentación de Citadel y preguntas frecuentes.',
      metaTitle: 'Recursos — StealthRDP',
      metaDescription: 'Guías de StealthRDP, artículos de ayuda, documentación de Citadel y respuestas a preguntas frecuentes en un solo lugar, en español.',
    },
  },
  cards: {
    help: 'Configuración, solución de problemas, red, acceso a Windows, paneles, licencias y políticas.',
    citadel: 'Enrutamiento con Cloudflare, dominios protegidos, desafíos, listas de permitidos y tráfico.',
    blog: 'Usos de un VPS, seguridad, rendimiento, copias de seguridad y decisiones de infraestructura.',
    faq: 'Respuestas rápidas sobre planes, facturación, configuración, sistemas operativos, reembolsos y soporte.',
  },
  latest: 'Nuevo en español',
  groups: {
    'Getting started': { title: 'Primeros pasos', description: 'Acceso, reinstalación y las primeras tareas de administración.' },
    'Windows & RDP': { title: 'Windows y RDP', description: 'Acceso a Windows, versión de evaluación, licencias y soluciones de administración.' },
    'Networking & VPN': { title: 'Red y VPN', description: 'Configuración de VPN, TUN/TAP y ajustes de red.' },
    'Web hosting & panels': { title: 'Hosting web y paneles', description: 'Paneles de control, HTTPS y tareas habituales de administración web.' },
    'Account, billing & policies': { title: 'Cuenta, facturación y políticas', description: 'Normas de uso, condiciones de pago, responsabilidades y cancelación.' },
    'Citadel: Start here': { title: 'Empieza aquí', description: 'Conecta Cloudflare, entiende la protección y activa tu primer sitio.' },
    'Citadel: Domains': { title: 'Dominios', description: 'Gestiona hostnames protegidos, orígenes, DNS y estado.' },
    'Citadel: Protection': { title: 'Protección', description: 'Niveles de desafío, excepciones, marca, caché y control de incidentes.' },
    'Citadel: Traffic': { title: 'Tráfico', description: 'Revisa registros de solicitudes, análisis, ancho de banda y límites de velocidad.' },
    'Citadel: Account': { title: 'Cuenta', description: 'Gestiona tu equipo, alertas, facturación y soporte.' },
    'Remote Desktop': { title: 'Escritorio remoto' },
    'VPS Management': { title: 'Administración de VPS' },
    'VPS Use Cases': { title: 'Casos de uso de VPS' },
  },
};

export const resourcePagesCopy: Record<Exclude<SiteLocale, 'en'>, ResourcePagesCopy> = { de: dePages, es: esPages };

/* The localized name of a sidebar group or index section; English when no translation is listed. */
export function groupCopy(locale: Exclude<SiteLocale, 'en'>, group: string): { title: string; description?: string } {
  return resourcePagesCopy[locale].groups[group] ?? { title: group.replace(/^Citadel:\s*/, '') };
}

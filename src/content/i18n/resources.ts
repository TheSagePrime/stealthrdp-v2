import type { SiteLocale } from '../../config/i18n';

/* Words of the resource bar, its search box and the resources sidebar. The search index holds
   English pages only, so German and Spanish say so in the placeholder. */

const en = {
  tabs: {
    resources: 'Resources',
    guides: 'Guides',
    help: 'Help Center',
    citadel: 'Citadel Docs',
    faq: 'Common Questions',
  },
  resourcesHome: 'Resources home',
  sectionsLabel: 'Resource sections',
  search: {
    label: 'Search resources',
    placeholder: 'Search guides, help, Citadel and questions…',
    unavailable: 'Search is unavailable right now. Try again in a moment.',
    loading: 'Loading search…',
    empty: 'No matching resources. Try a broader phrase.',
  },
};

export type ResourcesCopy = typeof en;

const de: ResourcesCopy = {
  tabs: {
    resources: 'Ressourcen',
    guides: 'Anleitungen',
    help: 'Hilfe-Center',
    citadel: 'Citadel-Doku',
    faq: 'Häufige Fragen',
  },
  resourcesHome: 'Ressourcen-Übersicht',
  sectionsLabel: 'Ressourcen-Bereiche',
  search: {
    label: 'Ressourcen durchsuchen',
    placeholder: 'Englische Ressourcen durchsuchen…',
    unavailable: 'Die Suche ist gerade nicht verfügbar. Versuchen Sie es gleich noch einmal.',
    loading: 'Suche wird geladen…',
    empty: 'Keine passenden Ressourcen. Versuchen Sie einen allgemeineren Begriff.',
  },
};

const es: ResourcesCopy = {
  tabs: {
    resources: 'Recursos',
    guides: 'Guías',
    help: 'Centro de ayuda',
    citadel: 'Docs de Citadel',
    faq: 'Preguntas frecuentes',
  },
  resourcesHome: 'Inicio de recursos',
  sectionsLabel: 'Secciones de recursos',
  search: {
    label: 'Buscar en los recursos',
    placeholder: 'Buscar en guías y ayuda en inglés…',
    unavailable: 'La búsqueda no está disponible ahora mismo. Inténtalo de nuevo en un momento.',
    loading: 'Cargando la búsqueda…',
    empty: 'No hay recursos que coincidan. Prueba con una frase más general.',
  },
};

export const resourcesCopy: Record<SiteLocale, ResourcesCopy> = { en, de, es };

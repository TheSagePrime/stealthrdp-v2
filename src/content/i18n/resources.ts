import type { SiteLocale } from '../../config/i18n';

/* Words of the resource bar above guides, questions and the resources hub. The search dialog
   itself takes its words from src/content/i18n/docs-ui.ts. */

const en = {
  tabs: {
    resources: 'Resources',
    guides: 'Guides',
    help: 'Help Center',
    citadel: 'Citadel Docs',
    faq: 'Common Questions',
  },
  sectionsLabel: 'Resource sections',
  search: {
    label: 'Search resources',
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
  sectionsLabel: 'Ressourcen-Bereiche',
  search: {
    label: 'Ressourcen durchsuchen',
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
  sectionsLabel: 'Secciones de recursos',
  search: {
    label: 'Buscar en los recursos',
  },
};

export const resourcesCopy: Record<SiteLocale, ResourcesCopy> = { en, de, es };

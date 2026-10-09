import type { SiteLocale } from '../../config/i18n';

/* Section names of the docs shell: the sidebar switcher and the docs title. The rest of the
   Fumadocs interface takes its words from src/content/i18n/docs-ui.ts. */

const en = {
  tabs: {
    resources: 'Resources',
    guides: 'Guides',
    help: 'Help Center',
    citadel: 'Citadel Docs',
    faq: 'Common Questions',
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
};

const es: ResourcesCopy = {
  tabs: {
    resources: 'Recursos',
    guides: 'Guías',
    help: 'Centro de ayuda',
    citadel: 'Docs de Citadel',
    faq: 'Preguntas frecuentes',
  },
};

export const resourcesCopy: Record<SiteLocale, ResourcesCopy> = { en, de, es };

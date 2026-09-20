import { I18nConfig } from '@/config/i18n';

export const AppConfig = {
  name: 'Sage Prime Web Foundation',
  i18n: I18nConfig,
  email: {
    support: 'support@thesageprime.com',
  },
} as const;

export { AllLocales } from '@/config/i18n';

import { I18nConfig } from '@/config/i18n';

export const AppConfig = {
  name: 'StealthRDP',
  i18n: I18nConfig,
  email: {
    support: 'support@stealthrdp.com',
  },
} as const;

export { AllLocales } from '@/config/i18n';
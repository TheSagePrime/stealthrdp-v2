import type { LocalizationResource } from '@clerk/shared/types';
import { enUS, frFR } from '@clerk/localizations';
import { I18nConfig } from '@/config/i18n';

export const AppConfig = {
  name: 'Sage Prime Product Foundation',
  i18n: I18nConfig,
  email: {
    support: 'support@thesageprime.com',
  },
} as const;

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
  fr: frFR,
};

export const ClerkLocalizations = {
  defaultLocale: enUS,
  supportedLocales,
};

export { AllLocales } from '@/config/i18n';

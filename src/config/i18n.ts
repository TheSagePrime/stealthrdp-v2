import type { LocalePrefixMode } from 'next-intl/routing';
import type { AppLocale } from '../types/I18n';

export const I18nConfig = {
  locales: [{ id: 'en', name: 'English' }] satisfies AppLocale[],
  defaultLocale: 'en',
  localePrefix: 'never' as LocalePrefixMode,
} as const;

export const AllLocales = I18nConfig.locales.map(locale => locale.id);

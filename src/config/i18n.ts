import type { LocalePrefixMode } from 'next-intl/routing';
import type { AppLocale } from '../types/I18n';

/**
 * Single source of truth for application locale routing.
 * SEO derives localized canonicals, hreflang and sitemap URLs from this config.
 */
export const I18nConfig = {
  locales: [
    {
      id: 'en',
      name: 'English',
    },
    {
      id: 'fr',
      name: 'Français',
    },
  ] satisfies AppLocale[],
  defaultLocale: 'en',
  localePrefix: 'as-needed' as LocalePrefixMode,
} as const;

export const AllLocales = I18nConfig.locales.map(locale => locale.id);

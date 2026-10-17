import { defineRouting } from 'next-intl/routing';
import { AllLocales, AppConfig } from '@/utils/AppConfig';

export const routing = defineRouting({
  locales: AllLocales,
  localePrefix: AppConfig.i18n.localePrefix,
  defaultLocale: AppConfig.i18n.defaultLocale,
  /* The URL alone decides the language. No redirect by browser language or country (Google crawls
     mostly from the US and must reach every version), no cookie, and no `Link` header: the pages
     declare their own hreflang, only for the languages they really exist in. */
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
});

import type { LocalePrefixMode } from 'next-intl/routing';
import type { AppLocale } from '../types/I18n';

/* English stays at the root (`/plans`); German and Spanish live under `/de` and `/es`.
   `hreflang` is the language code alone, so `es` also reaches Latin America. */
export const I18nConfig = {
  locales: [
    { id: 'en', name: 'English' },
    { id: 'de', name: 'Deutsch' },
    { id: 'es', name: 'Español' },
  ] as const satisfies readonly AppLocale[],
  defaultLocale: 'en',
  localePrefix: 'as-needed' as LocalePrefixMode,
} as const;

export type SiteLocale = (typeof I18nConfig.locales)[number]['id'];

export const AllLocales: SiteLocale[] = I18nConfig.locales.map(locale => locale.id);

/* The pages that exist in each language besides English. A page appears in a language only when it
   is written for that market (keyword maps in .sageprime/seo). Everything else stays English-only:
   no hreflang, no sitemap entry and a 404 under the language prefix. */
const localizedRoutes: Readonly<Record<Exclude<SiteLocale, 'en'>, readonly string[]>> = {
  de: ['/', '/plans', '/windows-vps', '/linux-vps', '/faq', '/about', '/status'],
  es: ['/', '/plans', '/windows-vps', '/linux-vps', '/faq', '/about', '/status'],
};

export function isSiteLocale(value: string): value is SiteLocale {
  return (AllLocales as readonly string[]).includes(value);
}

/* The languages a logical (unprefixed) path is published in, English first. */
export function routeLocales(path: string): SiteLocale[] {
  return AllLocales.filter(locale => locale === 'en' || localizedRoutes[locale].includes(path));
}

export function isRouteLocalized(path: string, locale: string): boolean {
  return isSiteLocale(locale) && routeLocales(path).includes(locale);
}

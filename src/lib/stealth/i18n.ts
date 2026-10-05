import type { SiteLocale } from '../../config/i18n';
import { I18nConfig, isRouteLocalized, isSiteLocale, routeLocales } from '../../config/i18n';

/* Language helpers for links and formatting. Relative imports only: the SEO scripts load this
   module outside Next.js. */

export function asSiteLocale(value: string | undefined): SiteLocale {
  return value && isSiteLocale(value) ? value : I18nConfig.defaultLocale;
}

function splitHref(href: string): [string, string] {
  const index = href.search(/[?#]/);
  return index === -1 ? [href, ''] : [href.slice(0, index), href.slice(index)];
}

/* The URL of a page in one language: `/de/plans` when the page is published in German, the
   English URL otherwise (German visitors may still need an English-only guide). External and
   anchor-only links are returned unchanged. */
export function localeHref(href: string, locale: SiteLocale): string {
  if (!href.startsWith('/') || href.startsWith('//')) {
    return href;
  }
  const [path, suffix] = splitHref(href);
  if (locale === I18nConfig.defaultLocale || !isRouteLocalized(path, locale)) {
    return href;
  }
  return `/${locale}${path === '/' ? '' : path}${suffix}`;
}

/* The logical (English) path of a URL, with any language prefix removed. */
export function logicalPath(pathname: string): { path: string; locale: SiteLocale } {
  for (const locale of I18nConfig.locales.map(item => item.id)) {
    if (pathname === `/${locale}`) {
      return { path: '/', locale };
    }
    if (pathname.startsWith(`/${locale}/`)) {
      return { path: pathname.slice(locale.length + 1), locale };
    }
  }
  return { path: pathname || '/', locale: I18nConfig.defaultLocale };
}

/* Every version of a logical path, for a language switcher. */
export function languageVersions(path: string): { locale: SiteLocale; name: string; href: string }[] {
  return routeLocales(path).map(locale => ({
    locale,
    name: I18nConfig.locales.find(item => item.id === locale)?.name ?? locale,
    href: localeHref(path, locale),
  }));
}

const numberLocales: Record<SiteLocale, string> = { en: 'en-US', de: 'de-DE', es: 'es-ES' };

/* Prices in EUR as each market writes them: €4.59 in English, 4,59 € in German and Spanish. */
export function formatEuro(amount: number, locale: SiteLocale): string {
  if (locale === I18nConfig.defaultLocale) {
    return `€${amount.toFixed(2)}`;
  }
  return new Intl.NumberFormat(numberLocales[locale], {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount).replace(/\xA0/g, ' ');
}

/* Fills {name} placeholders in a translated string. Client components get plain strings, not
   functions, so templated words use placeholders. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

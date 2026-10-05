import type { SeoConfig } from '../../config/seo';
import { AllLocales, I18nConfig, routeLocales } from '../../config/i18n';
import { normalizePathname } from './normalize';

export function localePrefixFor(locale: string): string {
  if (AllLocales.length <= 1 || I18nConfig.localePrefix === 'never') {
    return '';
  }
  if (I18nConfig.localePrefix === 'as-needed' && locale === I18nConfig.defaultLocale) {
    return '';
  }
  return `/${locale}`;
}

export function localizedPath(pathname: string, locale: string, config: Pick<SeoConfig, 'url'>): string {
  const path = normalizePathname(pathname, config.url.trailingSlash);
  const prefix = localePrefixFor(locale);
  if (!prefix) {
    return path;
  }
  if (path === '/') {
    return normalizePathname(prefix, config.url.trailingSlash);
  }
  return normalizePathname(`${prefix}${path}`, config.url.trailingSlash);
}

export function stripLocalePrefix(pathname: string, config: Pick<SeoConfig, 'url'>): { path: string; locale?: string } {
  const path = normalizePathname(pathname, config.url.trailingSlash);
  if (I18nConfig.localePrefix === 'never' || AllLocales.length <= 1) {
    return { path };
  }

  for (const locale of AllLocales) {
    const prefix = `/${locale}`;
    if (path === prefix) {
      return { path: '/', locale };
    }
    if (path.startsWith(`${prefix}/`)) {
      return {
        path: normalizePathname(path.slice(prefix.length), config.url.trailingSlash),
        locale,
      };
    }
  }

  return {
    path,
    locale: I18nConfig.localePrefix === 'as-needed' ? I18nConfig.defaultLocale : undefined,
  };
}

/* The localized URLs of a logical path, one per language the page is published in
   (`localizedRoutes` in src/config/i18n.ts). English-only pages return their one URL. */
export function localizedRoutePaths(pathname: string, config: Pick<SeoConfig, 'url'>): string[] {
  if (AllLocales.length <= 1 || I18nConfig.localePrefix === 'never') {
    return [normalizePathname(pathname, config.url.trailingSlash)];
  }
  const logical = normalizePathname(pathname, config.url.trailingSlash);
  return routeLocales(logical).map(locale => localizedPath(logical, locale, config));
}

/* hreflang targets for a logical path: one per published language plus `x-default` (English).
   Empty for a page that exists in English only, which then declares no alternates at all. */
export function hreflangAlternates(pathname: string, config: Pick<SeoConfig, 'url'>): Record<string, string> {
  const logical = normalizePathname(pathname, config.url.trailingSlash);
  const locales = routeLocales(logical);
  if (locales.length <= 1) {
    return {};
  }
  return {
    ...Object.fromEntries(locales.map(locale => [locale, localizedPath(logical, locale, config)])),
    'x-default': localizedPath(logical, I18nConfig.defaultLocale, config),
  };
}

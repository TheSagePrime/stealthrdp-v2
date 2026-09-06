import type { SeoConfig } from '../../config/seo';
import { AllLocales, I18nConfig } from '../../config/i18n';
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

export function localizedRoutePaths(pathname: string, config: Pick<SeoConfig, 'url'>): string[] {
  if (AllLocales.length <= 1 || I18nConfig.localePrefix === 'never') {
    return [normalizePathname(pathname, config.url.trailingSlash)];
  }
  return AllLocales.map(locale => localizedPath(pathname, locale, config));
}

import type { SiteLocale } from '../../config/i18n';
import { localeHref } from '../../lib/stealth/i18n';

/* The first breadcrumb step in structured data, in the page's language. */
const names: Record<SiteLocale, string> = { en: 'Home', de: 'Startseite', es: 'Inicio' };

export function homeCrumb(locale: SiteLocale): { name: string; path: string } {
  const href = localeHref('/', locale);
  return { name: names[locale], path: href === '/' ? '' : href };
}

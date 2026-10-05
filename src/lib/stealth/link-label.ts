import type { SiteLocale } from '../../config/i18n';
import { isRouteLocalized } from '../../config/i18n';
import { siteCopy } from '../../content/i18n/site';

/* A link label, marked as English when the target page has no version in this language. */
export function linkLabel(label: string, href: string, locale: SiteLocale): string {
  const path = href.replace(/[?#].*$/, '');
  return isRouteLocalized(path, locale) ? label : `${label}${siteCopy[locale].footer.englishOnly}`;
}

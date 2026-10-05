import type { Metadata } from 'next';
import type { SiteLocale } from '@/config/i18n';
import type { PageMetadataInput } from '@/libs/seo/metadata';
import { notFound } from 'next/navigation';
import { locale as localeParam } from 'next/root-params';
import { isRouteLocalized } from '@/config/i18n';
import { createPageMetadata } from '@/libs/seo/metadata';
import { asSiteLocale } from './i18n';

/* The language of the page being rendered, from the [locale] root segment. */
export async function pageLocale(): Promise<SiteLocale> {
  return asSiteLocale(await localeParam());
}

/* The language of a page that must exist in it. A German or Spanish URL for a page that is not
   published in that language returns 404 instead of an English page under a /de or /es URL. */
export async function requirePageLocale(path: string): Promise<SiteLocale> {
  const locale = await pageLocale();
  if (!isRouteLocalized(path, locale)) {
    notFound();
  }
  return locale;
}

type LocalizedMetadata = Omit<PageMetadataInput, 'locale' | 'path' | 'config'>;

/* Page metadata in the page's language. Unpublished languages get no metadata: the page 404s. */
export async function localizedPageMetadata(
  path: string,
  byLocale: Partial<Record<SiteLocale, LocalizedMetadata>> & { en: LocalizedMetadata },
): Promise<Metadata> {
  const locale = await pageLocale();
  if (!isRouteLocalized(path, locale)) {
    return {};
  }
  return createPageMetadata({ path, locale, ...(byLocale[locale] ?? byLocale.en) });
}

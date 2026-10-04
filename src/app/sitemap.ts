import type { MetadataRoute } from 'next';
import { AllLocales } from '@/config/i18n';
import { resolveSeoSite } from '@/config/seo';
import { citadelDocPublicPaths, indexableDocPublicPaths } from '@/lib/stealth/articles';
import { pageUpdated } from '@/lib/stealth/page-dates';
import { buildArticleSitemapEntries } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';
import { localizedPath } from '@/libs/seo/locale';
import { canonicalUrlForPath } from '@/libs/seo/normalize';

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getSeoConfig();
  const site = resolveSeoSite(config);
  /* dynamicPublic holds indexable one-off marketing pages (the Minecraft guide),
     so it belongs in the sitemap beside the fixed marketing routes. */
  const routes = [
    ...config.routes.publicMarketing,
    ...(config.routes.dynamicPublic ?? []),
    ...indexableDocPublicPaths,
    ...citadelDocPublicPaths,
  ];
  /* lastmod comes from scripts/page-dates.mjs and moves only when a page's words change. */
  const routeEntries = routes.flatMap((route) => {
    const lastModified = pageUpdated(route);
    return AllLocales.map(locale => ({
      url: canonicalUrlForPath(localizedPath(route, locale, config), site, config),
      ...(lastModified ? { lastModified } : {}),
    }));
  });
  const entries = [...routeEntries, ...buildArticleSitemapEntries(config, site)];
  return [...new Map(entries.map(entry => [entry.url, entry])).values()];
}

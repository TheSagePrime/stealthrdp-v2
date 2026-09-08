import type { MetadataRoute } from 'next';
import { AllLocales } from '@/config/i18n';
import { resolveSeoSite } from '@/config/seo';
import { buildArticleSitemapEntries } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';
import { localizedPath } from '@/libs/seo/locale';
import { canonicalUrlForPath } from '@/libs/seo/normalize';

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getSeoConfig();
  const site = resolveSeoSite(config);
  const routes = [...config.routes.publicMarketing, ...(config.routes.dynamicPublic ?? [])];
  const routeEntries = routes.flatMap(route =>
    AllLocales.map(locale => ({
      url: canonicalUrlForPath(localizedPath(route, locale, config), site, config),
      ...(AllLocales.length > 1
        ? {
            alternates: {
              languages: Object.fromEntries(
                AllLocales.map(item => [item, canonicalUrlForPath(localizedPath(route, item, config), site, config)]),
              ),
            },
          }
        : {}),
    })),
  );
  const entries = [...routeEntries, ...buildArticleSitemapEntries(config, site)];

  return [...new Map(entries.map(entry => [entry.url, entry])).values()];
}

import type { MetadataRoute } from 'next';
import { resolveSeoSite } from '@/config/seo';
import { citadelDocPublicPaths, indexableDocPublicPaths } from '@/lib/stealth/articles';
import { pageUpdated } from '@/lib/stealth/page-dates';
import { buildArticleSitemapEntries } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';
import { hreflangAlternates, localizedRoutePaths } from '@/libs/seo/locale';
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
    /* One entry per language the page is published in; each lists all versions as hreflang
       alternates. English-only pages get one entry and no alternates. */
    const languages = Object.fromEntries(
      Object.entries(hreflangAlternates(route, config)).map(([lang, path]) => [lang, canonicalUrlForPath(path, site, config)]),
    );
    return localizedRoutePaths(route, config).map((path) => {
      const lastModified = pageUpdated(path);
      return {
        url: canonicalUrlForPath(path, site, config),
        ...(lastModified ? { lastModified } : {}),
        ...(Object.keys(languages).length > 0 ? { alternates: { languages } } : {}),
      };
    });
  });
  const entries = [...routeEntries, ...buildArticleSitemapEntries(config, site)];
  return [...new Map(entries.map(entry => [entry.url, entry])).values()];
}

import type { MetadataRoute } from 'next';
import { AllLocales } from '@/config/i18n';
import { getSeoConfig } from '@/libs/seo/config';
import { localizedPath } from '@/libs/seo/locale';
import { canonicalUrlForPath } from '@/libs/seo/normalize';
import { resolveSiteUrl } from '@/libs/seo/site-url';

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getSeoConfig();
  const site = resolveSiteUrl(process.env, config.environment.deployEnv);
  const routes = [
    ...config.routes.publicMarketing,
    ...(config.routes.dynamicPublic ?? []),
  ];

  return routes.flatMap(route => AllLocales.map(locale => ({
    url: canonicalUrlForPath(localizedPath(route, locale, config), site, config),
    ...(AllLocales.length > 1
      ? {
          alternates: {
            languages: Object.fromEntries(
              AllLocales.map(item => [
                item,
                canonicalUrlForPath(localizedPath(route, item, config), site, config),
              ]),
            ),
          },
        }
      : {}),
  })));
}

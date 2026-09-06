import type { MetadataRoute } from 'next';
import { getSeoConfig } from '@/libs/seo/config';
import { canonicalUrlForPath } from '@/libs/seo/normalize';
import { resolveSiteUrl } from '@/libs/seo/site-url';
import { getBaseUrl } from '@/utils/Helpers';

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getSeoConfig();
  const site = resolveSiteUrl(process.env, config.environment.deployEnv);
  const origin = getBaseUrl();
  const routes = [
    ...config.routes.publicMarketing,
    ...(config.routes.dynamicPublic ?? []),
  ];

  return routes.map(route => ({
    url: canonicalUrlForPath(route, { ...site, origin }, config),
  }));
}

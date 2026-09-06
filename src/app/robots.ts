import type { MetadataRoute } from 'next';
import { getSeoConfig } from '@/libs/seo/config';
import { isProductionDeployEnv } from '@/libs/seo/env';

export default function robots(): MetadataRoute.Robots {
  const config = getSeoConfig();
  const sitemap = `${config.siteUrl}/sitemap.xml`;

  if (!isProductionDeployEnv(config.environment.deployEnv)) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap,
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        ...config.routes.privatePages,
        ...config.routes.privateApis,
      ],
    },
    sitemap,
  };
}

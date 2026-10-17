import type { MetadataRoute } from 'next';
import { getSeoConfig } from '@/libs/seo/config';
import { isProductionDeployEnv } from '@/libs/seo/env';

export default function robots(): MetadataRoute.Robots {
  const config = getSeoConfig();
  const sitemap = `${config.siteUrl}/sitemap.xml`;

  if (!isProductionDeployEnv(config.environment.deployEnv)) {
    return { rules: { userAgent: '*', disallow: '/' }, sitemap };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /* Every crawler, AI crawlers included. No Content-Signal line: no major crawler reads it and
         Bing's robots.txt tester reports it as a syntax error (owner decision, 2026-10-05). */
      disallow: ['/api/'],
    },
    sitemap,
  };
}

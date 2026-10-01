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
      disallow: ['/api/'],
      /* Same AI policy as the v1 site: no model training, yes to search and AI answers. */
      other: { 'Content-Signal': 'ai-train=no, search=yes, ai-input=yes' },
    },
    sitemap,
  };
}

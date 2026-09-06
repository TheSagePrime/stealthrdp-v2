import type { Metadata } from 'next';
import type { SeoConfig } from '../../config/seo';
import { classifyPath, robotsForClass } from './classify';
import { getSeoConfig } from './config';
import { canonicalUrlForPath } from './normalize';
import { resolveSiteUrl } from './site-url';

export type PageMetadataInput = {
  path: string;
  title?: string;
  description?: string;
  locale?: string;
  ogImage?: string;
  config?: SeoConfig;
};

function robotsMetadata(content: ReturnType<typeof robotsForClass>): Metadata['robots'] {
  const index = content.startsWith('index');
  const follow = content.endsWith('follow') && !content.includes('nofollow');
  return { index, follow };
}

/**
 * Builds Next.js metadata for a public or utility path.
 * Canonical URLs always use SITE_URL, never the request host.
 */
export function createPageMetadata(input: PageMetadataInput): Metadata {
  const config = input.config ?? getSeoConfig();
  const site = resolveSiteUrl(process.env, config.environment.deployEnv);
  const routeClass = classifyPath(input.path, config);
  const canonical = canonicalUrlForPath(input.path, site, config);
  const title = input.title ?? config.projectName;
  const description = input.description ?? config.description;
  const robots = robotsForClass(routeClass);

  if (routeClass === 'privatePage' || routeClass === 'privateApi') {
    return {
      title,
      description,
      robots: robotsMetadata('noindex, nofollow'),
    };
  }

  const metadata: Metadata = {
    title,
    description,
    robots: robotsMetadata(robots),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      ...(input.ogImage ? { images: [{ url: input.ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(input.ogImage ? { images: [input.ogImage] } : {}),
    },
  };

  if (input.locale) {
    metadata.other = {
      'content-language': input.locale,
    };
  }

  return metadata;
}

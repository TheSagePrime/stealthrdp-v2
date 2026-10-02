import type { Metadata } from 'next';
import type { SeoConfig } from '../../config/seo';
import { AllLocales, I18nConfig } from '../../config/i18n';
import { resolveSeoSite } from '../../config/seo';
import { classifyPath, robotsForClass } from './classify';
import { getSeoConfig } from './config';
import { localizedPath } from './locale';
import { canonicalUrlForPath } from './normalize';

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

export function createPageMetadata(input: PageMetadataInput): Metadata {
  const config = input.config ?? getSeoConfig();
  const site = resolveSeoSite(config);
  const routeClass = classifyPath(input.path, config);
  const locale = input.locale ?? I18nConfig.defaultLocale;
  const localized = localizedPath(input.path, locale, config);
  const canonical = canonicalUrlForPath(localized, site, config);
  const title = input.title ?? config.projectName;
  const description = input.description ?? config.description;
  /* Per-route robots policy from the route class. Non-production environments stay
     out of the index through robots.txt (disallow all) and the X-Robots-Tag header
     set in next.config.ts — the built HTML keeps its production robots semantics so
     the SEO post-build audit stays meaningful in preview builds. */
  const robots = robotsForClass(routeClass);

  if (routeClass === 'privatePage' || routeClass === 'privateApi') {
    return {
      title,
      description,
      robots: robotsMetadata('noindex, nofollow'),
    };
  }

  const languages = Object.fromEntries(
    AllLocales.map(item => [item, canonicalUrlForPath(localizedPath(input.path, item, config), site, config)]),
  );

  const metadata: Metadata = {
    title,
    description,
    robots: robotsMetadata(robots),
    alternates: {
      canonical,
      ...(AllLocales.length > 1 ? { languages } : {}),
      types: { 'application/rss+xml': `${site.origin}${config.articles.feedPath}` },
    },
    openGraph: {
      type: 'website',
      siteName: config.projectName,
      title,
      description,
      url: canonical,
      locale,
      ...(input.ogImage ? { images: [{ url: input.ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(input.ogImage ? { images: [input.ogImage] } : {}),
    },
    other: {
      'content-language': locale,
    },
  };

  return metadata;
}

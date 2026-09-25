import type { Metadata } from 'next';
import type { SeoConfig } from '../../config/seo';
import { AllLocales, I18nConfig } from '../../config/i18n';
import { resolveSeoSite } from '../../config/seo';
import { classifyPath, robotsForClass } from './classify';
import { getSeoConfig } from './config';
import { isProductionDeployEnv } from './env';
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
  /* Non-production environments (preview, staging, dev) are never indexable,
     regardless of route class. Production keeps the per-route behavior. */
  const robots = isProductionDeployEnv(config.environment.deployEnv)
    ? robotsForClass(routeClass)
    : 'noindex, nofollow';

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
    },
    openGraph: {
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

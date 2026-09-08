import type { ArticleRegistryConfig } from '../libs/seo/articles';
import type { DeployEnv } from '../libs/seo/env';
import type { LegacyRedirect } from '../libs/seo/internal-links';
import type { ResolvedSiteUrl } from '../libs/seo/site-url';
import { parseSiteUrl, resolveSiteUrl } from '../libs/seo/site-url';

export type SeoConfig = {
  siteUrl: string;
  projectName?: string;
  description?: string;

  environment: {
    deployEnv: DeployEnv;
  };

  url: {
    trailingSlash: 'strip' | 'append';
    trackingParams: string[];
    legacyRedirects?: readonly LegacyRedirect[];
    legacyInternalLinkPolicy?: 'warn' | 'fail';
  };

  articles: ArticleRegistryConfig;

  brand?: {
    companyName?: string;
    logoUrl?: string;
    socialProfiles?: string[];
  };

  softwareApp?: {
    category?: string;
    operatingSystem?: string;
    priceRange?: string;
  };

  routes: {
    publicMarketing: string[];
    publicUtility: string[];
    privatePages: string[];
    privateApis: string[];
    dynamicPublic?: string[];
  };
};

export function resolveSeoSite(config: Pick<SeoConfig, 'siteUrl' | 'environment'>): ResolvedSiteUrl {
  if (config.siteUrl.trim()) {
    return parseSiteUrl(config.siteUrl, { production: config.environment.deployEnv === 'production' });
  }
  return resolveSiteUrl(process.env, config.environment.deployEnv);
}

/**
 * Starter defaults list only routes that exist in this repository.
 * Child projects replace this object with their real routes and identity.
 */
export const defaultSeoConfig: SeoConfig = {
  siteUrl: '',
  environment: {
    deployEnv: 'development',
  },
  url: {
    trailingSlash: 'strip',
    trackingParams: ['utm_*', 'fbclid', 'gclid'],
  },
  articles: {
    basePath: '/blog',
    feedPath: '/rss.xml',
    defaultIndexPolicy: 'index, follow',
    publications: [],
  },
  routes: {
    publicMarketing: ['/'],
    publicUtility: ['/sign-in', '/sign-up'],
    privatePages: ['/dashboard', '/onboarding'],
    privateApis: [],
    dynamicPublic: [],
  },
};

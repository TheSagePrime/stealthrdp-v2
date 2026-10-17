import type { ArticleRegistryConfig } from '../libs/seo/articles';
import type { DeployEnv } from '../libs/seo/env';
import type { LegacyRedirect } from '../libs/seo/internal-links';
import type { ResolvedSiteUrl } from '../libs/seo/site-url';
import { articlePath, blogArticles } from '../lib/stealth/articles';
import { pageUpdated } from '../lib/stealth/page-dates';
import { noindexDocPaths } from '../lib/stealth/routes';
import { parseSiteUrl, resolveSiteUrl } from '../libs/seo/site-url';

const publications: ArticleRegistryConfig['publications'] = blogArticles.map(article => ({
  slug: article.slug,
  status: 'published',
  path: articlePath(article),
  title: article.title,
  h1: article.title,
  description: article.excerpt,
  datePublished: article.date,
  dateModified: pageUpdated(articlePath(article)),
  author: { name: 'StealthRDP Team', type: 'Organization' },
  locale: 'en',
  country: 'US',
  indexPolicy: 'index, follow',
  image: article.image ?? 'https://www.stealthrdp.com/assets/og-cover.png',
  sources: article.sources,
}));

export type SeoConfig = {
  siteUrl: string;
  projectName?: string;
  description?: string;
  environment: { deployEnv: DeployEnv };
  url: {
    trailingSlash: 'strip' | 'append';
    trackingParams: string[];
    legacyRedirects?: readonly LegacyRedirect[];
    legacyInternalLinkPolicy?: 'warn' | 'fail';
  };
  articles: ArticleRegistryConfig;
  brand?: { companyName?: string; logoUrl?: string; socialProfiles?: string[] };
  softwareApp?: { category?: string; operatingSystem?: string; priceRange?: string };
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

export const defaultSeoConfig: SeoConfig = {
  siteUrl: '',
  projectName: 'StealthRDP',
  description: 'Windows and Linux VPS infrastructure with USA and EU regions, direct checkout, documentation, and public service status.',
  environment: { deployEnv: 'development' },
  url: {
    trailingSlash: 'strip',
    trackingParams: ['utm_*', 'fbclid', 'gclid'],
    legacyInternalLinkPolicy: 'warn',
    legacyRedirects: [
      { from: '/plans.html', to: '/plans' },
      { from: '/about.html', to: '/about' },
      { from: '/faq.html', to: '/faq' },
      { from: '/privacy.html', to: '/privacy' },
      { from: '/status.html', to: '/status' },
      { from: '/docs.html', to: '/docs' },
      { from: '/blog.html', to: '/blog' },
      { from: '/minecraft-vps', to: '/vps-hosting-minecraft' },
      { from: '/docs/frequently-asked-questions-fa-qs', to: '/faq' },
    ],
  },
  articles: {
    basePath: '/blog',
    feedPath: '/rss.xml',
    feedTitle: 'StealthRDP Guides',
    feedDescription: 'VPS use cases, server management, remote desktop, security, backup, and infrastructure guides from StealthRDP.',
    feedLanguage: 'en',
    defaultIndexPolicy: 'index, follow',
    publications,
  },
  brand: {
    companyName: 'StealthRDP',
    logoUrl: 'https://cdn.stealthrdp.com/images/new/6.png',
    socialProfiles: [
      'https://x.com/stealthrdp',
      'https://www.instagram.com/stealth_rdp',
      'https://discord.gg/9JJFs4DDyF',
      'https://t.me/StealthRDP',
    ],
  },
  routes: {
    publicMarketing: ['/', '/plans', '/windows-vps', '/linux-vps', '/citadel', '/citadel/docs', '/status', '/resources', '/blog', '/faq', '/about', '/docs', '/privacy'],
    publicUtility: [...noindexDocPaths],
    privatePages: [],
    privateApis: [],
    dynamicPublic: ['/vps-hosting-minecraft', '/rdp-vps'],
  },
};

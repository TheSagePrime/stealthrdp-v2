import type { ArticleRegistryConfig } from '../libs/seo/articles';
import type { DeployEnv } from '../libs/seo/env';
import type { LegacyRedirect } from '../libs/seo/internal-links';
import type { ResolvedSiteUrl } from '../libs/seo/site-url';
import blogData from '../content/blog-articles.json';
import { noindexDocPaths } from '../lib/stealth/routes';
import { parseSiteUrl, resolveSiteUrl } from '../libs/seo/site-url';

type BlogSeed = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image?: string;
};

const publications: ArticleRegistryConfig['publications'] = (blogData as BlogSeed[]).map(article => ({
  slug: article.slug,
  status: 'published',
  path: article.slug === 'vps-hosting-minecraft' ? '/vps-hosting-minecraft' : `/blog/${article.slug}.html`,
  title: article.title,
  h1: article.title,
  description: article.excerpt,
  datePublished: article.date,
  author: { name: article.author || 'StealthRDP Team', type: 'Organization' },
  locale: 'en',
  country: 'US',
  indexPolicy: 'index, follow',
  image: article.image,
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
  if (config.siteUrl.trim()) return parseSiteUrl(config.siteUrl, { production: config.environment.deployEnv === 'production' });
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
    ],
  },
  articles: {
    basePath: '/blog',
    feedPath: '/rss.xml',
    feedTitle: 'StealthRDP Blog',
    feedDescription: 'VPS, RDP, server management, monitoring, backup, and infrastructure guides from StealthRDP.',
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
    publicMarketing: ['/', '/plans', '/windows-vps', '/linux-vps', '/citadel', '/status', '/blog', '/faq', '/about', '/docs'],
    publicUtility: ['/privacy', ...noindexDocPaths],
    privatePages: [],
    privateApis: [],
    dynamicPublic: ['/vps-hosting-minecraft'],
  },
};
import type { Metadata, MetadataRoute } from 'next';
import type { SeoConfig } from '../../config/seo';
import type { ResolvedSiteUrl } from './site-url';
import { resolveSeoSite } from '../../config/seo';
import { createPageMetadata } from './metadata';
import { canonicalUrlForPath, normalizePathname } from './normalize';

export const ARTICLE_STATUSES = ['draft', 'published'] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];
export const ARTICLE_INDEX_POLICIES = ['index, follow', 'noindex, follow'] as const;
export type ArticleIndexPolicy = (typeof ARTICLE_INDEX_POLICIES)[number];

export type ArticleAuthor = {
  name: string;
  type?: 'Person' | 'Organization';
  url?: string;
};

export type ArticleSource = {
  title: string;
  url: string;
  publisher?: string;
  accessedAt?: string;
};

export type ArticlePublication = {
  slug: string;
  status: ArticleStatus;
  path?: string;
  title: string;
  h1: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: ArticleAuthor;
  locale?: string;
  country?: string;
  indexPolicy?: ArticleIndexPolicy;
  image?: string;
  sources?: readonly ArticleSource[];
  alternates?: Readonly<Record<string, string>>;
};

export type ArticleRegistryConfig = {
  basePath: string;
  feedPath: string;
  feedTitle?: string;
  feedDescription?: string;
  feedLanguage?: string;
  defaultIndexPolicy: ArticleIndexPolicy;
  publications: readonly ArticlePublication[];
};

export type ArticleValidationIssue = {
  code: string;
  message: string;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCALE_PATTERN = /^[A-Z]{2,3}(?:-[A-Z0-9]{2,8})*$/i;
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function articleConfig(config: Pick<SeoConfig, 'articles'>): ArticleRegistryConfig {
  return config.articles;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isIsoDate(value: string): boolean {
  const trimmed = value.trim();
  const dateOnly = DATE_ONLY_PATTERN.exec(trimmed);
  if (dateOnly) {
    const date = new Date(Date.UTC(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])));
    return (
      date.getUTCFullYear() === Number(dateOnly[1])
      && date.getUTCMonth() === Number(dateOnly[2]) - 1
      && date.getUTCDate() === Number(dateOnly[3])
    );
  }

  return (
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(trimmed)
    && Number.isFinite(Date.parse(trimmed))
  );
}

export function parseArticleDate(value: string): Date {
  if (!isIsoDate(value)) {
    throw new Error(`Article date must be an ISO date or timezone-qualified ISO datetime: ${value}`);
  }
  return new Date(`${value.length === 10 ? `${value}T00:00:00Z` : value}`);
}

function articleTimestamp(article: ArticlePublication): number {
  try {
    return parseArticleDate(article.datePublished).getTime();
  } catch {
    return Number.NEGATIVE_INFINITY;
  }
}

/** Returns a new array sorted newest first without mutating the registry. */
export function sortArticlesNewestFirst(articles: readonly ArticlePublication[]): ArticlePublication[] {
  return [...articles].sort(
    (left, right) => articleTimestamp(right) - articleTimestamp(left) || left.slug.localeCompare(right.slug),
  );
}

export function articlePathFor(article: ArticlePublication, config: Pick<SeoConfig, 'articles' | 'url'>): string {
  const basePath = config.articles.basePath.replace(/\/$/, '');
  return (article.path ?? `${basePath}/${article.slug}`).replace(/\/{2,}/g, '/');
}

export function isIndexableArticle(article: ArticlePublication, config: Pick<SeoConfig, 'articles'>): boolean {
  return (
    article.status === 'published'
    && (article.indexPolicy ?? articleConfig(config).defaultIndexPolicy) === 'index, follow'
  );
}

function robotsMetadata(policy: ArticleIndexPolicy): Metadata['robots'] {
  return {
    index: policy === 'index, follow',
    follow: true,
  };
}

export function createArticleMetadata(article: ArticlePublication, config: SeoConfig): Metadata {
  const path = articlePathFor(article, config);
  const base = createPageMetadata({
    path,
    title: article.title,
    description: article.description,
    locale: article.locale,
    ogImage: article.image,
    config,
  });
  const policy = article.indexPolicy ?? config.articles.defaultIndexPolicy;
  const site = resolveSeoSite(config);
  const languageAlternates = Object.fromEntries(
    Object.entries(article.alternates ?? {}).map(([locale, alternatePath]) => [
      locale,
      canonicalUrlForPath(alternatePath, site, config),
    ]),
  );

  return {
    ...base,
    robots: robotsMetadata(policy),
    alternates: {
      ...base.alternates,
      ...(Object.keys(languageAlternates).length > 0 ? { languages: languageAlternates } : {}),
    },
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: article.datePublished,
      ...(article.dateModified ? { modifiedTime: article.dateModified } : {}),
    },
  };
}

export function getArticlePublications(config: Pick<SeoConfig, 'articles' | 'url'>): ArticlePublication[] {
  return sortArticlesNewestFirst(config.articles.publications);
}

export function findArticleForPath(
  pathname: string,
  config: Pick<SeoConfig, 'articles' | 'url'>,
): ArticlePublication | undefined {
  const normalized = normalizePathname(pathname, config.url.trailingSlash);
  return config.articles.publications.find(
    article => normalizePathname(articlePathFor(article, config), config.url.trailingSlash) === normalized,
  );
}

export function validateArticlePublication(
  article: ArticlePublication,
  config: Pick<SeoConfig, 'articles' | 'url'>,
): ArticleValidationIssue[] {
  const issues: ArticleValidationIssue[] = [];
  const add = (code: string, message: string) => issues.push({ code, message });

  if (!SLUG_PATTERN.test(article.slug)) {
    add('slug', `Article slug is not lowercase kebab-case: ${article.slug}`);
  }
  if (!ARTICLE_STATUSES.includes(article.status)) {
    add('status', `Article status must be draft or published: ${article.status}`);
  }
  if (!article.title.trim()) {
    add('title', 'Article title is required');
  }
  if (!article.h1.trim()) {
    add('h1', 'Article H1 is required');
  }
  if (!article.description.trim()) {
    add('description', 'Article description is required');
  }
  if (!article.author.name.trim()) {
    add('author', 'Article author name is required');
  }
  if (!isIsoDate(article.datePublished)) {
    add('datePublished', `Invalid datePublished: ${article.datePublished}`);
  }
  if (article.dateModified && !isIsoDate(article.dateModified)) {
    add('dateModified', `Invalid dateModified: ${article.dateModified}`);
  }
  if (article.locale && !LOCALE_PATTERN.test(article.locale)) {
    add('locale', `Invalid article locale: ${article.locale}`);
  }
  if (article.country && !/^[A-Z]{2}$/.test(article.country)) {
    add('country', `Invalid article country: ${article.country}`);
  }
  if (article.path && (!article.path.startsWith('/') || /\s/.test(article.path))) {
    add('path', `Article path must be an internal path without spaces: ${article.path}`);
  }

  const path = articlePathFor(article, config);
  if (!path.startsWith('/')) {
    add('path', `Article path must start with /: ${path}`);
  }

  for (const [locale, alternatePath] of Object.entries(article.alternates ?? {})) {
    if (!LOCALE_PATTERN.test(locale)) {
      add('alternate-locale', `Invalid alternate locale: ${locale}`);
    }
    if (!alternatePath.startsWith('/')) {
      add('alternate-path', `Alternate article path must be internal: ${alternatePath}`);
    }
  }

  for (const [index, source] of (article.sources ?? []).entries()) {
    if (!source.title.trim()) {
      add('source-title', `Source ${index + 1} has no title`);
    }
    if (!/^https?:\/\//i.test(source.url)) {
      add('source-url', `Source ${index + 1} must use http or https`);
    }
  }

  return issues;
}

function authorJsonLd(author: ArticleAuthor): Record<string, unknown> {
  return {
    '@type': author.type ?? 'Person',
    'name': author.name,
    ...(author.url ? { url: author.url } : {}),
  };
}

function absoluteAlternateUrl(value: string, site: ResolvedSiteUrl, config: Pick<SeoConfig, 'url'>): string {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return canonicalUrlForPath(value, site, config);
}

export function buildArticleJsonLd(
  article: ArticlePublication,
  config: SeoConfig,
  site?: ResolvedSiteUrl,
): Record<string, unknown> {
  const resolvedSite = site ?? resolveSeoSite(config);
  const path = articlePathFor(article, config);
  const canonical = canonicalUrlForPath(path, resolvedSite, config);
  const blogPath = config.articles.basePath;
  const dateModified = article.dateModified ?? article.datePublished;
  const blogPosting: Record<string, unknown> = {
    '@type': 'BlogPosting',
    '@id': `${canonical}#article`,
    'headline': article.title,
    'description': article.description,
    'url': canonical,
    'mainEntityOfPage': { '@id': canonical },
    'datePublished': article.datePublished,
    dateModified,
    'author': authorJsonLd(article.author),
    ...(article.locale ? { inLanguage: article.locale } : {}),
    ...(article.image ? { image: absoluteAlternateUrl(article.image, resolvedSite, config) } : {}),
    ...(config.brand?.companyName
      ? {
          publisher: {
            '@type': 'Organization',
            '@id': `${resolvedSite.origin}#organization`,
            'name': config.brand.companyName,
            ...(config.brand.logoUrl ? { logo: absoluteAlternateUrl(config.brand.logoUrl, resolvedSite, config) } : {}),
          },
        }
      : {}),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      blogPosting,
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': canonicalUrlForPath('/', resolvedSite, config) },
          { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': canonicalUrlForPath(blogPath, resolvedSite, config) },
          { '@type': 'ListItem', 'position': 3, 'name': article.title, 'item': canonical },
        ],
      },
    ],
  };
}

export function buildArticleIndexJsonLd(config: SeoConfig, site?: ResolvedSiteUrl): Record<string, unknown> {
  const resolvedSite = site ?? resolveSeoSite(config);
  const items = getArticlePublications(config)
    .filter(article => isIndexableArticle(article, config))
    .map((article, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'BlogPosting',
        'headline': article.title,
        'description': article.description,
        'datePublished': article.datePublished,
        'dateModified': article.dateModified ?? article.datePublished,
        'author': authorJsonLd(article.author),
        'url': canonicalUrlForPath(articlePathFor(article, config), resolvedSite, config),
        ...(article.locale ? { inLanguage: article.locale } : {}),
      },
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': config.articles.feedTitle ?? `${config.projectName ?? 'Site'} articles`,
    'itemListElement': items,
  };
}

export function buildArticleSitemapEntries(config: SeoConfig, site?: ResolvedSiteUrl): MetadataRoute.Sitemap {
  const resolvedSite = site ?? resolveSeoSite(config);
  return getArticlePublications(config)
    .filter(article => isIndexableArticle(article, config))
    .map(article => ({
      url: canonicalUrlForPath(articlePathFor(article, config), resolvedSite, config),
      lastModified: article.dateModified ?? article.datePublished,
      ...(article.alternates
        ? {
            alternates: {
              languages: Object.fromEntries(
                Object.entries(article.alternates).map(([locale, path]) => [
                  locale,
                  absoluteAlternateUrl(path, resolvedSite, config),
                ]),
              ),
            },
          }
        : {}),
    }));
}

export function validateArticleIndexHtml(
  html: string,
  config: SeoConfig,
  site?: ResolvedSiteUrl,
): ArticleValidationIssue[] {
  const resolvedSite = site ?? resolveSeoSite(config);
  const expected = getArticlePublications(config)
    .filter(article => isIndexableArticle(article, config))
    .map(article => ({
      article,
      url: canonicalUrlForPath(articlePathFor(article, config), resolvedSite, config),
    }));
  const issues: ArticleValidationIssue[] = [];
  const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  let itemList: Record<string, unknown> | undefined;

  for (const block of blocks) {
    const raw = block[1];
    if (!raw) {
      continue;
    }
    try {
      const value: unknown = JSON.parse(raw);
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const record = value as Record<string, unknown>;
        if (record['@type'] === 'ItemList') {
          itemList = record;
        }
      }
    } catch {
      // The general post-build parser reports malformed JSON-LD.
    }
  }

  if (!itemList) {
    issues.push({ code: 'item-list-schema', message: 'Article index is missing ItemList JSON-LD' });
    return issues;
  }

  const items = Array.isArray(itemList.itemListElement) ? itemList.itemListElement : [];
  if (items.length !== expected.length) {
    issues.push({ code: 'item-list-count', message: 'ItemList count does not match published articles' });
  }
  expected.forEach(({ article, url }, index) => {
    const listItem = items[index];
    const item
      = listItem && typeof listItem === 'object' && !Array.isArray(listItem)
        ? (listItem as Record<string, unknown>).item
        : undefined;
    const itemRecord
      = item && typeof item === 'object' && !Array.isArray(item) ? (item as Record<string, unknown>) : undefined;
    if (itemRecord?.url !== url) {
      issues.push({
        code: 'item-list-order',
        message: `ItemList position ${index + 1} does not match newest-first article order`,
      });
    }
    if (itemRecord?.datePublished !== article.datePublished) {
      issues.push({ code: 'item-list-date', message: `ItemList position ${index + 1} has the wrong publication date` });
    }
  });

  return issues;
}

function xmlUnescape(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', '\'');
}

export function validateArticleSitemapXml(
  xml: string,
  config: SeoConfig,
  site?: ResolvedSiteUrl,
): ArticleValidationIssue[] {
  const resolvedSite = site ?? resolveSeoSite(config);
  const entries = [...xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/gi)].map((match) => {
    const block = match[1] ?? '';
    return {
      loc: xmlUnescape(block.match(/<loc>([^<]+)<\/loc>/i)?.[1] ?? '').trim(),
      lastmod: xmlUnescape(block.match(/<lastmod>([^<]+)<\/lastmod>/i)?.[1] ?? '').trim(),
    };
  });
  const issues: ArticleValidationIssue[] = [];

  for (const article of getArticlePublications(config).filter(item => isIndexableArticle(item, config))) {
    const expectedUrl = canonicalUrlForPath(articlePathFor(article, config), resolvedSite, config);
    const matches = entries.filter(entry => entry.loc === expectedUrl || entry.loc === `${expectedUrl}/`);
    if (matches.length !== 1) {
      issues.push({ code: 'sitemap-article-count', message: `Sitemap must contain ${expectedUrl} exactly once` });
      continue;
    }
    const expectedDate = (article.dateModified ?? article.datePublished).slice(0, 10);
    if (matches[0]?.lastmod.slice(0, 10) !== expectedDate) {
      issues.push({ code: 'sitemap-lastmod', message: `Sitemap lastmod does not match ${article.slug}` });
    }
  }

  return issues;
}

function sourceId(number: number): string {
  return `source-${number}`;
}

/** Returns source anchors in the same order used by ArticleSources. */
export function articleSourceId(number: number): string {
  return sourceId(number);
}

export function validateArticleSourceIntegrity(
  html: string,
  sources: readonly ArticleSource[],
): ArticleValidationIssue[] {
  if (sources.length === 0) {
    return [];
  }

  const issues: ArticleValidationIssue[] = [];
  const add = (code: string, message: string) => issues.push({ code, message });
  if (!/<details(?:\s[^>]*)?>/i.test(html)) {
    add('sources-disclosure', 'Sources require a native details disclosure');
  }
  if (/<details[^>]+\bopen[\s=>]/i.test(html)) {
    add('sources-open', 'Sources disclosure must be collapsed by default');
  }
  if (!/<summary>\s*Sources\s*&(?:amp;)?\s*references\s*<\/summary>/i.test(html)) {
    add('sources-summary', 'Sources disclosure must use the standard summary');
  }
  if (!/<details[\s\S]*?<ol[\s\S]*?<\/ol>[\s\S]*?<\/details>/i.test(html)) {
    add('sources-list', 'Sources disclosure must contain a numbered list');
  }
  if (/>\s*https?:\/\/[^<]+</i.test(html)) {
    add('sources-raw-url', 'Source URLs must not appear as visible link text');
  }

  const citationTargets = [...html.matchAll(/href=["']#source-(\d+)["']/gi)].map(match => Number(match[1]));
  for (const target of citationTargets) {
    if (!Number.isInteger(target) || target < 1 || target > sources.length) {
      add('citation-target', `Citation points to missing source ${target}`);
    }
  }

  for (const [index, source] of sources.entries()) {
    const number = index + 1;
    const id = sourceId(number);
    const itemPattern = new RegExp(`<li[^>]+id=["']${escapeRegExp(id)}["'][^>]*>[\\s\\S]*?<\\/li>`, 'i');
    const item = html.match(itemPattern)?.[0] ?? '';
    if (!item) {
      add('source-anchor', `Missing source anchor ${id}`);
      continue;
    }
    if (!/<a\s[^>]*href=["']https?:\/\/[^"']+["']/i.test(item)) {
      add('source-link', `Source ${number} title is not clickable`);
    }
    if (!new RegExp(`href=["']${escapeRegExp(source.url).replaceAll('&', '(?:&|&amp;)')}["']`, 'i').test(item)) {
      add('source-url', `Source ${number} URL does not match the configured source`);
    }
    if (!citationTargets.includes(number)) {
      add('citation-missing', `Source ${number} has no citation marker`);
    }
  }

  return issues;
}

export function validateArticleHtml(
  article: ArticlePublication,
  html: string,
  config: SeoConfig,
): ArticleValidationIssue[] {
  const issues = [
    ...validateArticlePublication(article, config),
    ...validateArticleSourceIntegrity(html, article.sources ?? []),
  ];
  const escapedDate = escapeRegExp(article.datePublished);
  if (!new RegExp(`<time[^>]+datetime=["']${escapedDate}["']`, 'i').test(html)) {
    issues.push({ code: 'visible-date', message: 'Visible publication time does not match datePublished' });
  }

  const nodes: Record<string, unknown>[] = [];
  for (const match of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const rawBlock = match[1];
    if (!rawBlock) {
      continue;
    }
    try {
      const value: unknown = JSON.parse(rawBlock);
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const record = value as Record<string, unknown>;
        const graph = Array.isArray(record['@graph']) ? record['@graph'] : [record];
        for (const node of graph) {
          if (node && typeof node === 'object' && !Array.isArray(node)) {
            nodes.push(node as Record<string, unknown>);
          }
        }
      }
    } catch {
      // The existing post-build parser reports malformed JSON-LD separately.
    }
  }

  const blogPosting = nodes.find(node => node['@type'] === 'BlogPosting');
  const breadcrumbs = nodes.find(node => node['@type'] === 'BreadcrumbList');
  if (!blogPosting) {
    issues.push({ code: 'blogposting-schema', message: 'Article is missing BlogPosting JSON-LD' });
  }
  if (!breadcrumbs) {
    issues.push({ code: 'breadcrumb-schema', message: 'Article is missing BreadcrumbList JSON-LD' });
  }
  if (blogPosting && blogPosting.datePublished !== article.datePublished) {
    issues.push({ code: 'schema-date', message: 'BlogPosting datePublished does not match the registry' });
  }

  return issues;
}

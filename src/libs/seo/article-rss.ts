import type { SeoConfig } from '../../config/seo';
import type { ArticleValidationIssue } from './articles';
import type { ResolvedSiteUrl } from './site-url';
import { resolveSeoSite } from '../../config/seo';
import {
  articlePathFor,

  getArticlePublications,
  isIndexableArticle,
  parseArticleDate,
} from './articles';
import { canonicalUrlForPath } from './normalize';

function xmlEscape(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&apos;');
}

/** Renders a project-agnostic RSS feed from the same article registry as the sitemap. */
export function renderArticleRss(config: SeoConfig, site?: ResolvedSiteUrl): string {
  const resolvedSite = site ?? resolveSeoSite(config);
  const title = config.articles.feedTitle ?? `${config.projectName ?? 'Site'} articles`;
  const description = config.articles.feedDescription ?? config.description ?? '';
  const feedUrl = canonicalUrlForPath(config.articles.feedPath, resolvedSite, config);
  const items = getArticlePublications(config)
    .filter(article => isIndexableArticle(article, config))
    .map((article) => {
      const url = canonicalUrlForPath(articlePathFor(article, config), resolvedSite, config);
      const published = parseArticleDate(article.datePublished).toUTCString();
      return [
        '    <item>',
        `      <title>${xmlEscape(article.title)}</title>`,
        `      <link>${xmlEscape(url)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(url)}</guid>`,
        `      <pubDate>${xmlEscape(published)}</pubDate>`,
        `      <description>${xmlEscape(article.description)}</description>`,
        '    </item>',
      ].join('\n');
    });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${xmlEscape(title)}</title>`,
    `    <link>${xmlEscape(canonicalUrlForPath('/', resolvedSite, config))}</link>`,
    `    <description>${xmlEscape(description)}</description>`,
    `    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />`,
    `    <language>${xmlEscape(config.articles.feedLanguage ?? 'en')}</language>`,
    ...(items.length > 0 ? items : ['    <!-- No indexable articles are configured. -->']),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

export function validateArticleRssXml(
  xml: string,
  config: SeoConfig,
  site?: ResolvedSiteUrl,
): ArticleValidationIssue[] {
  const resolvedSite = site ?? resolveSeoSite(config);
  const items = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match) => {
    const block = match[1] ?? '';
    const read = (tag: string) => {
      const value = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1] ?? '';
      return value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').trim();
    };
    return { link: read('link'), pubDate: read('pubDate') };
  });
  const expected = getArticlePublications(config)
    .filter(article => isIndexableArticle(article, config))
    .map(article => ({
      article,
      url: canonicalUrlForPath(articlePathFor(article, config), resolvedSite, config),
    }));
  const issues: ArticleValidationIssue[] = [];

  if (items.length !== expected.length) {
    issues.push({ code: 'rss-article-count', message: 'RSS item count does not match published articles' });
  }
  expected.forEach(({ article, url }, index) => {
    const item = items[index];
    if (item?.link !== url) {
      issues.push({
        code: 'rss-order',
        message: `RSS position ${index + 1} does not match newest-first article order`,
      });
    }
    const parsedDate = item?.pubDate ? Date.parse(item.pubDate) : Number.NaN;
    const expectedDate = parseArticleDate(article.datePublished).getTime();
    if (!Number.isFinite(parsedDate) || parsedDate !== expectedDate) {
      issues.push({ code: 'rss-date', message: `RSS publication date does not match ${article.slug}` });
    }
  });

  return issues;
}

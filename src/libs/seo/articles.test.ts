import type { SeoConfig } from '../../config/seo';
import type { ArticlePublication } from './articles';
import type { ResolvedSiteUrl } from './site-url';
import { describe, expect, it } from 'vitest';
import { defaultSeoConfig } from '../../config/seo';
import { renderArticleRss, validateArticleRssXml } from './article-rss';
import {

  buildArticleIndexJsonLd,
  buildArticleJsonLd,
  buildArticleSitemapEntries,
  createArticleMetadata,
  getArticlePublications,
  isIndexableArticle,
  parseArticleDate,
  sortArticlesNewestFirst,
  validateArticleHtml,
  validateArticleIndexHtml,
  validateArticlePublication,
  validateArticleSitemapXml,
  validateArticleSourceIntegrity,
} from './articles';

const site: ResolvedSiteUrl = {
  origin: 'https://example.test',
  protocol: 'https:',
  hostname: 'example.test',
  href: 'https://example.test/',
};

const makeArticle = (overrides: Partial<ArticlePublication> = {}): ArticlePublication => ({
  slug: 'first-article',
  status: 'published',
  title: 'First article',
  h1: 'First article',
  description: 'A useful article description for a project reader.',
  datePublished: '2026-01-01',
  author: { name: 'Editorial team', type: 'Organization' },
  sources: [],
  ...overrides,
});

const config: SeoConfig = {
  ...defaultSeoConfig,
  projectName: 'Example project',
  description: 'A project description for the technical SEO starter.',
  brand: { companyName: 'Example project' },
  articles: {
    ...defaultSeoConfig.articles,
    feedTitle: 'Example articles',
    feedDescription: 'Example project articles.',
    publications: [
      makeArticle({ slug: 'old-article', title: 'Old article', datePublished: '2025-01-01' }),
      makeArticle({ slug: 'new-article', title: 'New article', datePublished: '2026-05-01' }),
    ],
  },
};

describe('article publication layer', () => {
  it('sorts newest first without mutating the registry', () => {
    const articles = [
      makeArticle({ slug: 'old', datePublished: '2025-01-01' }),
      makeArticle({ slug: 'new', datePublished: '2026-01-01' }),
    ];

    expect(sortArticlesNewestFirst(articles).map(article => article.slug)).toEqual(['new', 'old']);
    expect(articles.map(article => article.slug)).toEqual(['old', 'new']);
  });

  it('uses the registry date for BlogPosting, sitemap, RSS, and index output', () => {
    const sorted = getArticlePublications(config);
    const jsonLd = buildArticleIndexJsonLd(config, site);
    const itemList = jsonLd.itemListElement as Array<{ item: { datePublished: string } }>;
    const sitemap = buildArticleSitemapEntries(config, site);
    const rss = renderArticleRss(config, site);

    expect(sorted[0]?.datePublished).toBe('2026-05-01');
    expect(itemList.map(item => item.item.datePublished)).toEqual(['2026-05-01', '2025-01-01']);
    expect(sitemap.map(entry => entry.lastModified)).toEqual(['2026-05-01', '2025-01-01']);
    expect(rss.indexOf('<title>New article</title>')).toBeLessThan(rss.indexOf('<title>Old article</title>'));
    expect(rss).toContain('<pubDate>Fri, 01 May 2026 00:00:00 GMT</pubDate>');
  });

  it('keeps draft records out of index, sitemap, and RSS', () => {
    const draft = makeArticle({ status: 'draft', slug: 'draft-article', title: 'Draft article' });
    const draftConfig = {
      ...config,
      articles: { ...config.articles, publications: [draft] },
    };

    expect(getArticlePublications(draftConfig)).toEqual([draft]);
    expect(buildArticleIndexJsonLd(draftConfig, site).itemListElement).toEqual([]);
    expect(buildArticleSitemapEntries(draftConfig, site)).toEqual([]);
    expect(renderArticleRss(draftConfig, site)).not.toContain('Draft article');
  });

  it('validates ItemList order, sitemap lastmod, and RSS dates', () => {
    const itemListHtml = `<script type="application/ld+json">${JSON.stringify(buildArticleIndexJsonLd(config, site))}</script>`;
    const sitemapXml = [
      '<urlset>',
      '<url><loc>https://example.test/blog/new-article</loc><lastmod>2026-05-01</lastmod></url>',
      '<url><loc>https://example.test/blog/old-article</loc><lastmod>2025-01-01</lastmod></url>',
      '</urlset>',
    ].join('');
    const rss = renderArticleRss(config, site);

    expect(validateArticleIndexHtml(itemListHtml, config, site)).toEqual([]);
    expect(validateArticleSitemapXml(sitemapXml, config, site)).toEqual([]);
    expect(validateArticleRssXml(rss, config, site)).toEqual([]);
    expect(validateArticleSitemapXml(sitemapXml.replace('2026-05-01', '2026-05-02'), config, site)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'sitemap-lastmod' })]),
    );
  });

  it('builds BlogPosting and BreadcrumbList from one article record', () => {
    const jsonLd = buildArticleJsonLd(makeArticle({ datePublished: '2026-02-03' }), config, site);
    const graph = jsonLd['@graph'] as Array<Record<string, unknown>>;
    const blogPosting = graph.find(node => node['@type'] === 'BlogPosting');
    const breadcrumbs = graph.find(node => node['@type'] === 'BreadcrumbList');

    expect(blogPosting?.datePublished).toBe('2026-02-03');
    expect(blogPosting?.dateModified).toBe('2026-02-03');
    expect(breadcrumbs).toBeDefined();
  });

  it('defaults articles to index,follow and permits explicit noindex', () => {
    const indexable = makeArticle();
    const noindex = makeArticle({ indexPolicy: 'noindex, follow' });

    expect(isIndexableArticle(indexable, config)).toBe(true);
    expect(isIndexableArticle(noindex, config)).toBe(false);
    expect(createArticleMetadata(noindex, config).robots).toEqual({ index: false, follow: true });
  });

  it('rejects invalid publication records before rendering', () => {
    const issues = validateArticlePublication(makeArticle({ slug: 'Bad Slug', datePublished: 'not-a-date' }), config);

    expect(issues.map(issue => issue.code)).toEqual(expect.arrayContaining(['slug', 'datePublished']));
  });

  it('validates source disclosure and citation mapping', () => {
    const sources = [
      { title: 'One source', url: 'https://source.example/one' },
      { title: 'Two source', url: 'https://source.example/two' },
    ];
    const html
      = '<a href="#source-1">[1]</a><a href="#source-2">[2]</a><details><summary>Sources &amp; references</summary><ol><li id="source-1"><a href="https://source.example/one">One source</a></li><li id="source-2"><a href="https://source.example/two">Two source</a></li></ol></details>';

    expect(validateArticleSourceIntegrity(html, sources)).toEqual([]);
    expect(validateArticleSourceIntegrity(html.replace('#source-2', '#source-9'), sources)).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'citation-target' })]),
    );
  });

  it('accepts a rendered article when all technical invariants match', () => {
    const article = makeArticle({ datePublished: '2026-03-04' });
    const html = `<time datetime="${article.datePublished}">March 4, 2026</time><script type="application/ld+json">${JSON.stringify(buildArticleJsonLd(article, config, site))}</script>`;

    expect(validateArticleHtml(article, html, config)).toEqual([]);
    expect(parseArticleDate(article.datePublished).toISOString()).toBe('2026-03-04T00:00:00.000Z');
  });
});

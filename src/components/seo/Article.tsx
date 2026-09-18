/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { PropsWithChildren } from 'react';
import type { SeoConfig } from '@/config/seo';
import type { ArticlePublication, ArticleSource } from '@/libs/seo/articles';
import { resolveSeoSite } from '@/config/seo';
import {
  articlePathFor,

  articleSourceId,
  buildArticleIndexJsonLd,
  buildArticleJsonLd,
  getArticlePublications,
  isIndexableArticle,
} from '@/libs/seo/articles';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { canonicalUrlForPath } from '@/libs/seo/normalize';

function formatPublicationDate(value: string, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(value.length === 10 ? `${value}T00:00:00Z` : value));
}

export function ArticlePublicationMeta({
  article,
  label = 'Published',
}: {
  article: ArticlePublication;
  label?: string;
}) {
  return (
    <p className="seo-article-publication-meta">
      <span>{label}</span>
      {' '}
      <time dateTime={article.datePublished}>{formatPublicationDate(article.datePublished, article.locale)}</time>
    </p>
  );
}

export function ArticleCitation({ source }: { source: number }) {
  return (
    <a className="seo-article-citation" href={`#${articleSourceId(source)}`} aria-label={`Source ${source}`}>
      [
      {source}
      ]
    </a>
  );
}

export function ArticleSources({
  sources,
  summary = 'Sources & references',
}: {
  sources: readonly ArticleSource[];
  summary?: string;
}) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <details className="seo-article-sources">
      <summary>{summary}</summary>
      <ol>
        {sources.map((source, index) => (
          <li key={articleSourceId(index + 1)} id={articleSourceId(index + 1)}>
            <a href={source.url} target="_blank" rel="nofollow noopener noreferrer">
              {source.title}
            </a>
            {source.publisher ? ` — ${source.publisher}` : ''}
            {source.accessedAt ? ` (accessed ${source.accessedAt})` : ''}
          </li>
        ))}
      </ol>
    </details>
  );
}

export function ArticleJsonLd({ article, config }: { article: ArticlePublication; config: SeoConfig }) {
  const site = resolveSeoSite(config);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildArticleJsonLd(article, config, site)) }}
    />
  );
}

export function ArticleIndex({
  articles,
  config,
  heading = 'Articles',
}: {
  articles?: readonly ArticlePublication[];
  config: SeoConfig;
  heading?: string;
}) {
  const site = resolveSeoSite(config);
  const publications = getArticlePublications({
    ...config,
    articles: {
      ...config.articles,
      publications: articles ?? config.articles.publications,
    },
  }).filter(article => isIndexableArticle(article, config));
  const jsonLd = buildArticleIndexJsonLd(
    {
      ...config,
      articles: { ...config.articles, publications },
    },
    site,
  );

  return (
    <section className="seo-article-index" aria-labelledby="seo-article-index-title">
      <h1 id="seo-article-index-title">{heading}</h1>
      <ol>
        {publications.map(article => (
          <li key={article.slug}>
            <a href={canonicalUrlForPath(articlePathFor(article, config), site, config)}>
              <h2>{article.title}</h2>
            </a>
            <p>{article.description}</p>
            <time dateTime={article.datePublished}>{formatPublicationDate(article.datePublished, article.locale)}</time>
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
    </section>
  );
}

export function ArticleTable({ children }: PropsWithChildren) {
  return <div className="seo-article-table-wrap">{children}</div>;
}

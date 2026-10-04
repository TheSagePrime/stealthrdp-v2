/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { PropsWithChildren } from 'react';
import type { SeoConfig } from '@/config/seo';
import type { ArticlePublication, ArticleSource } from '@/libs/seo/articles';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  const updated = article.dateModified && article.dateModified > article.datePublished ? article.dateModified : undefined;
  return (
    <p className="seo-article-publication-meta">
      <span>
        {label}
        {' '}
        <time dateTime={article.datePublished}>{formatPublicationDate(article.datePublished, article.locale)}</time>
      </span>
      {updated
        ? (
            <span>
              Updated
              {' '}
              <time dateTime={updated}>{formatPublicationDate(updated, article.locale)}</time>
            </span>
          )
        : null}
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
      <div className="sr-collection-head">
        <div>
          <p className="sr-kicker">Knowledge base</p>
          <h2 id="seo-article-index-title">{heading}</h2>
        </div>
        <span>
          {publications.length}
          {' '}
          articles
        </span>
      </div>

      <ol className="
        srv-article-list grid list-none gap-6 p-0
        md:grid-cols-2
      "
      >
        {publications.map((article, index) => {
          const href = canonicalUrlForPath(articlePathFor(article, config), site, config);

          return (
            <li key={article.slug} className="min-w-0">
              <Card className="srv-article-entry h-full">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <Badge
                      variant="outline"
                      className="text-body-muted tabular-nums"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </Badge>
                    <time
                      dateTime={article.datePublished}
                      className="text-micro text-body-dim"
                    >
                      {formatPublicationDate(article.datePublished, article.locale)}
                    </time>
                  </div>
                  <CardTitle className="text-heading-4 text-body-text">
                    <a
                      href={href}
                      className="
                        transition-colors
                        hover:text-primary
                      "
                    >
                      <h3>{article.title}</h3>
                    </a>
                  </CardTitle>
                  <CardDescription className="text-small text-body-muted">
                    {article.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="mt-auto">
                  <a
                    href={href}
                    className="
                      inline-flex min-h-11 items-center gap-2 text-small
                      font-semibold text-primary transition-colors
                      hover:text-accent-hover
                    "
                  >
                    Read article →
                  </a>
                </CardFooter>
              </Card>
            </li>
          );
        })}
      </ol>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
    </section>
  );
}

export function ArticleTable({ children }: PropsWithChildren) {
  return <div className="seo-article-table-wrap">{children}</div>;
}

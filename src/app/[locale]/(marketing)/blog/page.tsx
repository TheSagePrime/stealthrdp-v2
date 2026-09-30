/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import Link from 'next/link';
import { articlePath, blogArticles } from '@/lib/stealth/articles';
import { buildArticleIndexJsonLd } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/blog',
  title: 'VPS Guides — StealthRDP',
  description: 'Practical VPS use cases, remote desktop, server management, security, backup, and infrastructure guides from StealthRDP.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function BlogPage() {
  const config = getSeoConfig();
  const articleIndexJsonLd = buildArticleIndexJsonLd(config);
  const categories = Array.from(new Set(blogArticles.map(article => article.category)));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleIndexJsonLd) }}
      />
      <DocsPage>
        <DocsTitle>VPS Guides</DocsTitle>
        <DocsDescription>
          VPS use cases, security, performance, backups, infrastructure decisions, and practical operations.
        </DocsDescription>
        <DocsBody>
          <div className="sr-docs-overview">
            {categories.map((category) => {
              const articles = blogArticles.filter(article => article.category === category);
              return (
                <section className="sr-docs-collection" key={category}>
                  <div className="sr-docs-collection-heading">
                    <h2>{category}</h2>
                    <span>
                      {articles.length}
                      {' '}
                      {articles.length === 1 ? 'guide' : 'guides'}
                    </span>
                  </div>
                  <ul>
                    {articles.map(article => (
                      <li key={article.slug}>
                        <Link href={articlePath(article)}>
                          <span>{article.title}</span>
                          <small>{article.excerpt}</small>
                          <span aria-hidden="true">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </DocsBody>
      </DocsPage>
    </>
  );
}

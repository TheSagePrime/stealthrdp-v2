/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import Link from 'next/link';
import { ResourceTopics } from '@/components/site/ResourceTopics';
import { helpDocsArticles } from '@/lib/stealth/articles';
import {
  articlesForCollection,
  helpArticleHref,
  helpCollectionId,
  helpCollections,
} from '@/lib/stealth/help-center';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/docs',
  title: 'Help Center — StealthRDP',
  description: 'StealthRDP setup, troubleshooting, server management, networking, panels, policies, licensing, and support guidance.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function DocsPageRoute() {
  return (
    <DocsPage>
      <DocsTitle>StealthRDP Help Center</DocsTitle>
      <DocsDescription>
        Practical setup and troubleshooting for StealthRDP servers, organized around the task you are trying to complete.
      </DocsDescription>
      <DocsBody>
        <ResourceTopics
          topics={helpCollections
            .map(collection => ({ collection, count: articlesForCollection(collection, helpDocsArticles).length }))
            .filter(item => item.count > 0)
            .map(({ collection, count }) => ({
              id: helpCollectionId(collection.title),
              title: collection.title,
              description: collection.description,
              count,
              unit: count === 1 ? 'guide' : 'guides',
            }))}
        />
        <div className="sr-docs-overview">
          {helpCollections.map((collection) => {
            const articles = articlesForCollection(collection, helpDocsArticles);
            if (articles.length === 0) {
              return null;
            }

            return (
              <section className="sr-docs-collection" id={helpCollectionId(collection.title)} key={collection.title}>
                <div className="sr-docs-collection-heading">
                  <div>
                    <h2>{collection.title}</h2>
                    <p>{collection.description}</p>
                  </div>
                  <span>
                    {articles.length}
                    {' '}
                    {articles.length === 1 ? 'guide' : 'guides'}
                  </span>
                </div>
                <ul>
                  {articles.map(article => (
                    <li key={article.slug}>
                      <Link href={helpArticleHref(article)}>
                        <span>{article.title}</span>
                        <small>{article.summary}</small>
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
  );
}

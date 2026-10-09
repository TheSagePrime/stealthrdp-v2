import type { Metadata } from 'next';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { ResourceTopics } from '@/components/site/ResourceTopics';
import { helpDocsArticles } from '@/lib/stealth/articles';
import {
  articlesForCollection,
  helpArticleHref,
  helpCollectionId,
  helpCollections,
} from '@/lib/stealth/help-center';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/docs',
  title: 'Help Center — StealthRDP',
  description: 'StealthRDP setup, troubleshooting, server management, networking, panels, policies, licensing, and support guidance.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default async function DocsPageRoute() {
  await requirePageLocale('/docs');
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
        {helpCollections.map((collection) => {
          const articles = articlesForCollection(collection, helpDocsArticles);
          if (articles.length === 0) {
            return null;
          }

          return (
            <section id={helpCollectionId(collection.title)} key={collection.title}>
              <h2>{collection.title}</h2>
              <p>{collection.description}</p>
              <Cards>
                {articles.map(article => (
                  <Card key={article.slug} href={helpArticleHref(article)} title={article.title} description={article.summary} />
                ))}
              </Cards>
            </section>
          );
        })}
      </DocsBody>
    </DocsPage>
  );
}

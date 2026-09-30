/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import Link from 'next/link';
import { citadelDocsArticles } from '@/lib/stealth/articles';
import {
  articlesForCollection,
  citadelArticleHref,
  citadelCollections,
  helpCollectionId,
} from '@/lib/stealth/help-center';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/citadel/docs',
  title: 'Citadel Docs — Layer 7 DDoS Protection',
  description: 'Citadel documentation for setup, Cloudflare routing, domains, challenge levels, allowlists, cache, traffic analytics, bandwidth, alerts, billing, and support.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function CitadelDocsPage() {
  return (
    <DocsPage>
      <DocsTitle>Citadel Docs</DocsTitle>
      <DocsDescription>
        Set up, tune, and operate Citadel: Cloudflare routing, protected domains, challenges,
        allowlists, caching, traffic visibility, bandwidth, alerts, and billing.
      </DocsDescription>
      <DocsBody>
        <div className="sr-docs-overview">
          {citadelCollections.map((collection) => {
            const articles = articlesForCollection(collection, citadelDocsArticles);
            if (articles.length === 0) {
              return null;
            }

            return (
              <section
                className="sr-docs-collection"
                id={helpCollectionId(collection.title)}
                key={collection.title}
              >
                <div className="sr-docs-collection-heading">
                  <div>
                    <h2>{collection.title.replace(/^Citadel:\s*/, '')}</h2>
                    <p>{collection.description}</p>
                  </div>
                  <span>
                    {articles.length}
                    {' '}
                    {articles.length === 1 ? 'article' : 'articles'}
                  </span>
                </div>
                <ul>
                  {articles.map(article => (
                    <li key={article.slug}>
                      <Link href={citadelArticleHref(article)}>
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

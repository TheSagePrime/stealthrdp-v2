import type { Metadata } from 'next';
import Link from 'next/link';
import { CitadelSidebar } from '@/components/site/CitadelSidebar';
import { HelpTopbar } from '@/components/site/HelpTopbar';
import { createPageMetadata } from '@/libs/seo/metadata';
import {
  articlesForCollection,
  citadelArticleHref,
  citadelCollections,
  helpCollectionId,
} from '@/lib/stealth/help-center';
import { citadelDocsArticles } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/citadel/docs',
  title: 'Citadel Docs — Layer 7 DDoS Protection',
  description: 'Citadel documentation for setup, Cloudflare routing, domains, challenge levels, allowlists, cache, traffic analytics, bandwidth, alerts, billing, and support.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function CitadelDocsPage() {
  return (
    <div className="srv-page srv-page-docs srv-page-citadel-docs srv-docs-product">
      <HelpTopbar active="citadel" />

      <div className="sr-container srv-docs-mobile-wrap">
        <details className="srv-docs-mobile-nav">
          <summary>Browse Citadel Docs</summary>
          <CitadelSidebar articles={citadelDocsArticles} />
        </details>
      </div>

      <div className="sr-container srv-docs-grid">
        <aside className="srv-docs-sidebar">
          <CitadelSidebar articles={citadelDocsArticles} />
        </aside>

        <main className="srv-docs-index">
          <header className="srv-docs-index-head">
            <div>
              <p className="sr-kicker">Citadel documentation</p>
              <h1>Protect, tune, and operate Citadel.</h1>
              <p>
                Everything for Citadel lives here: first-time setup, Cloudflare routing,
                protected domains, challenges, allowlists, caching, traffic visibility,
                bandwidth, alerts, billing, and support.
              </p>
            </div>

            <div className="srv-docs-start-links">
              <Link href="/citadel/docs/getting-started">Getting started</Link>
              <Link href="/citadel/docs/cloudflare-setup">Cloudflare setup</Link>
              <Link href="/citadel/docs/challenge-levels">Challenge levels</Link>
              <Link href="/citadel/docs/allowlists">Allowlists</Link>
              <Link href="/citadel/docs/logs">Request logs</Link>
            </div>
          </header>

          <div className="srv-docs-collections">
            {citadelCollections.map(collection => {
              const articles = articlesForCollection(collection, citadelDocsArticles);
              if (articles.length === 0) return null;

              return (
                <section
                  className="srv-docs-collection"
                  id={helpCollectionId(collection.title)}
                  key={collection.title}
                >
                  <div className="srv-docs-collection-head">
                    <div>
                      <h2>{collection.title.replace(/^Citadel:\s*/, '')}</h2>
                      <p>{collection.description}</p>
                    </div>
                    <span>{articles.length}</span>
                  </div>

                  <ol>
                    {articles.map((article, index) => (
                      <li key={article.slug}>
                        <Link href={citadelArticleHref(article)}>
                          <span className="srv-docs-entry-number">{String(index + 1).padStart(2, '0')}</span>
                          <span className="srv-docs-entry-copy">
                            <strong>{article.title}</strong>
                            <small>{article.summary}</small>
                          </span>
                          <span className="srv-docs-entry-arrow" aria-hidden="true">→</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
        </main>

        <aside className="srv-docs-index-aside">
          <span className="srv-resource-nav-label">Citadel</span>
          <p>Layer 7 DDoS protection, request controls, and protected-origin operations.</p>
          <Link href="/citadel">Product overview</Link>
          <Link href="/status">Service status</Link>

          <span className="srv-docs-aside-divider" />

          <span className="srv-resource-nav-label">Need help?</span>
          <a href="https://dash.stealthrdp.com/submitticket.php">Open support ticket ↗</a>
          <Link href="/docs">VPS Help Center</Link>
        </aside>
      </div>
    </div>
  );
}

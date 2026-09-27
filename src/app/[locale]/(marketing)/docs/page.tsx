import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpSidebar } from '@/components/site/HelpSidebar';
import { HelpTopbar } from '@/components/site/HelpTopbar';
import { createPageMetadata } from '@/libs/seo/metadata';
import {
  articlesForCollection,
  helpArticleHref,
  helpCollectionId,
  helpCollections,
} from '@/lib/stealth/help-center';
import { docsArticles } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/docs',
  title: 'Help Center — StealthRDP',
  description: 'StealthRDP setup, troubleshooting, server management, networking, panels, policies, licensing, and common support guidance.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function DocsPage() {
  return (
    <div className="srv-page srv-page-docs srv-docs-product">
      <HelpTopbar />

      <div className="sr-container srv-docs-grid">
        <aside className="srv-docs-sidebar">
          <HelpSidebar articles={docsArticles} />
        </aside>

        <main className="srv-docs-index">
          <header className="srv-docs-index-head">
            <div>
              <p className="sr-kicker">Documentation</p>
              <h1>Get from question to fix, faster.</h1>
              <p>
                Practical setup and troubleshooting for StealthRDP servers, organized
                around the task you are trying to complete.
              </p>
            </div>

            <div className="srv-docs-start-links">
              <Link href="/docs/how-do-i-log-into-windows">Connect to Windows RDP</Link>
              <Link href="/docs/how-to-rebuild-a-server">Rebuild a server</Link>
              <Link href="/docs/windows-licensing">Windows licensing</Link>
              <Link href="/faq">Common questions</Link>
            </div>
          </header>

          <div className="srv-docs-collections">
            {helpCollections.map(collection => {
              const articles = articlesForCollection(collection, docsArticles);
              if (articles.length === 0) return null;

              return (
                <section
                  className="srv-docs-collection"
                  id={helpCollectionId(collection.title)}
                  key={collection.title}
                >
                  <div className="srv-docs-collection-head">
                    <div>
                      <h2>{collection.title}</h2>
                      <p>{collection.description}</p>
                    </div>
                    <span>{articles.length}</span>
                  </div>

                  <ol>
                    {articles.map((article, index) => (
                      <li key={article.slug}>
                        <Link href={helpArticleHref(article)}>
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
          <span className="srv-resource-nav-label">Need help now?</span>
          <p>Server-specific and account-specific issues are handled through support.</p>
          <a href="https://dash.stealthrdp.com/submitticket.php">Open support ticket ↗</a>
          <Link href="/status">Check service status</Link>

          <span className="srv-docs-aside-divider" />

          <span className="srv-resource-nav-label">Learn more</span>
          <Link href="/blog">VPS Guides</Link>
          <Link href="/resources">All resources</Link>
        </aside>
      </div>
    </div>
  );
}

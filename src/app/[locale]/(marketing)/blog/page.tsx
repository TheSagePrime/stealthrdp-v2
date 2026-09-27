import type { Metadata } from 'next';
import Link from 'next/link';
import { GuideSidebar } from '@/components/site/GuideSidebar';
import { HelpTopbar } from '@/components/site/HelpTopbar';
import { buildArticleIndexJsonLd } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';
import { articlePath, blogArticles } from '@/lib/stealth/content';

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
    <div className="srv-page srv-page-blog srv-docs-product">
      <HelpTopbar active="guides" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleIndexJsonLd) }}
      />

      <div className="sr-container srv-docs-mobile-wrap">
        <details className="srv-docs-mobile-nav">
          <summary>Browse Guides</summary>
          <GuideSidebar />
        </details>
      </div>

      <div className="sr-container srv-docs-grid">
        <aside className="srv-docs-sidebar">
          <GuideSidebar />
        </aside>

        <main className="srv-docs-index">
          <header className="srv-docs-index-head">
            <div>
              <p className="sr-kicker">Guides</p>
              <h1>Understand the workload. Run it better.</h1>
              <p>
                VPS use cases, security, performance, backups, infrastructure decisions,
                and practical operations — organized like documentation, not a blog feed.
              </p>
            </div>

            <div className="srv-docs-start-links">
              <Link href="/blog/vps-for-remote-desktop.html">Remote desktop</Link>
              <Link href="/blog/vps-for-web-hosting.html">Web hosting</Link>
              <Link href="/blog/vps-for-automation-bots.html">Automation &amp; bots</Link>
              <Link href="/blog/vps-for-backups-storage.html">Backups &amp; storage</Link>
            </div>
          </header>

          <div className="srv-docs-collections">
            {categories.map(category => {
              const articles = blogArticles.filter(article => article.category === category);

              return (
                <section className="srv-docs-collection" key={category}>
                  <div className="srv-docs-collection-head">
                    <div>
                      <h2>{category}</h2>
                      <p>
                        {category === 'VPS Use Cases'
                          ? 'Choose and size a VPS for a specific workload.'
                          : 'Practical guidance from the StealthRDP knowledge base.'}
                      </p>
                    </div>
                    <span>{articles.length}</span>
                  </div>

                  <ol>
                    {articles.map((article, index) => (
                      <li key={article.slug}>
                        <Link href={articlePath(article)}>
                          <span className="srv-docs-entry-number">{String(index + 1).padStart(2, '0')}</span>
                          <span className="srv-docs-entry-copy">
                            <strong>{article.title}</strong>
                            <small>{article.excerpt}</small>
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
          <span className="srv-resource-nav-label">Use cases</span>
          <Link href="/blog/vps-for-remote-desktop.html">Remote desktop</Link>
          <Link href="/blog/vps-for-web-hosting.html">Web hosting</Link>
          <Link href="/blog/vps-for-automation-bots.html">Automation &amp; bots</Link>
          <Link href="/blog/vps-for-trading.html">Trading infrastructure</Link>
          <Link href="/blog/vps-for-backups-storage.html">Backups &amp; storage</Link>
          <span className="srv-docs-aside-divider" />
          <Link href="/docs">Need setup help?</Link>
        </aside>
      </div>
    </div>
  );
}

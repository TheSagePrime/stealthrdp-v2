import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleIndex } from '@/components/seo/Article';
import { ResourceNav } from '@/components/site/ResourceNav';
import { getSeoConfig } from '@/libs/seo/config';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/blog',
  title: 'VPS Guides — StealthRDP',
  description: 'Practical VPS use cases, remote desktop, server management, security, backup, and infrastructure guides from StealthRDP.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function BlogPage() {
  const config = getSeoConfig();

  return (
    <div className="srv-page srv-page-blog srv-knowledge-page">
      <section className="srv-resource-hero srv-resource-hero-compact">
        <div className="sr-container">
          <p className="sr-kicker">Guides</p>
          <h1>Understand the workload. <span>Run it better.</span></h1>
          <p>
            Decision guides, VPS use cases, security, performance, backup, and server
            operations without mixing support documentation into editorial content.
          </p>
        </div>
      </section>

      <section className="sr-section srv-resource-body">
        <div className="sr-container srv-knowledge-index-grid">
          <aside>
            <ResourceNav active="guides" />
          </aside>

          <main className="srv-knowledge-main">
            <ArticleIndex config={config} heading="All guides" />
          </main>

          <aside className="srv-resource-aside">
            <span className="srv-resource-nav-label">VPS use cases</span>
            <Link href="/blog/vps-for-remote-desktop.html">Remote desktop</Link>
            <Link href="/blog/vps-for-web-hosting.html">Web hosting</Link>
            <Link href="/blog/vps-for-automation-bots.html">Automation &amp; bots</Link>
            <Link href="/blog/vps-for-trading.html">Trading infrastructure</Link>
            <Link href="/blog/vps-for-backups-storage.html">Backups &amp; storage</Link>
            <span className="srv-resource-aside-divider" />
            <span className="srv-resource-nav-label">More guides</span>
            <Link href="/vps-hosting-minecraft">Minecraft VPS hosting</Link>
          </aside>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpTopbar } from '@/components/site/HelpTopbar';
import { ResourceSidebar } from '@/components/site/ResourceSidebar';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/resources',
  title: 'Resources — StealthRDP',
  description: 'Search StealthRDP guides, help articles, common questions, and service information from one resource center.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const destinations = [
  {
    title: 'Guides',
    href: '/blog',
    description: 'VPS use cases, security, performance, infrastructure decisions, backups, and practical server operations.',
  },
  {
    title: 'Help Center',
    href: '/docs',
    description: 'Setup instructions, troubleshooting, networking, Windows access, panels, licensing, and policies.',
  },
  {
    title: 'Common Questions',
    href: '/faq',
    description: 'Quick answers about plans, billing, setup, operating systems, refunds, and support.',
  },
  {
    title: 'Service Status',
    href: '/status',
    description: 'Public infrastructure health and current service availability.',
  },
] as const;

export default function ResourcesPage() {
  return (
    <div className="srv-page srv-page-resources srv-docs-product">
      <HelpTopbar active="resources" />

      <div className="sr-container srv-docs-mobile-wrap">
        <details className="srv-docs-mobile-nav">
          <summary>Browse Resources</summary>
          <ResourceSidebar />
        </details>
      </div>

      <div className="sr-container srv-docs-grid">
        <aside className="srv-docs-sidebar">
          <ResourceSidebar />
        </aside>

        <main className="srv-docs-index">
          <header className="srv-docs-index-head srv-resources-index-head">
            <div>
              <p className="sr-kicker">Resources</p>
              <h1>Learn, solve, and keep moving.</h1>
              <p>
                One searchable knowledge system for VPS guides, setup help,
                troubleshooting, common questions, and service information.
              </p>
            </div>

            <div className="srv-docs-start-links">
              <Link href="/blog/vps-for-remote-desktop.html">Remote desktop guide</Link>
              <Link href="/docs/how-do-i-log-into-windows">Connect to Windows</Link>
              <Link href="/docs/windows-licensing">Windows licensing</Link>
              <Link href="/faq">Common questions</Link>
            </div>
          </header>

          <section className="srv-docs-collection">
            <div className="srv-docs-collection-head">
              <div>
                <h2>Browse resources</h2>
                <p>Choose the kind of answer you need. Search in the top bar works across all of them.</p>
              </div>
              <span>{destinations.length}</span>
            </div>

            <ol>
              {destinations.map((item, index) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="srv-docs-entry-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="srv-docs-entry-copy">
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </span>
                    <span className="srv-docs-entry-arrow" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </main>

        <aside className="srv-docs-index-aside">
          <span className="srv-resource-nav-label">Popular</span>
          <Link href="/blog/vps-for-remote-desktop.html">VPS for remote desktop</Link>
          <Link href="/blog/vps-for-web-hosting.html">VPS for web hosting</Link>
          <Link href="/docs/how-to-rebuild-a-server">Rebuild a server</Link>
          <Link href="/docs/windows-licensing">Windows licensing</Link>
          <span className="srv-docs-aside-divider" />
          <a href="https://dash.stealthrdp.com/submitticket.php">Contact support ↗</a>
        </aside>
      </div>
    </div>
  );
}

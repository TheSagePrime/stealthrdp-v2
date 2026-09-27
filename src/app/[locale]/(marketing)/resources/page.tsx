import type { Metadata } from 'next';
import Link from 'next/link';
import { ResourceNav } from '@/components/site/ResourceNav';
import { ResourceSearch, type ResourceSearchItem } from '@/components/site/ResourceSearch';
import { createPageMetadata } from '@/libs/seo/metadata';
import {
  articlePath,
  blogArticles,
  docPublicSlug,
  docsArticles,
  faqs,
} from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/resources',
  title: 'Resources — StealthRDP',
  description: 'Search StealthRDP guides, help articles, common questions, and service information from one resource center.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function ResourcesPage() {
  const items: ResourceSearchItem[] = [
    ...blogArticles.map(article => ({
      title: article.title,
      href: articlePath(article),
      description: article.excerpt,
      kind: 'Guide' as const,
    })),
    ...docsArticles.map(article => ({
      title: article.title,
      href: `/docs/${docPublicSlug(article)}`,
      description: article.summary,
      kind: 'Help' as const,
    })),
    ...faqs.map(item => ({
      title: item.question,
      href: `/faq#${item.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      description: item.answer,
      kind: 'Question' as const,
    })),
  ];

  return (
    <div className="srv-page srv-page-resources srv-knowledge-page">
      <section className="srv-resource-hero">
        <div className="sr-container">
          <p className="sr-kicker">StealthRDP resources</p>
          <h1>Find the answer. <span>Keep moving.</span></h1>
          <p>
            Search setup help, troubleshooting, VPS use cases, infrastructure guides,
            and common questions from one place.
          </p>
          <ResourceSearch items={items} />
        </div>
      </section>

      <section className="sr-section srv-resource-body">
        <div className="sr-container srv-knowledge-index-grid">
          <aside>
            <ResourceNav active="resources" />
          </aside>

          <main className="srv-resource-directory">
            <div className="srv-resource-directory-head">
              <p className="sr-kicker">Browse</p>
              <h2>One knowledge system, three clear jobs.</h2>
              <p>Learn with Guides, solve a server task in the Help Center, or get a quick answer without digging through documentation.</p>
            </div>

            <div className="srv-resource-destinations">
              <Link href="/blog">
                <span>01</span>
                <div>
                  <strong>Guides</strong>
                  <p>VPS use cases, infrastructure decisions, security, performance, and operational articles.</p>
                </div>
                <em>Explore guides →</em>
              </Link>

              <Link href="/docs">
                <span>02</span>
                <div>
                  <strong>Help Center</strong>
                  <p>Setup instructions, server management, troubleshooting, networking, panels, and policies.</p>
                </div>
                <em>Open Help Center →</em>
              </Link>

              <Link href="/faq">
                <span>03</span>
                <div>
                  <strong>Common Questions</strong>
                  <p>Short answers about plans, billing, operating systems, setup, refunds, and support.</p>
                </div>
                <em>Browse answers →</em>
              </Link>

              <Link href="/status">
                <span>04</span>
                <div>
                  <strong>Service Status</strong>
                  <p>Current public infrastructure health and service availability.</p>
                </div>
                <em>View status →</em>
              </Link>
            </div>
          </main>

          <aside className="srv-resource-aside">
            <span className="srv-resource-nav-label">Start here</span>
            <Link href="/blog/vps-for-remote-desktop.html">Using a VPS for remote desktop</Link>
            <Link href="/blog/vps-for-web-hosting.html">Using a VPS for web hosting</Link>
            <Link href="/docs/windows-licensing">Windows licensing</Link>
            <Link href="/faq">Before you deploy</Link>
          </aside>
        </div>
      </section>
    </div>
  );
}

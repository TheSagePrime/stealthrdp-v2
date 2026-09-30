/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { ArrowRight, BookOpen, LifeBuoy, MessageCircleQuestion, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { ResourcesBar } from '@/components/site/ResourcesBar';
import { blogArticles, citadelDocsArticles, faqs, helpDocsArticles } from '@/lib/stealth/content';
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
    count: `${blogArticles.length} guides`,
    description: 'VPS use cases, security, performance, backups, and infrastructure decisions.',
    icon: BookOpen,
  },
  {
    title: 'Help Center',
    href: '/docs',
    count: `${helpDocsArticles.length} articles`,
    description: 'Setup, troubleshooting, networking, Windows access, panels, licensing, and policies.',
    icon: LifeBuoy,
  },
  {
    title: 'Citadel Docs',
    href: '/citadel/docs',
    count: `${citadelDocsArticles.length} articles`,
    description: 'Cloudflare routing, protected domains, challenges, allowlists, and traffic visibility.',
    icon: ShieldCheck,
  },
  {
    title: 'Common Questions',
    href: '/faq',
    count: `${faqs.length} answers`,
    description: 'Quick answers about plans, billing, setup, operating systems, refunds, and support.',
    icon: MessageCircleQuestion,
  },
] as const;

const popular = [
  { title: 'VPS for remote desktop', href: '/blog/vps-for-remote-desktop.html', kind: 'Guide' },
  { title: 'Connect to Windows', href: '/docs/how-do-i-log-into-windows', kind: 'Help' },
  { title: 'Windows licensing', href: '/docs/windows-licensing', kind: 'Help' },
  { title: 'Rebuild a server', href: '/docs/how-to-rebuild-a-server', kind: 'Help' },
  { title: 'VPS for web hosting', href: '/blog/vps-for-web-hosting.html', kind: 'Guide' },
  { title: 'Set up Citadel protection', href: '/citadel/docs/getting-started', kind: 'Citadel' },
] as const;

export default function ResourcesPage() {
  return (
    <>
      <ResourcesBar active="resources" />
      <div className="srv-page srv-page-resources">
        <section className="sr-page-hero">
          <div className="sr-container">
            <p className="sr-kicker">Resources</p>
            <h1 className="sr-title">Guides, help, and answers.</h1>
            <p className="sr-lede">
              One searchable place for VPS guides, setup help, troubleshooting, Citadel documentation,
              and common questions.
            </p>
          </div>
        </section>

        <section className="sr-section" aria-labelledby="resources-browse">
          <div className="sr-container">
            <h2 className="sr-section-title" id="resources-browse">Browse by topic</h2>
            <div className="sr-res-cards">
              {destinations.map(({ title, href, count, description, icon: Icon }) => (
                <Link className="sr-res-card" href={href} key={href}>
                  <span className="sr-res-card-icon" aria-hidden="true"><Icon /></span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <span className="sr-res-card-foot">
                    <span>{count}</span>
                    <ArrowRight aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="sr-section sr-section-border" aria-labelledby="resources-popular">
          <div className="sr-container sr-res-split">
            <div>
              <h2 className="sr-section-title" id="resources-popular">Popular right now</h2>
            </div>
            <ul className="sr-res-links">
              {popular.map(item => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span>{item.title}</span>
                    <small>{item.kind}</small>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sr-section sr-section-border" aria-labelledby="resources-support">
          <div className="sr-container sr-res-split">
            <div>
              <h2 className="sr-section-title" id="resources-support">Can&rsquo;t find it?</h2>
            </div>
            <div className="sr-res-support-body">
              <p>
                Account, billing, and server-specific requests are handled by support.
                Check live infrastructure health on the status page.
              </p>
              <div className="sr-res-support-actions">
                <a href="https://dash.stealthrdp.com/submitticket.php">Open a support ticket</a>
                <a href="https://wa.me/447441426993">WhatsApp support</a>
                <Link href="/status">Service status</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

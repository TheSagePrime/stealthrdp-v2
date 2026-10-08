/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import iconStyles from '@/components/site/IconArtwork.module.css';
import { blogArticles, citadelDocsArticles, helpDocsArticles } from '@/lib/stealth/articles';
import { faqs } from '@/lib/stealth/content';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
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
    icon: 'book-open',
  },
  {
    title: 'Help Center',
    href: '/docs',
    count: `${helpDocsArticles.length} articles`,
    description: 'Setup, troubleshooting, networking, Windows access, panels, licensing, and policies.',
    icon: 'chat',
  },
  {
    title: 'Citadel Docs',
    href: '/citadel/docs',
    count: `${citadelDocsArticles.length} articles`,
    description: 'Cloudflare routing, protected domains, challenges, allowlists, and traffic visibility.',
    icon: 'shield-checkmark',
  },
  {
    title: 'Common Questions',
    href: '/faq',
    count: `${faqs.length} answers`,
    description: 'Quick answers about plans, billing, setup, operating systems, refunds, and support.',
    icon: 'chat-bubbles-question',
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

export default async function ResourcesPage() {
  await requirePageLocale('/resources');
  return (
    <DocsPage>
      <DocsTitle>Guides, help, and answers</DocsTitle>
      <DocsDescription>
        One searchable place for VPS guides, setup help, troubleshooting, Citadel documentation,
        and common questions.
      </DocsDescription>

      <div className="sr-res-cards not-prose">
        {destinations.map(({ title, href, count, description, icon }) => (
          <Link className="sr-res-card" href={href} key={href}>
            <span className="sr-res-card-icon not-prose" aria-hidden="true"><Image className={iconStyles.artwork} src={`/images/fluent-color/${icon}.svg`} width={36} height={36} alt="" /></span>
            <h2>{title}</h2>
            <p>{description}</p>
            <span className="sr-res-card-foot">
              <span>{count}</span>
              <ArrowRight aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>

      <section className="sr-res-block not-prose" aria-labelledby="resources-popular">
        <h2 id="resources-popular">Popular right now</h2>
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
      </section>

      <aside className="sr-res-support not-prose">
        <div>
          <h2>Can&rsquo;t find it?</h2>
          <p>
            Account, billing, and server-specific requests are handled by support.
            Check live infrastructure health on the status page.
          </p>
        </div>
        <div className="sr-res-support-actions">
          <a href="https://dash.stealthrdp.com/submitticket.php">Open a support ticket</a>
          <a href="https://wa.me/447441426993">WhatsApp support</a>
          <Link href="/status">Service status</Link>
        </div>
      </aside>
    </DocsPage>
  );
}

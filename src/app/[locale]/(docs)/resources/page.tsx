import type { Metadata } from 'next';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { FluentIcon } from '@/components/site/docs/DocsIcon';
import { DocsSupport } from '@/components/site/docs/DocsParts';
import { TranslatedResourcesIndex } from '@/components/site/docs/TranslatedPages';
import { blogArticles, citadelDocsArticles, helpDocsArticles } from '@/lib/stealth/articles';
import { faqs } from '@/lib/stealth/content';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { translatedIndexMetadata } from '@/lib/stealth/translations';

/* German and Spanish exist once any translated resource is published (src/config/i18n.ts). */
export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/resources', {
    en: {
      title: 'Resources — StealthRDP',
      description: 'Search StealthRDP guides, help articles, common questions, and service information from one resource center.',
      ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
    },
    ...translatedIndexMetadata('resources'),
  });
}

const destinations = [
  {
    title: 'Blog',
    href: '/blog',
    count: `${blogArticles.length} articles`,
    description: 'VPS use cases, security, performance, backups, and infrastructure decisions.',
    icon: <FluentIcon name="book-open" size={20} />,
  },
  {
    title: 'Help Center',
    href: '/docs',
    count: `${helpDocsArticles.length} articles`,
    description: 'Setup, troubleshooting, networking, Windows access, panels, licensing, and policies.',
    icon: <FluentIcon name="chat" size={20} />,
  },
  {
    title: 'Citadel Docs',
    href: '/citadel/docs',
    count: `${citadelDocsArticles.length} articles`,
    description: 'Cloudflare routing, protected domains, challenges, allowlists, and traffic visibility.',
    icon: <FluentIcon name="shield-checkmark" size={20} />,
  },
  {
    title: 'Common Questions',
    href: '/faq',
    count: `${faqs.length} answers`,
    description: 'Quick answers about plans, billing, setup, operating systems, refunds, and support.',
    icon: <FluentIcon name="chat-bubbles-question" size={20} />,
  },
];

const popular = [
  { title: 'VPS for remote desktop', href: '/blog/vps-for-remote-desktop.html', kind: 'Guide' },
  { title: 'Connect to Windows', href: '/docs/how-do-i-log-into-windows', kind: 'Help' },
  { title: 'Windows licensing', href: '/docs/windows-licensing', kind: 'Help' },
  { title: 'Rebuild a server', href: '/docs/how-to-rebuild-a-server', kind: 'Help' },
  { title: 'VPS for web hosting', href: '/blog/vps-for-web-hosting.html', kind: 'Guide' },
  { title: 'Set up Citadel protection', href: '/citadel/docs/getting-started', kind: 'Citadel' },
];

export default async function ResourcesPage() {
  const locale = await requirePageLocale('/resources');
  if (locale !== 'en') {
    return <TranslatedResourcesIndex locale={locale} />;
  }
  return (
    <DocsPage toc={[{ title: 'Popular right now', url: '#resources-popular', depth: 2 }]}>
      <DocsTitle>Guides, help, and answers</DocsTitle>
      <DocsDescription>
        One searchable place for VPS guides, setup help, troubleshooting, Citadel documentation,
        and common questions.
      </DocsDescription>
      <DocsBody>
        <Cards>
          {destinations.map(item => (
            <Card key={item.href} href={item.href} icon={item.icon} title={item.title}>
              {item.description}
              <span className="mt-2 block text-xs font-medium text-fd-primary">{item.count}</span>
            </Card>
          ))}
        </Cards>

        <h2 id="resources-popular">Popular right now</h2>
        <Cards>
          {popular.map(item => (
            <Card key={item.href} href={item.href} title={item.title} description={item.kind} />
          ))}
        </Cards>
      </DocsBody>
      <DocsSupport
        title="Can’t find it?"
        text="Account, billing, and server-specific requests are handled by support. Check live infrastructure health on the status page."
        actions={[
          { href: 'https://dash.stealthrdp.com/submitticket.php', label: 'Open a support ticket' },
          { href: 'https://wa.me/447441426993', label: 'WhatsApp support' },
          { href: '/status', label: 'Service status' },
        ]}
      />
    </DocsPage>
  );
}

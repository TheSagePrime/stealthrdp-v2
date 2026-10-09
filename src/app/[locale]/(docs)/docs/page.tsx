import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { cardSectionsToc, collectionSections, DocsCardSections } from '@/components/site/docs/DocsCollections';
import { DocsSupport } from '@/components/site/docs/DocsParts';
import { helpDocsArticles } from '@/lib/stealth/articles';
import { helpArticleHref, helpCollections } from '@/lib/stealth/help-center';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/docs',
  title: 'Help Center — StealthRDP',
  description: 'StealthRDP setup, troubleshooting, server management, networking, panels, policies, licensing, and support guidance.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default async function DocsPageRoute() {
  await requirePageLocale('/docs');
  const sections = collectionSections(helpCollections, helpDocsArticles, helpArticleHref);
  return (
    <DocsPage toc={cardSectionsToc(sections)}>
      <DocsTitle>StealthRDP Help Center</DocsTitle>
      <DocsDescription>
        Practical setup and troubleshooting for StealthRDP servers, organized around the task you are trying to complete.
      </DocsDescription>
      <DocsBody className="[&>section:first-child>h2]:mt-4">
        <DocsCardSections sections={sections} />
      </DocsBody>
      <DocsSupport
        title="Can’t find it?"
        text="Account, billing, and server-specific requests are handled by support."
        actions={[
          { href: 'https://dash.stealthrdp.com/submitticket.php', label: 'Open a support ticket' },
          { href: 'https://wa.me/447441426993', label: 'WhatsApp support' },
        ]}
      />
    </DocsPage>
  );
}

import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { cardSectionsToc, collectionSections, DocsCardSections } from '@/components/site/docs/DocsCollections';
import { DocsSupport } from '@/components/site/docs/DocsParts';
import { TranslatedDocsIndex } from '@/components/site/docs/TranslatedPages';
import { helpDocsArticles } from '@/lib/stealth/articles';
import { helpArticleHref, helpCollections } from '@/lib/stealth/help-center';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { translatedIndexMetadata } from '@/lib/stealth/translations';

/* German and Spanish exist once a translated article is published (src/config/i18n.ts). */
export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/docs', {
    en: {
      title: 'Help Center — StealthRDP',
      description: 'StealthRDP setup, troubleshooting, server management, networking, panels, policies, licensing, and support guidance.',
      ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
    },
    ...translatedIndexMetadata('help'),
  });
}

export default async function DocsPageRoute() {
  const locale = await requirePageLocale('/docs');
  if (locale !== 'en') {
    return <TranslatedDocsIndex locale={locale} section="help" />;
  }
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

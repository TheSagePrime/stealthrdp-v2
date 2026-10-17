import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { cardSectionsToc, collectionSections, DocsCardSections } from '@/components/site/docs/DocsCollections';
import { DocsSupport } from '@/components/site/docs/DocsParts';
import { TranslatedDocsIndex } from '@/components/site/docs/TranslatedPages';
import { citadelDocsArticles } from '@/lib/stealth/articles';
import { citadelArticleHref, citadelCollections } from '@/lib/stealth/help-center';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { translatedIndexMetadata } from '@/lib/stealth/translations';

/* German and Spanish exist once a translated Citadel doc is published (src/config/i18n.ts). */
export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/citadel/docs', {
    en: {
      title: 'Citadel Docs — Layer 7 DDoS Protection',
      description: 'Citadel documentation for setup, Cloudflare routing, domains, challenge levels, allowlists, cache, traffic analytics, bandwidth, alerts, billing, and support.',
      ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
    },
    ...translatedIndexMetadata('citadel'),
  });
}

export default async function CitadelDocsPage() {
  const locale = await requirePageLocale('/citadel/docs');
  if (locale !== 'en') {
    return <TranslatedDocsIndex locale={locale} section="citadel" />;
  }
  const sections = collectionSections(citadelCollections, citadelDocsArticles, citadelArticleHref);
  return (
    <DocsPage toc={cardSectionsToc(sections)}>
      <DocsTitle>Citadel Docs</DocsTitle>
      <DocsDescription>
        Set up, tune, and operate Citadel: Cloudflare routing, protected domains, challenges,
        allowlists, caching, traffic visibility, bandwidth, alerts, and billing.
      </DocsDescription>
      <DocsBody className="[&>section:first-child>h2]:mt-4">
        <DocsCardSections sections={sections} />
      </DocsBody>
      <DocsSupport
        title="Need help with Citadel?"
        text="Send the protected domain, approximate time, request path, and any relevant error or screenshot."
        actions={[{ href: 'https://dash.stealthrdp.com/submitticket.php', label: 'Open support ticket' }]}
      />
    </DocsPage>
  );
}

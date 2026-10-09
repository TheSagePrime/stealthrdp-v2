import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { cardSectionsToc, collectionSections, DocsCardSections } from '@/components/site/docs/DocsCollections';
import { DocsSupport } from '@/components/site/docs/DocsParts';
import { citadelDocsArticles } from '@/lib/stealth/articles';
import { citadelArticleHref, citadelCollections } from '@/lib/stealth/help-center';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/citadel/docs',
  title: 'Citadel Docs — Layer 7 DDoS Protection',
  description: 'Citadel documentation for setup, Cloudflare routing, domains, challenge levels, allowlists, cache, traffic analytics, bandwidth, alerts, billing, and support.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default async function CitadelDocsPage() {
  await requirePageLocale('/citadel/docs');
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

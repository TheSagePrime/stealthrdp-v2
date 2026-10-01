import type { Metadata } from 'next';
import { DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { FaqExplorer } from '@/components/site/FaqExplorer';
import { faqs } from '@/lib/stealth/content';
import { faqCategoryId } from '@/lib/stealth/faq-topics';
import { faqJsonLd } from '@/lib/stealth/structured-data';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/faq',
  title: 'Common Questions — StealthRDP Resources',
  description:
    'Quick answers about StealthRDP VPS plans, setup, operating systems, upgrades, refunds, billing, security, and support.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function FaqPage() {
  const toc = Array.from(new Set(faqs.map(item => item.category))).map(category => ({
    title: category,
    url: `#${faqCategoryId(category)}`,
    depth: 2,
  }));

  return (
    <DocsPage toc={toc} tableOfContent={{ style: 'clerk' }}>
      <DocsTitle>Common questions</DocsTitle>
      <DocsDescription>
        Plans, setup, billing, operating systems, security, refunds, and support.
        Search from the resource bar above or jump to a topic.
      </DocsDescription>
      <FaqExplorer faqs={faqs} />
      <ProductionJsonLd data={faqJsonLd(faqs)} />
    </DocsPage>
  );
}

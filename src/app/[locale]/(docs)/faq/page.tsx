import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { FaqExplorer } from '@/components/site/FaqExplorer';
import { faqPageCopy, faqsByLocale } from '@/content/i18n/faq';
import { faqCategoryId } from '@/lib/stealth/faq-topics';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { faqJsonLd } from '@/lib/stealth/structured-data';

const ogImage = 'https://www.stealthrdp.com/assets/og-cover.png';

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/faq', {
    en: { ...faqPageCopy.en.meta, ogImage },
    de: { ...faqPageCopy.de.meta, ogImage },
    es: { ...faqPageCopy.es.meta, ogImage },
  });
}

export default async function FaqPage() {
  const locale = await requirePageLocale('/faq');
  const t = faqPageCopy[locale];
  const faqs = faqsByLocale[locale];
  const toc = Array.from(new Set(faqs.map(item => item.category))).map(category => ({
    title: category,
    url: `#${faqCategoryId(category)}`,
    depth: 2,
  }));

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{t.title}</DocsTitle>
      <DocsDescription>{t.description}</DocsDescription>
      <DocsBody className="[&>section:first-child>h2]:mt-4">
        <FaqExplorer faqs={faqs} copy={{ licensingPhrase: t.licensingPhrase, support: t.support }} locale={locale} />
      </DocsBody>
      <ProductionJsonLd data={faqJsonLd(faqs)} />
    </DocsPage>
  );
}

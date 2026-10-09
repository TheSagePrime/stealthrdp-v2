import type { Metadata } from 'next';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { FaqExplorer } from '@/components/site/FaqExplorer';
import { ResourcePage } from '@/components/site/guides/ResourcePage';
import { ResourcesBar } from '@/components/site/ResourcesBar';
import { ResourceTopics } from '@/components/site/ResourceTopics';
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
  const categories = Array.from(new Set(faqs.map(item => item.category)));

  return (
    <>
      <ResourcesBar active="faq" locale={locale} />
      <ResourcePage title={t.title} description={t.description}>
        <ResourceTopics
          label={t.topicsLabel}
          topics={categories.map((category) => {
            const count = faqs.filter(faq => faq.category === category).length;
            return { id: faqCategoryId(category), title: category, count, unit: t.unit(count), iconHint: t.iconHints[category] };
          })}
        />
        <div className="mt-12 max-w-3xl">
          <FaqExplorer faqs={faqs} copy={{ licensingPhrase: t.licensingPhrase, support: t.support }} locale={locale} />
        </div>
      </ResourcePage>
      <ProductionJsonLd data={faqJsonLd(faqs)} />
    </>
  );
}

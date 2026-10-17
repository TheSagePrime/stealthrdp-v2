import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { DocMarkdown, docToc } from '@/components/site/docs/DocMarkdown';
import { DocsArticleMeta, DocsPageActions, DocsRelated, DocsSupport } from '@/components/site/docs/DocsParts';
import { TranslatedDocPage } from '@/components/site/docs/TranslatedPages';
import { citadelDocsArticles, docPublicSlug, findCitadelDocByPublicSlug } from '@/lib/stealth/articles';
import { citadelArticleHref, citadelCollectionForArticle } from '@/lib/stealth/help-center';
import { pageLocale, requirePageLocale } from '@/lib/stealth/i18n-server';
import { formatUpdated, pageUpdated } from '@/lib/stealth/page-dates';
import { techArticleJsonLd } from '@/lib/stealth/structured-data';
import { findTranslatedDoc, translatedDocMetadata } from '@/lib/stealth/translations';
import { getSeoConfig } from '@/libs/seo/config';
import { createPageMetadata } from '@/libs/seo/metadata';

export function generateStaticParams() {
  return citadelDocsArticles.map(article => ({
    slug: docPublicSlug(article).replace(/^citadel-/, ''),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await pageLocale();
  if (locale !== 'en') {
    const translation = findTranslatedDoc(locale, `/citadel/docs/${slug}`);
    return translation ? translatedDocMetadata(translation) : {};
  }
  const article = findCitadelDocByPublicSlug(slug);
  if (!article) {
    return {};
  }

  return createPageMetadata({
    path: `/citadel/docs/${slug}`,
    title: `${article.title} — Citadel Docs`,
    description: article.summary,
    ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
  });
}

export default async function CitadelDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await requirePageLocale(`/citadel/docs/${slug}`);
  if (locale !== 'en') {
    const translation = findTranslatedDoc(locale, `/citadel/docs/${slug}`);
    if (!translation) {
      notFound();
    }
    return <TranslatedDocPage doc={translation} />;
  }
  const article = findCitadelDocByPublicSlug(slug);
  if (!article) {
    notFound();
  }

  const collection = citadelCollectionForArticle(article);
  const related = article.relatedSlugs
    .map(relatedSlug => citadelDocsArticles.find(item => item.slug === relatedSlug))
    .filter((item): item is (typeof citadelDocsArticles)[number] => Boolean(item))
    .slice(0, 4);
  const updated = pageUpdated(`/citadel/docs/${slug}`);

  return (
    <DocsPage toc={docToc(article.content)}>
      <ProductionJsonLd
        data={techArticleJsonLd({
          siteUrl: getSeoConfig().siteUrl,
          path: `/citadel/docs/${slug}`,
          title: article.title,
          description: article.summary,
          date: updated ?? article.date,
          section: { name: 'Citadel Docs', path: '/citadel/docs' },
        })}
      />
      <DocsTitle>{article.title}</DocsTitle>
      <DocsDescription>{article.summary}</DocsDescription>
      <DocsPageActions
        markdownPath={`/docs-md/${docPublicSlug(article)}`}
        pageUrl={new URL(`/citadel/docs/${slug}`, getSeoConfig().siteUrl).href}
      />
      <DocsArticleMeta
        updated={`Updated ${updated ? formatUpdated(updated) : article.date}`}
        section={collection?.title.replace(/^Citadel:\s*/, '')}
      />

      <DocsBody>
        {article.illustration
          ? (
              <figure>
                <Image
                  src={article.illustration.src}
                  alt={article.illustration.alt}
                  width={article.illustration.width}
                  height={article.illustration.height}
                  sizes="(max-width: 760px) 100vw, 760px"
                />
                <figcaption>{article.illustration.caption}</figcaption>
              </figure>
            )
          : null}

        <DocMarkdown content={article.content} />
      </DocsBody>

      <DocsRelated
        heading="Continue with a related task"
        items={related.map(item => ({ href: citadelArticleHref(item), title: item.title, description: item.summary }))}
      />
      <DocsSupport
        title="Need help with Citadel?"
        text="Send the protected domain, approximate time, request path, and any relevant error or screenshot."
        actions={[{ href: 'https://dash.stealthrdp.com/submitticket.php', label: 'Open support ticket' }]}
      />
    </DocsPage>
  );
}

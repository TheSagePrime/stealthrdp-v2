import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { DocMarkdown, docToc } from '@/components/site/docs/DocMarkdown';
import { DocsArticleMeta, DocsRelated, DocsSupport } from '@/components/site/docs/DocsParts';
import { docPublicSlug, findDocByPublicSlug, helpDocsArticles } from '@/lib/stealth/articles';
import { helpArticleHref, helpCollectionForArticle } from '@/lib/stealth/help-center';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
import { formatUpdated, pageUpdated } from '@/lib/stealth/page-dates';
import { techArticleJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';
import { createPageMetadata } from '@/libs/seo/metadata';

export function generateStaticParams() {
  return helpDocsArticles.map(article => ({ slug: docPublicSlug(article) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = findDocByPublicSlug(slug);
  if (!article) {
    return {};
  }
  return createPageMetadata({
    path: `/docs/${slug}`,
    title: `${article.title} — StealthRDP`,
    description: article.summary,
    ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
  });
}

export default async function DocPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await requirePageLocale(`/docs/${slug}`);
  const article = findDocByPublicSlug(slug);
  if (!article) {
    notFound();
  }

  const collection = helpCollectionForArticle(article);
  const related = article.relatedSlugs
    .map(relatedSlug => helpDocsArticles.find(item => item.slug === relatedSlug))
    .filter((item): item is (typeof helpDocsArticles)[number] => Boolean(item))
    .slice(0, 3);
  const updated = pageUpdated(`/docs/${slug}`);

  return (
    <DocsPage toc={docToc(article.content, article.title)}>
      <ProductionJsonLd
        data={techArticleJsonLd({
          siteUrl: getSeoConfig().siteUrl,
          path: `/docs/${slug}`,
          title: article.title,
          description: article.summary,
          date: updated ?? article.date,
          section: { name: 'Help Center', path: '/docs' },
        })}
      />
      <DocsTitle>{article.title}</DocsTitle>
      <DocsDescription>{article.summary}</DocsDescription>
      <DocsArticleMeta updated={`Updated ${updated ? formatUpdated(updated) : article.date}`} section={collection?.title} />

      <DocsBody>
        <DocMarkdown content={article.content} title={article.title} />
      </DocsBody>

      <DocsRelated
        heading="Continue with a related task"
        items={related.map(item => ({ href: helpArticleHref(item), title: item.title, description: item.summary }))}
      />
      <DocsSupport
        title="Still need a hand?"
        text="Account, billing, and server-specific requests are handled in the client portal."
        actions={[
          { href: 'https://dash.stealthrdp.com/submitticket.php', label: 'Contact support' },
          { href: 'https://wa.me/447441426993', label: 'WhatsApp support' },
        ]}
      />
    </DocsPage>
  );
}

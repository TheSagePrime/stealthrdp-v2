/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { DocBody, docHeadings } from '@/components/site/DocBody';
import { RelatedArticles } from '@/components/site/RelatedArticles';
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

  const toc = docHeadings(article.content, article.title).map(heading => ({
    title: heading.text,
    url: `#${heading.id}`,
    depth: heading.level ?? 2,
  }));
  const collection = helpCollectionForArticle(article);
  const related = article.relatedSlugs
    .map(relatedSlug => helpDocsArticles.find(item => item.slug === relatedSlug))
    .filter((item): item is (typeof helpDocsArticles)[number] => Boolean(item))
    .slice(0, 3);

  const updated = pageUpdated(`/docs/${slug}`);

  return (
    <DocsPage toc={toc} tableOfContent={{ style: 'clerk' }}>
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
      <div className="sr-docs-article-meta">
        <span>{`Updated ${updated ? formatUpdated(updated) : article.date}`}</span>
        {collection ? <span>{collection.title}</span> : null}
      </div>

      <DocsBody>
        <DocBody content={article.content} title={article.title} />
      </DocsBody>

      <RelatedArticles
        heading="Continue with a related task"
        id="related-help-title"
        items={related.map(item => ({
          href: helpArticleHref(item),
          title: item.title,
          description: item.summary,
        }))}
      />

      <aside className="sr-res-support not-prose">
        <div>
          <h2>Still need a hand?</h2>
          <p>Account, billing, and server-specific requests are handled in the client portal.</p>
        </div>
        <div className="sr-res-support-actions">
          <a href="https://dash.stealthrdp.com/submitticket.php">Contact support</a>
          <a href="https://wa.me/447441426993">WhatsApp support</a>
        </div>
      </aside>
    </DocsPage>
  );
}

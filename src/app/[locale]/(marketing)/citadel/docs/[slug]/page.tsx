/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { DocBody, docHeadings } from '@/components/site/DocBody';
import { RelatedArticles } from '@/components/site/RelatedArticles';
import { citadelDocsArticles, docPublicSlug, findCitadelDocByPublicSlug } from '@/lib/stealth/articles';
import { citadelArticleHref, citadelCollectionForArticle } from '@/lib/stealth/help-center';
import { formatUpdated, pageUpdated } from '@/lib/stealth/page-dates';
import { techArticleJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';
import { createPageMetadata } from '@/libs/seo/metadata';

export function generateStaticParams() {
  return citadelDocsArticles.map(article => ({
    slug: docPublicSlug(article).replace(/^citadel-/, ''),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
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
  const article = findCitadelDocByPublicSlug(slug);
  if (!article) {
    notFound();
  }

  const toc = docHeadings(article.content, article.title).map(heading => ({
    title: heading.text,
    url: `#${heading.id}`,
    depth: heading.level ?? 2,
  }));
  const collection = citadelCollectionForArticle(article);
  const related = article.relatedSlugs
    .map(relatedSlug => citadelDocsArticles.find(item => item.slug === relatedSlug))
    .filter((item): item is (typeof citadelDocsArticles)[number] => Boolean(item))
    .slice(0, 4);

  const updated = pageUpdated(`/citadel/docs/${slug}`);

  return (
    <DocsPage toc={toc} tableOfContent={{ style: 'clerk' }}>
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
      <div className="sr-docs-article-meta">
        <span>{`Updated ${updated ? formatUpdated(updated) : article.date}`}</span>
        {collection ? <span>{collection.title.replace(/^Citadel:\s*/, '')}</span> : null}
      </div>

      <DocsBody>
        {article.illustration
          ? (
              <figure className="sr-res-figure not-prose">
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

        <DocBody content={article.content} title={article.title} />
      </DocsBody>

      <RelatedArticles
        heading="Continue with a related task"
        id="related-citadel-title"
        items={related.map(item => ({
          href: citadelArticleHref(item),
          title: item.title,
          description: item.summary,
        }))}
      />

      <aside className="sr-res-support not-prose">
        <div>
          <h2>Need help with Citadel?</h2>
          <p>Send the protected domain, approximate time, request path, and any relevant error or screenshot.</p>
        </div>
        <div className="sr-res-support-actions">
          <a href="https://dash.stealthrdp.com/submitticket.php">Open support ticket</a>
        </div>
      </aside>
    </DocsPage>
  );
}

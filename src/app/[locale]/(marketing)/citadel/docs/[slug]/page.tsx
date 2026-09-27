import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CitadelSidebar } from '@/components/site/CitadelSidebar';
import { DocBody, docHeadings } from '@/components/site/DocBody';
import { HelpTopbar } from '@/components/site/HelpTopbar';
import { ResourceToc } from '@/components/site/ResourceToc';
import { createPageMetadata } from '@/libs/seo/metadata';
import {
  citadelArticleHref,
  citadelCollectionForArticle,
  orderedCitadelArticles,
} from '@/lib/stealth/help-center';
import {
  citadelDocsArticles,
  docPublicSlug,
  findCitadelDocByPublicSlug,
} from '@/lib/stealth/content';

export function generateStaticParams() {
  return citadelDocsArticles.map(article => ({
    slug: docPublicSlug(article).replace(/^citadel-/, ''),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = findCitadelDocByPublicSlug(slug);
  if (!article) return {};

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
  if (!article) notFound();

  const headings = docHeadings(article.content, article.title);
  const collection = citadelCollectionForArticle(article);
  const ordered = orderedCitadelArticles(citadelDocsArticles);
  const currentIndex = ordered.findIndex(item => item.slug === article.slug);
  const previous = currentIndex > 0 ? ordered[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < ordered.length - 1 ? ordered[currentIndex + 1] : undefined;
  const related = article.relatedSlugs
    .map(relatedSlug => citadelDocsArticles.find(item => item.slug === relatedSlug))
    .filter((item): item is (typeof citadelDocsArticles)[number] => Boolean(item))
    .slice(0, 3);

  return (
    <div className="srv-page srv-page-doc-article srv-page-citadel-docs srv-docs-product">
      <HelpTopbar active="citadel" />

      <div className="sr-container srv-docs-mobile-wrap">
        <details className="srv-docs-mobile-nav">
          <summary>Browse Citadel Docs</summary>
          <CitadelSidebar articles={citadelDocsArticles} activeSlug={article.slug} />
        </details>
      </div>

      <div className="sr-container srv-docs-grid srv-docs-article-grid">
        <aside className="srv-docs-sidebar">
          <CitadelSidebar articles={citadelDocsArticles} activeSlug={article.slug} />
        </aside>

        <article className="srv-docs-article">
          <nav className="srv-docs-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/citadel">Citadel</Link>
            <span>/</span>
            <Link href="/citadel/docs">Docs</Link>
            <span>/</span>
            {collection ? (
              <>
                <Link href={`/citadel/docs#${collection.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}>
                  {collection.title.replace(/^Citadel:\s*/, '')}
                </Link>
                <span>/</span>
              </>
            ) : null}
            <span aria-current="page">{article.title}</span>
          </nav>

          <header className="srv-docs-article-head">
            <p className="sr-kicker">{collection?.title.replace(/^Citadel:\s*/, '') ?? article.category}</p>
            <h1>{article.title}</h1>
            <p>{article.summary}</p>
            <div className="srv-docs-article-meta">
              <span>Last updated {article.date}</span>
              <a href="https://dash.stealthrdp.com/submitticket.php">Need help? ↗</a>
            </div>
          </header>

          <DocBody content={article.content} title={article.title} />

          {related.length > 0 ? (
            <section className="srv-docs-related" aria-labelledby="related-citadel-title">
              <span className="srv-resource-nav-label">Related Citadel docs</span>
              <h2 id="related-citadel-title">Continue with a related task</h2>
              <div>
                {related.map(item => (
                  <Link key={item.slug} href={citadelArticleHref(item)}>
                    <strong>{item.title}</strong>
                    <small>{item.summary}</small>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <nav className="srv-docs-pagination" aria-label="Citadel article navigation">
            {previous ? (
              <Link href={citadelArticleHref(previous)} rel="prev">
                <span>Previous</span>
                <strong>← {previous.title}</strong>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={citadelArticleHref(next)} rel="next">
                <span>Next</span>
                <strong>{next.title} →</strong>
              </Link>
            ) : <span />}
          </nav>

          <footer className="srv-docs-support-strip">
            <div>
              <strong>Need help with Citadel?</strong>
              <span>Send the protected domain, approximate time, request path, and any relevant error or screenshot.</span>
            </div>
            <a href="https://dash.stealthrdp.com/submitticket.php">Open support ticket ↗</a>
          </footer>
        </article>

        <aside className="srv-docs-toc">
          <ResourceToc headings={headings} />
          <div className="srv-docs-toc-links">
            <span className="srv-resource-nav-label">Also useful</span>
            <Link href="/citadel">Citadel overview</Link>
            <Link href="/status">Service status</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DocBody, docHeadings } from '@/components/site/DocBody';
import { HelpSidebar } from '@/components/site/HelpSidebar';
import { HelpTopbar } from '@/components/site/HelpTopbar';
import { ResourceToc } from '@/components/site/ResourceToc';
import { createPageMetadata } from '@/libs/seo/metadata';
import {
  helpArticleHref,
  helpCollectionForArticle,
  orderedHelpArticles,
} from '@/lib/stealth/help-center';
import {
  docPublicSlug,
  docsArticles,
  findDocByPublicSlug,
} from '@/lib/stealth/content';

export function generateStaticParams() {
  return docsArticles.map(article => ({ slug: docPublicSlug(article) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = findDocByPublicSlug(slug);
  if (!article) return {};
  return createPageMetadata({
    path: `/docs/${slug}`,
    title: `${article.title} — StealthRDP Help Center`,
    description: article.summary,
    ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
  });
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = findDocByPublicSlug(slug);
  if (!article) notFound();

  const headings = docHeadings(article.content);
  const collection = helpCollectionForArticle(article);
  const ordered = orderedHelpArticles(docsArticles);
  const currentIndex = ordered.findIndex(item => item.slug === article.slug);
  const previous = currentIndex > 0 ? ordered[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < ordered.length - 1 ? ordered[currentIndex + 1] : undefined;
  const related = article.relatedSlugs
    .map(relatedSlug => docsArticles.find(item => item.slug === relatedSlug))
    .filter((item): item is (typeof docsArticles)[number] => Boolean(item))
    .slice(0, 3);

  return (
    <div className="srv-page srv-page-doc-article srv-docs-product">
      <HelpTopbar />

      <div className="sr-container srv-docs-grid srv-docs-article-grid">
        <aside className="srv-docs-sidebar">
          <HelpSidebar articles={docsArticles} activeSlug={article.slug} />
        </aside>

        <article className="srv-docs-article">
          <nav className="srv-docs-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/docs">Help Center</Link>
            <span>/</span>
            {collection ? (
              <>
                <Link href={`/docs#${collection.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}>
                  {collection.title}
                </Link>
                <span>/</span>
              </>
            ) : null}
            <span aria-current="page">{article.title}</span>
          </nav>

          <header className="srv-docs-article-head">
            <p className="sr-kicker">{collection?.title ?? article.category}</p>
            <h1>{article.title}</h1>
            <p>{article.summary}</p>
            <div className="srv-docs-article-meta">
              <span>Last updated {article.date}</span>
              <a href="https://dash.stealthrdp.com/submitticket.php">Need help? ↗</a>
            </div>
          </header>

          <DocBody content={article.content} />

          {related.length > 0 ? (
            <section className="srv-docs-related" aria-labelledby="related-help-title">
              <span className="srv-resource-nav-label">Related help</span>
              <h2 id="related-help-title">Continue with a related task</h2>
              <div>
                {related.map(item => (
                  <Link key={item.slug} href={helpArticleHref(item)}>
                    <strong>{item.title}</strong>
                    <small>{item.summary}</small>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <nav className="srv-docs-pagination" aria-label="Help article navigation">
            {previous ? (
              <Link href={helpArticleHref(previous)} rel="prev">
                <span>Previous</span>
                <strong>← {previous.title}</strong>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={helpArticleHref(next)} rel="next">
                <span>Next</span>
                <strong>{next.title} →</strong>
              </Link>
            ) : <span />}
          </nav>

          <footer className="srv-docs-support-strip">
            <div>
              <strong>Still stuck?</strong>
              <span>Send the server name, exact error, screenshot, and approximate time.</span>
            </div>
            <a href="https://dash.stealthrdp.com/submitticket.php">Open support ticket ↗</a>
          </footer>
        </article>

        <aside className="srv-docs-toc">
          <ResourceToc headings={headings} />
          <div className="srv-docs-toc-links">
            <span className="srv-resource-nav-label">Also useful</span>
            <Link href="/faq">Common questions</Link>
            <Link href="/status">Service status</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

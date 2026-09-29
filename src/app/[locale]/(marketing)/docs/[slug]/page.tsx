import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { DocBody, docHeadings } from '@/components/site/DocBody';
import { createPageMetadata } from '@/libs/seo/metadata';
import {
  helpArticleHref,
  helpCollectionForArticle,
  orderedHelpArticles,
} from '@/lib/stealth/help-center';
import {
  docPublicSlug,
  helpDocsArticles,
  findDocByPublicSlug,
} from '@/lib/stealth/content';

export function generateStaticParams() {
  return helpDocsArticles.map(article => ({ slug: docPublicSlug(article) }));
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

export default async function DocPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = findDocByPublicSlug(slug);
  if (!article) notFound();

  const toc = docHeadings(article.content, article.title).map(heading => ({
    title: heading.text,
    url: `#${heading.id}`,
    depth: heading.level ?? 2,
  }));
  const collection = helpCollectionForArticle(article);
  const ordered = orderedHelpArticles(helpDocsArticles);
  const currentIndex = ordered.findIndex(item => item.slug === article.slug);
  const previous = currentIndex > 0 ? ordered[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < ordered.length - 1 ? ordered[currentIndex + 1] : undefined;
  const related = article.relatedSlugs
    .map(relatedSlug => helpDocsArticles.find(item => item.slug === relatedSlug))
    .filter((item): item is (typeof helpDocsArticles)[number] => Boolean(item))
    .slice(0, 3);

  return (
    <DocsPage toc={toc} tableOfContent={{ style: 'clerk' }}>
      <DocsTitle>{article.title}</DocsTitle>
      <DocsDescription>{article.summary}</DocsDescription>
      <p className="sr-docs-updated">
        Updated {article.date}{collection ? <> <span>·</span> {collection.title}</> : null}
      </p>

      <DocsBody>
        <DocBody content={article.content} title={article.title} />

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

        <footer className="sr-article-support">
          <h2 className="sr-section-title">Still need a hand?</h2>
          <p>Account, billing, and server-specific requests are handled in the client portal.</p>
          <div className="sr-inline-links">
            <a href="https://dash.stealthrdp.com/submitticket.php">Contact support</a>
            <a href="https://wa.me/447441426993">WhatsApp: +44 7441 426993</a>
            <a href="/docs">All documentation</a>
          </div>
        </footer>
      </DocsBody>
    </DocsPage>
  );
}

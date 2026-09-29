import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { DocBody } from '@/components/site/DocBody';
import { createPageMetadata } from '@/libs/seo/metadata';
import { docPublicSlug, docsArticles, findDocByPublicSlug } from '@/lib/stealth/content';
import { getMarkdownHeadings } from '@/lib/stealth/resource-headings';

export function generateStaticParams() {
  return docsArticles.map(article => ({ slug: docPublicSlug(article) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = findDocByPublicSlug(slug);
  if (!article) return {};
  return createPageMetadata({
    path: `/docs/${slug}`,
    title: `${article.title} — StealthRDP Docs`,
    description: article.summary,
    ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
  });
}

export default async function DocPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = findDocByPublicSlug(slug);
  if (!article) notFound();

  return (
    <DocsPage toc={getMarkdownHeadings(article.content)} tableOfContent={{ style: 'clerk' }}>
      <DocsTitle>{article.title}</DocsTitle>
      <DocsDescription>{article.summary}</DocsDescription>
      <p className="sr-docs-updated">Updated {article.date} <span>·</span> {article.category}</p>
      <DocsBody>
        <DocBody content={article.content} />
        <footer className="sr-article-support">
          <h2 className="sr-section-title">Still need a hand?</h2>
          <p>Account, billing, and server-specific requests are handled in the client portal. For quick questions, message us on WhatsApp or email.</p>
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

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocBody } from '@/components/site/DocBody';
import { createPageMetadata } from '@/libs/seo/metadata';
import { docPublicSlug, docsArticles, findDocByPublicSlug } from '@/lib/stealth/content';

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
  });
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = findDocByPublicSlug(slug);
  if (!article) notFound();
  return (
    <article className="sr-article-shell">
      <header className="sr-article-header">
        <p className="sr-kicker">{article.category}</p>
        <h1>{article.title}</h1>
        <p className="sr-article-meta">Last updated: {article.date}</p>
        <p className="sr-lede">{article.summary}</p>
        <div className="sr-article-facts">
          <span>StealthRDP documentation</span>
          <span>{article.category}</span>
        </div>
      </header>
      <DocBody content={article.content} />
    </article>
  );
}
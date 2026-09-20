import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta } from '@/components/seo/Article';
import { TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { getSeoConfig } from '@/libs/seo/config';
import { createArticleMetadata } from '@/libs/seo/articles';
import { blogArticles, findBlog } from '@/lib/stealth/content';

export function generateStaticParams() {
  return blogArticles.filter(article => article.slug !== 'vps-hosting-minecraft').map(article => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === slug);
  return publication ? createArticleMetadata(publication, config) : {};
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = findBlog(slug);
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === slug);
  if (!article || !publication || slug === 'vps-hosting-minecraft') notFound();

  return (
    <article className="sr-article-shell">
      <p className="sr-kicker">{article.category}</p>
      <h1>{article.title}</h1>
      <ArticlePublicationMeta article={publication} />
      <p className="sr-lede">{article.excerpt}</p>
      <ArticleJsonLd article={publication} config={config} />
      <TrustedArticleBody html={article.html} />
    </article>
  );
}
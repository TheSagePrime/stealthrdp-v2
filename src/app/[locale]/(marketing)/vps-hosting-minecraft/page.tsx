import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta } from '@/components/seo/Article';
import { TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { getSeoConfig } from '@/libs/seo/config';
import { createArticleMetadata } from '@/libs/seo/articles';
import { findBlog } from '@/lib/stealth/content';

export async function generateMetadata(): Promise<Metadata> {
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === 'vps-hosting-minecraft');
  return publication ? createArticleMetadata(publication, config) : {};
}

export default function MinecraftPage() {
  const article = findBlog('vps-hosting-minecraft');
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === 'vps-hosting-minecraft');
  if (!article || !publication) notFound();
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
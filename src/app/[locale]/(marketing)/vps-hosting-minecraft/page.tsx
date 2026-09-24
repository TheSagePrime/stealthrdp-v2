import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta } from '@/components/seo/Article';
import { TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { Badge } from '@/components/ui/badge';
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
    /* The guide body stays prose: a reading-width shell, not a card. */
    <article className="mx-auto grid w-full max-w-3xl gap-8 px-5 pt-24 pb-28">
      <header className="grid gap-4">
        <p className="sr-kicker">{article.category}</p>
        <h1 className="text-display-1 tracking-tight text-balance">{article.title}</h1>
        <ArticlePublicationMeta article={publication} />
        <p className="sr-lede">{article.excerpt}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-body-muted">{article.author}</Badge>
          <Badge variant="outline" className="text-body-muted">{article.readingTime} min read</Badge>
        </div>
      </header>
      <ArticleJsonLd article={publication} config={config} />
      <TrustedArticleBody html={article.html} />
    </article>
  );
}

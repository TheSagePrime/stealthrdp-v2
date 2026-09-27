import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta, ArticleSources } from '@/components/seo/Article';
import { TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { getSeoConfig } from '@/libs/seo/config';
import { createArticleMetadata } from '@/libs/seo/articles';
import { blogArticles, findBlog } from '@/lib/stealth/content';

export function generateStaticParams() {
  return blogArticles.filter(article => article.slug !== 'vps-hosting-minecraft').map(article => ({ slug: `${article.slug}.html` }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const articleSlug = slug.replace(/\.html$/, '');
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === articleSlug);
  return publication ? createArticleMetadata(publication, config) : {};
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articleSlug = slug.replace(/\.html$/, '');
  const article = findBlog(articleSlug);
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === articleSlug);
  if (!slug.endsWith('.html') || !article || !publication || articleSlug === 'vps-hosting-minecraft') notFound();

  return (
    <article className="srv-page srv-page-article srv-page-blog-article sr-article-shell">
      <header className="sr-article-header">
        <p className="sr-kicker">{article.category}</p>
        <h1>{article.title}</h1>
        <ArticlePublicationMeta article={publication} />
        <p className="sr-lede">{article.excerpt}</p>
        <div className="sr-article-facts">
          <span>{article.author}</span>
          <span>{article.readingTime} min read</span>
        </div>
      </header>
      <ArticleJsonLd article={publication} config={config} />
      <TrustedArticleBody html={article.html} />
      <ArticleSources sources={publication.sources ?? []} />
    </article>
  );
}
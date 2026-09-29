import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta } from '@/components/seo/Article';
import { TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { getSeoConfig } from '@/libs/seo/config';
import { createArticleMetadata } from '@/libs/seo/articles';
import { blogArticles, findBlog } from '@/lib/stealth/content';
import { getHtmlHeadings } from '@/lib/stealth/resource-headings';

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
    <>
      <ArticleJsonLd article={publication} config={config} />
      <DocsPage toc={getHtmlHeadings(article.html)} tableOfContent={{ style: 'clerk' }}>
        <DocsTitle>{article.title}</DocsTitle>
        <DocsDescription>{article.excerpt}</DocsDescription>
        <div className="sr-docs-article-meta">
          <ArticlePublicationMeta article={publication} />
          <span>{article.author}</span>
          <span>{article.readingTime} min read</span>
        </div>
        <DocsBody><TrustedArticleBody html={article.html} /></DocsBody>
      </DocsPage>
    </>
  );
}

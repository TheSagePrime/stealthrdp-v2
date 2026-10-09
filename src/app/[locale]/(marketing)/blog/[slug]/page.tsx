import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta, ArticleSources } from '@/components/seo/Article';
import { GuideArticle } from '@/components/site/guides/GuideArticle';
import { ResourcesBar } from '@/components/site/ResourcesBar';
import { headingToc, TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { articlePath, blogArticles, findBlog } from '@/lib/stealth/articles';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
import { createArticleMetadata } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';

export function generateStaticParams() {
  return blogArticles
    .filter(article => article.slug !== 'vps-hosting-minecraft')
    .map(article => ({ slug: `${article.slug}.html` }));
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
  await requirePageLocale(`/blog/${slug}`);
  const articleSlug = slug.replace(/\.html$/, '');
  const article = findBlog(articleSlug);
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === articleSlug);
  if (!slug.endsWith('.html') || !article || !publication || articleSlug === 'vps-hosting-minecraft') {
    notFound();
  }

  const related = blogArticles
    .filter(item => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3);

  return (
    <>
      <ResourcesBar active="guides" />
      <ArticleJsonLd article={publication} config={config} />
      <GuideArticle
        section={{ label: 'Guides', href: '/blog' }}
        title={article.title}
        description={article.excerpt}
        meta={(
          <>
            <ArticlePublicationMeta article={publication} />
            <span>{`${article.readingTime} min read`}</span>
          </>
        )}
        toc={headingToc(article.html)}
        relatedHeading="Continue learning"
        related={related.map(item => ({ href: articlePath(item), title: item.title, description: item.excerpt }))}
      >
        <TrustedArticleBody html={article.html} />
        <ArticleSources sources={publication.sources ?? []} />
      </GuideArticle>
    </>
  );
}

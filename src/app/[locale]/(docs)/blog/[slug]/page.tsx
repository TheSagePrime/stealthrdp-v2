import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta, ArticleSources } from '@/components/seo/Article';
import { DocsMeta, DocsPageActions, DocsRelated } from '@/components/site/docs/DocsParts';
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
    <DocsPage toc={headingToc(article.html)}>
      <ArticleJsonLd article={publication} config={config} />
      <DocsTitle>{article.title}</DocsTitle>
      <DocsDescription>{article.excerpt}</DocsDescription>
      <DocsPageActions
        markdownPath={`/docs-md/guide-${article.slug}`}
        pageUrl={new URL(articlePath(article), config.siteUrl).href}
      />
      <DocsMeta>
        <ArticlePublicationMeta article={publication} />
        <span>{`${article.readingTime} min read`}</span>
      </DocsMeta>
      <DocsBody>
        <TrustedArticleBody html={article.html} />
        <ArticleSources sources={publication.sources ?? []} />
      </DocsBody>
      <DocsRelated
        heading="Continue learning"
        items={related.map(item => ({ href: articlePath(item), title: item.title, description: item.excerpt }))}
      />
    </DocsPage>
  );
}

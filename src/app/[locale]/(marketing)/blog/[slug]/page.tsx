import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { ArticleJsonLd, ArticlePublicationMeta, ArticleSources } from '@/components/seo/Article';
import { articleHeadings, TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { createArticleMetadata } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';
import { articlePath, blogArticles, findBlog } from '@/lib/stealth/content';

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
  const articleSlug = slug.replace(/\.html$/, '');
  const article = findBlog(articleSlug);
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === articleSlug);
  if (!slug.endsWith('.html') || !article || !publication || articleSlug === 'vps-hosting-minecraft') notFound();

  const toc = articleHeadings(article.html).map(heading => ({
    title: heading.text,
    url: `#${heading.id}`,
    depth: heading.level ?? 2,
  }));
  const ordered = blogArticles.filter(item => item.slug !== 'vps-hosting-minecraft');
  const currentIndex = ordered.findIndex(item => item.slug === article.slug);
  const previous = currentIndex > 0 ? ordered[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < ordered.length - 1 ? ordered[currentIndex + 1] : undefined;
  const related = blogArticles
    .filter(item => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3);

  return (
    <>
      <ArticleJsonLd article={publication} config={config} />
      <DocsPage toc={toc} tableOfContent={{ style: 'clerk' }}>
        <DocsTitle>{article.title}</DocsTitle>
        <DocsDescription>{article.excerpt}</DocsDescription>
        <div className="sr-docs-article-meta">
          <ArticlePublicationMeta article={publication} />
          <span>{article.readingTime} min read</span>
        </div>

        <DocsBody>
          <TrustedArticleBody html={article.html} />
          <ArticleSources sources={publication.sources ?? []} />

          {related.length > 0 ? (
            <section className="srv-docs-related" aria-labelledby="related-guides-title">
              <span className="srv-resource-nav-label">Related guides</span>
              <h2 id="related-guides-title">Continue learning</h2>
              <div>
                {related.map(item => (
                  <Link key={item.slug} href={articlePath(item)}>
                    <strong>{item.title}</strong>
                    <small>{item.excerpt}</small>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <nav className="srv-docs-pagination" aria-label="Guide navigation">
            {previous ? (
              <Link href={articlePath(previous)} rel="prev">
                <span>Previous</span>
                <strong>← {previous.title}</strong>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={articlePath(next)} rel="next">
                <span>Next</span>
                <strong>{next.title} →</strong>
              </Link>
            ) : <span />}
          </nav>
        </DocsBody>
      </DocsPage>
    </>
  );
}

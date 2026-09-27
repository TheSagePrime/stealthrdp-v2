import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta, ArticleSources } from '@/components/seo/Article';
import { GuideSidebar } from '@/components/site/GuideSidebar';
import { HelpTopbar } from '@/components/site/HelpTopbar';
import { ResourceToc } from '@/components/site/ResourceToc';
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

  const headings = articleHeadings(article.html);
  const ordered = blogArticles.filter(item => item.slug !== 'vps-hosting-minecraft');
  const currentIndex = ordered.findIndex(item => item.slug === article.slug);
  const previous = currentIndex > 0 ? ordered[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < ordered.length - 1 ? ordered[currentIndex + 1] : undefined;
  const related = blogArticles
    .filter(item => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3);

  return (
    <div className="srv-page srv-page-blog-article srv-docs-product">
      <HelpTopbar active="guides" />

      <div className="sr-container srv-docs-mobile-wrap">
        <details className="srv-docs-mobile-nav">
          <summary>Browse Guides</summary>
          <GuideSidebar activeSlug={article.slug} />
        </details>
      </div>

      <div className="sr-container srv-docs-grid srv-docs-article-grid">
        <aside className="srv-docs-sidebar">
          <GuideSidebar activeSlug={article.slug} />
        </aside>

        <article className="srv-docs-article">
          <nav className="srv-docs-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/blog">Guides</Link>
            <span>/</span>
            <span>{article.category}</span>
            <span>/</span>
            <span aria-current="page">{article.title}</span>
          </nav>

          <header className="srv-docs-article-head">
            <p className="sr-kicker">{article.category}</p>
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
            <div className="srv-docs-article-meta">
              <ArticlePublicationMeta article={publication} />
              <span>{article.readingTime} min read</span>
            </div>
          </header>

          <ArticleJsonLd article={publication} config={config} />
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
        </article>

        <aside className="srv-docs-toc">
          <ResourceToc headings={headings} />
          <div className="srv-docs-toc-links">
            <span className="srv-resource-nav-label">Also useful</span>
            <Link href="/docs">Help Center</Link>
            <Link href="/faq">Common questions</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

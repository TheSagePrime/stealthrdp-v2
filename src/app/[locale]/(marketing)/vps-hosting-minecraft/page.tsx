import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta, ArticleSources } from '@/components/seo/Article';
import { GuideSidebar } from '@/components/site/GuideSidebar';
import { HelpTopbar } from '@/components/site/HelpTopbar';
import { ResourceToc } from '@/components/site/ResourceToc';
import { articleHeadings, TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { Button } from '@/components/ui/button';
import { createArticleMetadata } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';
import { articlePath, blogArticles, findBlog } from '@/lib/stealth/content';

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

  const headings = articleHeadings(article.html);
  const related = blogArticles
    .filter(item => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3);

  return (
    <div className="srv-page srv-page-minecraft srv-docs-product">
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
              {article.readingTime ? <span>{article.readingTime} min read</span> : null}
            </div>
          </header>

          <ArticleJsonLd article={publication} config={config} />
          <TrustedArticleBody html={article.html} />
          <ArticleSources sources={publication.sources ?? []} />

          {related.length > 0 ? (
            <section className="srv-docs-related" aria-labelledby="related-minecraft-guides">
              <span className="srv-resource-nav-label">Related guides</span>
              <h2 id="related-minecraft-guides">Continue learning</h2>
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

          <div className="srv-article-actions">
            <Button asChild variant="outline" size="sm">
              <Link href="/plans">View VPS plans</Link>
            </Button>
            <Button asChild size="sm">
              <a href="https://dash.stealthrdp.com/submitticket.php">Ask support</a>
            </Button>
          </div>
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

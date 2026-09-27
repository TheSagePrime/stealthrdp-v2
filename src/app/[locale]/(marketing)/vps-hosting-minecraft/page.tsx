import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta, ArticleSources } from '@/components/seo/Article';
import { articleHeadings, TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { ResourceNav } from '@/components/site/ResourceNav';
import { ResourceToc } from '@/components/site/ResourceToc';
import { Button } from '@/components/ui/button';
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
  const headings = articleHeadings(article.html);

  return (
    <div className="srv-page srv-page-knowledge-article">
      <div className="sr-container srv-knowledge-article-grid">
        <aside className="srv-knowledge-left">
          <ResourceNav active="guides" />
        </aside>

        <article className="srv-page-article srv-page-minecraft sr-article-shell">
          <header className="sr-article-header">
            <p className="sr-kicker">Guides · {article.category}</p>
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
          <div className="srv-article-actions">
            <Button asChild variant="ghost" size="sm">
              <Link href="/plans">View plans</Link>
            </Button>
            <Button asChild size="sm">
              <a href="https://dash.stealthrdp.com/submitticket.php">Ask support</a>
            </Button>
          </div>
        </article>

        <div className="srv-knowledge-right">
          <ResourceToc headings={headings} />
        </div>
      </div>
    </div>
  );
}

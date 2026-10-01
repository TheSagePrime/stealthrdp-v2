/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta, ArticleSources } from '@/components/seo/Article';
import { RelatedArticles } from '@/components/site/RelatedArticles';
import { ResourceDocsLayout } from '@/components/site/ResourceDocsLayout';
import { articleHeadings, TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { Button } from '@/components/ui/button';
import { articlePath, blogArticles, findBlog } from '@/lib/stealth/articles';
import { guidePageTree } from '@/lib/stealth/resource-tree';
import { createArticleMetadata } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';

export async function generateMetadata(): Promise<Metadata> {
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === 'vps-hosting-minecraft');
  return publication ? createArticleMetadata(publication, config) : {};
}

export default function MinecraftPage() {
  const article = findBlog('vps-hosting-minecraft');
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === 'vps-hosting-minecraft');
  if (!article || !publication) {
    notFound();
  }

  const toc = articleHeadings(article.html).map(heading => ({
    title: heading.text,
    url: `#${heading.id}`,
    depth: heading.level ?? 2,
  }));
  const related = blogArticles
    .filter(item => item.slug !== article.slug && item.category === article.category)
    .slice(0, 3);

  return (
    <ResourceDocsLayout area="guides" tree={guidePageTree}>
      <ArticleJsonLd article={publication} config={config} />
      <DocsPage toc={toc} tableOfContent={{ style: 'clerk' }}>
        <DocsTitle>{article.title}</DocsTitle>
        <DocsDescription>{article.excerpt}</DocsDescription>
        <div className="sr-docs-article-meta">
          <ArticlePublicationMeta article={publication} />
          {article.readingTime
            ? (
                <span>
                  {article.readingTime}
                  {' '}
                  min read
                </span>
              )
            : null}
        </div>

        <DocsBody>
          <TrustedArticleBody html={article.html} />
          <ArticleSources sources={publication.sources ?? []} />
        </DocsBody>

        <RelatedArticles
          heading="Continue learning"
          id="related-minecraft-guides"
          items={related.map(item => ({
            href: articlePath(item),
            title: item.title,
            description: item.excerpt,
          }))}
        />

        <div className="sr-res-actions not-prose">
          <Button asChild variant="outline" size="sm">
            <Link href="/plans">View VPS plans</Link>
          </Button>
          <Button asChild size="sm">
            <a href="https://dash.stealthrdp.com/submitticket.php">Ask support</a>
          </Button>
        </div>
      </DocsPage>
    </ResourceDocsLayout>
  );
}

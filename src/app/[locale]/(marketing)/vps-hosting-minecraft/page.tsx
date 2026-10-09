import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta, ArticleSources } from '@/components/seo/Article';
import { GuideArticle } from '@/components/site/guides/GuideArticle';
import { ResourcesBar } from '@/components/site/ResourcesBar';
import { headingToc, TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { Button } from '@/components/ui/button';
import { articlePath, blogArticles, findBlog } from '@/lib/stealth/articles';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
import { createArticleMetadata } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';

export async function generateMetadata(): Promise<Metadata> {
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === 'vps-hosting-minecraft');
  return publication ? createArticleMetadata(publication, config) : {};
}

export default async function MinecraftPage() {
  await requirePageLocale('/vps-hosting-minecraft');
  const article = findBlog('vps-hosting-minecraft');
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === 'vps-hosting-minecraft');
  if (!article || !publication) {
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
            {article.readingTime ? <span>{`${article.readingTime} min read`}</span> : null}
          </>
        )}
        toc={headingToc(article.html)}
        relatedHeading="Continue learning"
        related={related.map(item => ({ href: articlePath(item), title: item.title, description: item.excerpt }))}
        after={(
          <div className="mt-10 flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/plans">View VPS plans</Link>
            </Button>
            <Button asChild>
              <a href="https://dash.stealthrdp.com/submitticket.php">Ask support</a>
            </Button>
          </div>
        )}
      >
        <TrustedArticleBody html={article.html} />
        <ArticleSources sources={publication.sources ?? []} />
      </GuideArticle>
    </>
  );
}

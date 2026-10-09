import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta, ArticleSources } from '@/components/seo/Article';
import { DocsMeta, DocsRelated, DocsSupport } from '@/components/site/docs/DocsParts';
import { headingToc, TrustedArticleBody } from '@/components/site/TrustedArticleBody';
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
    <DocsPage toc={headingToc(article.html)}>
      <ArticleJsonLd article={publication} config={config} />
      <DocsTitle>{article.title}</DocsTitle>
      <DocsDescription>{article.excerpt}</DocsDescription>
      <DocsMeta>
        <ArticlePublicationMeta article={publication} />
        {article.readingTime ? <span>{`${article.readingTime} min read`}</span> : null}
      </DocsMeta>
      <DocsBody>
        <TrustedArticleBody html={article.html} />
        <ArticleSources sources={publication.sources ?? []} />
      </DocsBody>
      <DocsRelated
        heading="Continue learning"
        items={related.map(item => ({ href: articlePath(item), title: item.title, description: item.excerpt }))}
      />
      <DocsSupport
        actions={[
          { href: '/plans', label: 'View VPS plans' },
          { href: 'https://dash.stealthrdp.com/submitticket.php', label: 'Ask support' },
        ]}
      />
    </DocsPage>
  );
}

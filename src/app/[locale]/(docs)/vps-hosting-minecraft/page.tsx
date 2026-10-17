import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, ArticlePublicationMeta, ArticleSources } from '@/components/seo/Article';
import { DocsMeta, DocsPageActions, DocsRelated, DocsSupport } from '@/components/site/docs/DocsParts';
import { TranslatedGuidePage } from '@/components/site/docs/TranslatedPages';
import { headingToc, TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { articlePath, blogArticles, findBlog } from '@/lib/stealth/articles';
import { pageLocale, requirePageLocale } from '@/lib/stealth/i18n-server';
import { findTranslatedGuide, translatedGuideMetadata } from '@/lib/stealth/translations';
import { createArticleMetadata } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await pageLocale();
  if (locale !== 'en') {
    const translation = findTranslatedGuide(locale, '/vps-hosting-minecraft');
    return translation ? translatedGuideMetadata(translation) : {};
  }
  const config = getSeoConfig();
  const publication = config.articles.publications.find(item => item.slug === 'vps-hosting-minecraft');
  return publication ? createArticleMetadata(publication, config) : {};
}

export default async function MinecraftPage() {
  const locale = await requirePageLocale('/vps-hosting-minecraft');
  if (locale !== 'en') {
    const translation = findTranslatedGuide(locale, '/vps-hosting-minecraft');
    if (!translation) {
      notFound();
    }
    return <TranslatedGuidePage guide={translation} plansLink />;
  }
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
      <DocsPageActions
        markdownPath={`/docs-md/guide-${article.slug}`}
        pageUrl={new URL(articlePath(article), config.siteUrl).href}
      />
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

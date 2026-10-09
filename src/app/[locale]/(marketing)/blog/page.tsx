import type { Metadata } from 'next';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { ResourcePage } from '@/components/site/guides/ResourcePage';
import { ResourcesBar } from '@/components/site/ResourcesBar';
import { ResourceTopics } from '@/components/site/ResourceTopics';
import { articlePath, blogArticles } from '@/lib/stealth/articles';
import { helpCollectionId } from '@/lib/stealth/help-center';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
import { buildArticleIndexJsonLd } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/blog',
  title: 'VPS Guides — StealthRDP',
  description: 'Practical VPS use cases, remote desktop, server management, security, backup, and infrastructure guides from StealthRDP.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default async function BlogPage() {
  await requirePageLocale('/blog');
  const config = getSeoConfig();
  const articleIndexJsonLd = buildArticleIndexJsonLd(config);
  const categories = Array.from(new Set(blogArticles.map(article => article.category)));

  return (
    <>
      <ResourcesBar active="guides" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleIndexJsonLd) }}
      />
      <ResourcePage
        title="VPS Guides"
        description="VPS use cases, security, performance, backups, infrastructure decisions, and practical operations."
      >
        <ResourceTopics
          topics={categories.map((category) => {
            const count = blogArticles.filter(article => article.category === category).length;
            return { id: helpCollectionId(category), title: category, count, unit: count === 1 ? 'guide' : 'guides' };
          })}
        />
        {categories.map(category => (
          <section className="mt-12 scroll-mt-24" id={helpCollectionId(category)} key={category} aria-labelledby={`${helpCollectionId(category)}-title`}>
            <h2
              id={`${helpCollectionId(category)}-title`}
              className="mb-4 text-xl font-semibold tracking-tight"
            >
              {category}
            </h2>
            <Cards>
              {blogArticles
                .filter(article => article.category === category)
                .map(article => (
                  <Card key={article.slug} href={articlePath(article)} title={article.title} description={article.excerpt} />
                ))}
            </Cards>
          </section>
        ))}
      </ResourcePage>
    </>
  );
}

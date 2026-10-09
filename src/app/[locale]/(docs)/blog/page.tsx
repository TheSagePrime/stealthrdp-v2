import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { cardSectionsToc, DocsCardSections } from '@/components/site/docs/DocsCollections';
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
  const sections = Array.from(new Set(blogArticles.map(article => article.category))).map(category => ({
    id: helpCollectionId(category),
    title: category,
    items: blogArticles
      .filter(article => article.category === category)
      .map(article => ({ href: articlePath(article), title: article.title, description: article.excerpt })),
  }));

  return (
    <DocsPage toc={cardSectionsToc(sections)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleIndexJsonLd) }}
      />
      <DocsTitle>VPS Guides</DocsTitle>
      <DocsDescription>
        VPS use cases, security, performance, backups, infrastructure decisions, and practical operations.
      </DocsDescription>
      <DocsBody className="[&>section:first-child>h2]:mt-4">
        <DocsCardSections sections={sections} />
      </DocsBody>
    </DocsPage>
  );
}

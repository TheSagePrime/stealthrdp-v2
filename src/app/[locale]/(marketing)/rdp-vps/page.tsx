/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { RelatedArticles } from '@/components/site/RelatedArticles';
import { ResourceDocsLayout } from '@/components/site/ResourceDocsLayout';
import { articleHeadings, TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { rdpVpsGuide } from '@/content/rdp-vps';
import { guidePageTree } from '@/lib/stealth/resource-tree';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/rdp-vps',
  title: rdpVpsGuide.title,
  description: rdpVpsGuide.description,
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function RdpVpsPage() {
  const canonical = 'https://www.stealthrdp.com/rdp-vps';
  const toc = articleHeadings(rdpVpsGuide.html).map(heading => ({
    title: heading.text,
    url: `#${heading.id}`,
    depth: heading.level ?? 2,
  }));
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      'url': canonical,
      'name': rdpVpsGuide.title,
      'headline': rdpVpsGuide.h1,
      'description': rdpVpsGuide.description,
      'inLanguage': 'en-US',
      'dateModified': rdpVpsGuide.dateModified,
      'mainEntity': { '@id': `${canonical}#article` },
      'author': {
        '@type': 'Person',
        'name': rdpVpsGuide.author,
        'url': 'https://www.stealthrdp.com/about',
        '@id': 'https://www.stealthrdp.com/about#person',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${canonical}#article`,
      'url': canonical,
      'headline': rdpVpsGuide.h1,
      'description': rdpVpsGuide.description,
      'datePublished': rdpVpsGuide.datePublished,
      'dateModified': rdpVpsGuide.dateModified,
      'inLanguage': 'en-US',
      'wordCount': 1735,
      'mainEntityOfPage': { '@id': canonical },
      'author': {
        '@type': 'Person',
        '@id': 'https://www.stealthrdp.com/about#person',
        'name': rdpVpsGuide.author,
        'url': 'https://www.stealthrdp.com/about',
      },
      'publisher': {
        '@type': 'Organization',
        '@id': 'https://www.stealthrdp.com/#organization',
        'name': 'StealthRDP',
        'url': 'https://www.stealthrdp.com/',
        'logo': { '@type': 'ImageObject', 'url': 'https://cdn.stealthrdp.com/images/new/6.png' },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://www.stealthrdp.com/' },
        { '@type': 'ListItem', 'position': 2, 'name': 'RDP VPS', 'item': canonical },
      ],
    },
  ];

  return (
    <ResourceDocsLayout area="guides" tree={guidePageTree}>
      {jsonLd.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}
      <DocsPage toc={toc} tableOfContent={{ style: 'clerk' }}>
        <DocsTitle>{rdpVpsGuide.h1}</DocsTitle>
        <DocsDescription>{rdpVpsGuide.description}</DocsDescription>
        <div className="sr-docs-article-meta">
          <span>{`Published ${rdpVpsGuide.datePublished}`}</span>
          <span>{rdpVpsGuide.author}</span>
        </div>
        <DocsBody>
          <TrustedArticleBody html={rdpVpsGuide.html} />
        </DocsBody>

        <RelatedArticles
          heading="Keep reading"
          id="related-rdp-title"
          items={[
            {
              href: '/blog/vps-for-remote-desktop.html',
              title: 'VPS for Remote Desktop: What to Check Before You Choose',
              description: 'What affects remote desktop responsiveness and how much CPU and RAM you need.',
            },
            {
              href: '/plans',
              title: 'Current VPS plans',
              description: 'Compare USA and EU plans, operating systems, and availability.',
            },
          ]}
        />
      </DocsPage>
    </ResourceDocsLayout>
  );
}

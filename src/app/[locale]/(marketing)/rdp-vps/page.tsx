import type { Metadata } from 'next';
import Link from 'next/link';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { ResourceDocsLayout } from '@/components/site/ResourceDocsLayout';
import { articleHeadings, TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { rdpVpsGuide } from '@/content/rdp-vps';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';
import { guidePageTree } from '@/lib/stealth/resource-tree';

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
      url: canonical,
      name: rdpVpsGuide.title,
      headline: rdpVpsGuide.h1,
      description: rdpVpsGuide.description,
      inLanguage: 'en-US',
      dateModified: rdpVpsGuide.dateModified,
      mainEntity: { '@id': `${canonical}#article` },
      author: {
        '@type': 'Person',
        name: rdpVpsGuide.author,
        url: 'https://www.stealthrdp.com/about',
        '@id': 'https://www.stealthrdp.com/about#person',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${canonical}#article`,
      url: canonical,
      headline: rdpVpsGuide.h1,
      description: rdpVpsGuide.description,
      datePublished: rdpVpsGuide.datePublished,
      dateModified: rdpVpsGuide.dateModified,
      inLanguage: 'en-US',
      wordCount: 1659,
      mainEntityOfPage: { '@id': canonical },
      author: {
        '@type': 'Person',
        '@id': 'https://www.stealthrdp.com/about#person',
        name: rdpVpsGuide.author,
        url: 'https://www.stealthrdp.com/about',
      },
      publisher: {
        '@type': 'Organization',
        '@id': 'https://www.stealthrdp.com/#organization',
        name: 'StealthRDP',
        url: 'https://www.stealthrdp.com/',
        logo: { '@type': 'ImageObject', url: 'https://cdn.stealthrdp.com/images/new/6.png' },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.stealthrdp.com/' },
        { '@type': 'ListItem', position: 2, name: 'RDP VPS', item: canonical },
      ],
    },
  ];

  return (
    <ResourceDocsLayout tree={guidePageTree}>
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
        <p className="sr-docs-updated">
          Published {rdpVpsGuide.datePublished} <span>·</span> {rdpVpsGuide.author}
        </p>
        <DocsBody>
          <TrustedArticleBody html={rdpVpsGuide.html} />
          <nav className="srv-docs-pagination" aria-label="RDP VPS guide actions">
            <Link href="/plans">
              <span>Compare</span>
              <strong>← Current VPS plans</strong>
            </Link>
            <Link href="/blog/vps-for-remote-desktop.html">
              <span>Related guide</span>
              <strong>VPS for Remote Desktop →</strong>
            </Link>
          </nav>
        </DocsBody>
      </DocsPage>
    </ResourceDocsLayout>
  );
}

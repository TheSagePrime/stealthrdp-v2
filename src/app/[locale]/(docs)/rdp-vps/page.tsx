import type { Metadata } from 'next';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { DocsMeta, DocsPageActions, DocsRelated } from '@/components/site/docs/DocsParts';
import { headingToc, TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { rdpVpsGuide } from '@/content/rdp-vps';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
import { formatUpdated, pageUpdated } from '@/lib/stealth/page-dates';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/rdp-vps',
  title: rdpVpsGuide.title,
  description: rdpVpsGuide.description,
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default async function RdpVpsPage() {
  await requirePageLocale('/rdp-vps');
  const canonical = 'https://www.stealthrdp.com/rdp-vps';
  const dateModified = pageUpdated('/rdp-vps') ?? rdpVpsGuide.datePublished;
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
      dateModified,
      'mainEntity': { '@id': `${canonical}#article` },
      'author': {
        '@type': 'Organization',
        'name': rdpVpsGuide.author,
        'url': 'https://www.stealthrdp.com/about',
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
      dateModified,
      'inLanguage': 'en-US',
      'wordCount': 1735,
      'mainEntityOfPage': { '@id': canonical },
      'author': {
        '@type': 'Organization',
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
    <DocsPage toc={headingToc(rdpVpsGuide.html)}>
      {jsonLd.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}
      <DocsTitle>{rdpVpsGuide.h1}</DocsTitle>
      <DocsDescription>{rdpVpsGuide.description}</DocsDescription>
      <DocsPageActions markdownPath="/docs-md/rdp-vps" pageUrl={canonical} />
      <DocsMeta>
        <span>{`Published ${formatUpdated(rdpVpsGuide.datePublished)}`}</span>
        {dateModified > rdpVpsGuide.datePublished ? <span>{`Updated ${formatUpdated(dateModified)}`}</span> : null}
        <span>{rdpVpsGuide.author}</span>
      </DocsMeta>
      <DocsBody>
        <TrustedArticleBody html={rdpVpsGuide.html} />
      </DocsBody>
      <DocsRelated
        heading="Keep reading"
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
  );
}

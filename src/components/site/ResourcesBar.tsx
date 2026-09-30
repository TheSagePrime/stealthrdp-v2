/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { ResourceSearchItem } from '@/components/site/ResourceSearch';
import Link from 'next/link';
import { ResourceSearch } from '@/components/site/ResourceSearch';
import {
  articlePath,
  blogArticles,
  citadelDocsArticles,
  docPublicSlug,
  faqs,
  helpDocsArticles,
} from '@/lib/stealth/content';

export type ResourceArea = 'resources' | 'guides' | 'help' | 'citadel' | 'faq';

const tabs: { label: string; href: string; key: ResourceArea }[] = [
  { label: 'Resources', href: '/resources', key: 'resources' },
  { label: 'Guides', href: '/blog', key: 'guides' },
  { label: 'Help Center', href: '/docs', key: 'help' },
  { label: 'Citadel Docs', href: '/citadel/docs', key: 'citadel' },
  { label: 'Common Questions', href: '/faq', key: 'faq' },
];

export function ResourcesBar({ active = 'help' }: { active?: ResourceArea }) {
  const items: ResourceSearchItem[] = [
    ...blogArticles.map(article => ({
      title: article.title,
      href: articlePath(article),
      description: article.excerpt,
      kind: 'Guide' as const,
    })),
    ...helpDocsArticles.map(article => ({
      title: article.title,
      href: `/docs/${docPublicSlug(article)}`,
      description: article.summary,
      kind: 'Help' as const,
    })),
    ...citadelDocsArticles.map(article => ({
      title: article.title,
      href: `/citadel/docs/${docPublicSlug(article).replace(/^citadel-/, '')}`,
      description: article.summary,
      searchText: `Citadel Layer 7 DDoS protection ${article.content}`,
      kind: 'Citadel' as const,
    })),
    ...faqs.map(item => ({
      title: item.question,
      href: `/faq#faq-${item._id}`,
      description: item.answer,
      kind: 'Question' as const,
    })),
  ];

  return (
    <div className="sr-res-bar">
      <div className="sr-container sr-res-bar-inner">
        <nav className="sr-res-tabs" aria-label="Resource sections">
          {tabs.map(tab => (
            <Link
              key={tab.key}
              href={tab.href}
              data-active={active === tab.key}
              aria-current={active === tab.key ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <ResourceSearch
          items={items}
          placeholder="Search guides, help, Citadel and questions…"
        />
      </div>
    </div>
  );
}

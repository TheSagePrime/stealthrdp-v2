import Link from 'next/link';
import {
  BookOpenText,
  Lifebuoy,
  Question,
  SquaresFour,
} from '@phosphor-icons/react/dist/ssr';
import { ResourceSearch, type ResourceSearchItem } from '@/components/site/ResourceSearch';
import {
  articlePath,
  blogArticles,
  docPublicSlug,
  docsArticles,
  faqs,
} from '@/lib/stealth/content';

export type ResourceArea = 'resources' | 'guides' | 'help' | 'faq';

const tabs = [
  { label: 'Resources', href: '/resources', key: 'resources', icon: SquaresFour },
  { label: 'Guides', href: '/blog', key: 'guides', icon: BookOpenText },
  { label: 'Help Center', href: '/docs', key: 'help', icon: Lifebuoy },
  { label: 'Common Questions', href: '/faq', key: 'faq', icon: Question },
] as const;

export function HelpTopbar({ active = 'help' }: { active?: ResourceArea }) {
  const items: ResourceSearchItem[] = [
    ...blogArticles.map(article => ({
      title: article.title,
      href: articlePath(article),
      description: article.excerpt,
      kind: 'Guide' as const,
    })),
    ...docsArticles.map(article => ({
      title: article.title,
      href: `/docs/${docPublicSlug(article)}`,
      description: article.summary,
      kind: 'Help' as const,
    })),
    ...faqs.map(item => ({
      title: item.question,
      href: `/faq#faq-${item._id}`,
      description: item.answer,
      kind: 'Question' as const,
    })),
  ];

  return (
    <div className="srv-help-topbar">
      <div className="sr-container srv-help-topbar-inner">
        <Link href="/resources" className="srv-help-brand" aria-label="StealthRDP Resources">
          <img
            src="https://cdn.stealthrdp.com/images/new/6.png"
            alt="StealthRDP"
            width="700"
            height="170"
          />
          <span>Resources</span>
        </Link>

        <ResourceSearch
          items={items}
          placeholder="Search guides, help and questions…"
        />

        <div className="srv-help-topbar-actions">
          <Link href="/status">Status</Link>
          <a href="https://dash.stealthrdp.com/submitticket.php">Support ↗</a>
          <Link href="/plans" className="srv-resource-order-link">View plans</Link>
        </div>
      </div>

      <nav className="sr-container srv-resource-tabs" aria-label="Resource sections">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = active === tab.key;

          return (
            <Link
              key={tab.key}
              href={tab.href}
              data-active={isActive}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={14} weight={isActive ? 'fill' : 'regular'} aria-hidden="true" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

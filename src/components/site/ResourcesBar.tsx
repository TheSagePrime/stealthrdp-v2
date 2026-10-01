/* eslint-disable better-tailwindcss/no-unknown-classes */
import Link from 'next/link';
import { ResourceSearch } from '@/components/site/ResourceSearch';

export type ResourceArea = 'resources' | 'guides' | 'help' | 'citadel' | 'faq';

const tabs: { label: string; href: string; key: ResourceArea }[] = [
  { label: 'Resources', href: '/resources', key: 'resources' },
  { label: 'Guides', href: '/blog', key: 'guides' },
  { label: 'Help Center', href: '/docs', key: 'help' },
  { label: 'Citadel Docs', href: '/citadel/docs', key: 'citadel' },
  { label: 'Common Questions', href: '/faq', key: 'faq' },
];

export function ResourcesBar({ active = 'help' }: { active?: ResourceArea }) {
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

        <ResourceSearch placeholder="Search guides, help, Citadel and questions…" />
      </div>
    </div>
  );
}

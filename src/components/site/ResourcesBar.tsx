/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { SiteLocale } from '@/config/i18n';
import Link from 'next/link';
import { ResourceSearch } from '@/components/site/ResourceSearch';
import { isRouteLocalized } from '@/config/i18n';
import { resourcesCopy } from '@/content/i18n/resources';
import { localeHref } from '@/lib/stealth/i18n';

export type ResourceArea = 'resources' | 'guides' | 'help' | 'citadel' | 'faq';

const tabs: { href: string; key: ResourceArea }[] = [
  { href: '/resources', key: 'resources' },
  { href: '/blog', key: 'guides' },
  { href: '/docs', key: 'help' },
  { href: '/citadel/docs', key: 'citadel' },
  { href: '/faq', key: 'faq' },
];

export function ResourcesBar({ active = 'help', locale = 'en' }: { active?: ResourceArea; locale?: SiteLocale }) {
  const t = resourcesCopy[locale];
  return (
    <div className="sr-res-bar">
      <div className="sr-container sr-res-bar-inner">
        <nav className="sr-res-tabs" aria-label={t.sectionsLabel}>
          {tabs.map(tab => (
            <Link
              key={tab.key}
              href={localeHref(tab.href, locale)}
              hrefLang={isRouteLocalized(tab.href, locale) ? undefined : 'en'}
              data-active={active === tab.key}
              aria-current={active === tab.key ? 'page' : undefined}
            >
              {t.tabs[tab.key]}
            </Link>
          ))}
        </nav>

        <ResourceSearch words={t.search} />
      </div>
    </div>
  );
}

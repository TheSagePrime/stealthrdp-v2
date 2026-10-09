import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import type { ReactNode } from 'react';
import type { SiteLocale } from '@/config/i18n';
import type { citadelPageTree, guidePageTree, productDocsPageTree, resourcesPageTree } from '@/lib/stealth/resource-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { resourcesCopy } from '@/content/i18n/resources';
import { localeHref } from '@/lib/stealth/i18n';

type ResourceTree
  = | typeof citadelPageTree
    | typeof guidePageTree
    | typeof productDocsPageTree
    | typeof resourcesPageTree;

/* The resource areas, as fumadocs layout tabs above the sidebar. */
const areas = [
  { href: '/resources', key: 'resources' },
  { href: '/blog', key: 'guides' },
  { href: '/docs', key: 'help' },
  { href: '/citadel/docs', key: 'citadel' },
  { href: '/faq', key: 'faq' },
] as const;

export function ResourceDocsLayout({
  children,
  locale = 'en',
  tree,
}: {
  children: ReactNode;
  locale?: SiteLocale;
  tree: ResourceTree;
}) {
  const t = resourcesCopy[locale];
  const tabs: LayoutTab[] = areas.map(area => ({ title: t.tabs[area.key], url: localeHref(area.href, locale) }));

  return (
    <DocsLayout
      tree={tree}
      tabs={tabs}
      nav={{ enabled: false }}
      searchToggle={{ enabled: false }}
      themeSwitch={{ enabled: false }}
      sidebar={{ defaultOpenLevel: 1, prefetch: false }}
    >
      {children}
    </DocsLayout>
  );
}

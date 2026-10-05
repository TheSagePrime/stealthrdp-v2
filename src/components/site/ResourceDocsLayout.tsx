import type { ReactNode } from 'react';
import type { ResourceArea } from '@/components/site/ResourcesBar';
import type { SiteLocale } from '@/config/i18n';
import type { citadelPageTree, guidePageTree, productDocsPageTree, resourcesPageTree } from '@/lib/stealth/resource-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { ResourcesBar } from '@/components/site/ResourcesBar';

type ResourceTree
  = | typeof citadelPageTree
    | typeof guidePageTree
    | typeof productDocsPageTree
    | typeof resourcesPageTree;

export function ResourceDocsLayout({
  area,
  children,
  locale = 'en',
  tree,
}: {
  area: ResourceArea;
  children: ReactNode;
  locale?: SiteLocale;
  tree: ResourceTree;
}) {
  return (
    <>
      <ResourcesBar active={area} locale={locale} />
      <DocsLayout
        tree={tree}
        nav={{ enabled: false, title: <span className="sr-only">StealthRDP home</span> }}
        searchToggle={{ enabled: false }}
        themeSwitch={{ enabled: false }}
        sidebar={{ defaultOpenLevel: 1, prefetch: false }}
      >
        {children}
      </DocsLayout>
    </>
  );
}

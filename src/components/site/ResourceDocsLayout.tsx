import type { ReactNode } from 'react';
import type { ResourceArea } from '@/components/site/ResourcesBar';
import type { citadelPageTree, guidePageTree, productDocsPageTree } from '@/lib/stealth/resource-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { ResourcesBar } from '@/components/site/ResourcesBar';

type ResourceTree = typeof citadelPageTree | typeof guidePageTree | typeof productDocsPageTree;

export function ResourceDocsLayout({
  area,
  children,
  tree,
}: {
  area: ResourceArea;
  children: ReactNode;
  tree: ResourceTree;
}) {
  return (
    <>
      <ResourcesBar active={area} />
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

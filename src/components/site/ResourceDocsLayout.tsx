import type { ReactNode } from 'react';
import type { guidePageTree, productDocsPageTree } from '@/lib/stealth/resource-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';

type ResourceTree = typeof guidePageTree | typeof productDocsPageTree;

export function ResourceDocsLayout({ children, tree }: { children: ReactNode; tree: ResourceTree }) {
  return (
    <DocsLayout
      tree={tree}
      nav={{ enabled: false, title: <span className="sr-only">StealthRDP home</span> }}
      searchToggle={{ enabled: false }}
      themeSwitch={{ enabled: false }}
      sidebar={{ defaultOpenLevel: 1, prefetch: false }}
    >
      {children}
    </DocsLayout>
  );
}

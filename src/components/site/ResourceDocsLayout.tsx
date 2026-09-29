import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { guidePageTree, productDocsPageTree } from '@/lib/stealth/resource-tree';

type ResourceTree = typeof guidePageTree | typeof productDocsPageTree;

export function ResourceDocsLayout({ children, tree }: { children: ReactNode; tree: ResourceTree }) {
  return (
    <DocsLayout
      tree={tree}
      nav={{ enabled: false }}
      searchToggle={{ enabled: false }}
      themeSwitch={{ enabled: false }}
      sidebar={{ defaultOpenLevel: 1, prefetch: false }}
    >
      {children}
    </DocsLayout>
  );
}

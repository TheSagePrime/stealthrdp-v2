import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { resourcePageTree } from '@/lib/stealth/resource-tree';

export function ResourceDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={resourcePageTree}
      nav={{ enabled: false, title: <span className="sr-only">StealthRDP home</span> }}
      searchToggle={{ enabled: false }}
      themeSwitch={{ enabled: false }}
      sidebar={{ defaultOpenLevel: 1, prefetch: false }}
    >
      {children}
    </DocsLayout>
  );
}

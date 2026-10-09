import type { ReactNode } from 'react';
import { ResourceDocsLayout } from '@/components/site/ResourceDocsLayout';
import { resourcesPageTree } from '@/lib/stealth/resource-tree';

export default function ResourcesLayoutRoute({ children }: { children: ReactNode }) {
  return <ResourceDocsLayout tree={resourcesPageTree}>{children}</ResourceDocsLayout>;
}

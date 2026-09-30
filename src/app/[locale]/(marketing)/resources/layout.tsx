import type { ReactNode } from 'react';
import { ResourceDocsLayout } from '@/components/site/ResourceDocsLayout';
import { resourcesPageTree } from '@/lib/stealth/resource-tree';

export default function ResourcesLayoutRoute({ children }: { children: ReactNode }) {
  return <ResourceDocsLayout area="resources" tree={resourcesPageTree}>{children}</ResourceDocsLayout>;
}

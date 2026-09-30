import type { ReactNode } from 'react';
import { ResourceDocsLayout } from '@/components/site/ResourceDocsLayout';
import { resourcesPageTree } from '@/lib/stealth/resource-tree';

export default function FaqLayoutRoute({ children }: { children: ReactNode }) {
  return <ResourceDocsLayout area="faq" tree={resourcesPageTree}>{children}</ResourceDocsLayout>;
}

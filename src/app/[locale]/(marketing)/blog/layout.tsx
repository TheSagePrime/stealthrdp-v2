import type { ReactNode } from 'react';
import { ResourceDocsLayout } from '@/components/site/ResourceDocsLayout';
import { guidePageTree } from '@/lib/stealth/resource-tree';

export default function BlogLayoutRoute({ children }: { children: ReactNode }) {
  return <ResourceDocsLayout tree={guidePageTree}>{children}</ResourceDocsLayout>;
}

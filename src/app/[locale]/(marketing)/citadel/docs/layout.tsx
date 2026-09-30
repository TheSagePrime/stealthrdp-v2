import type { ReactNode } from 'react';
import { ResourceDocsLayout } from '@/components/site/ResourceDocsLayout';
import { citadelPageTree } from '@/lib/stealth/resource-tree';

export default function CitadelDocsLayoutRoute({ children }: { children: ReactNode }) {
  return <ResourceDocsLayout area="citadel" tree={citadelPageTree}>{children}</ResourceDocsLayout>;
}

import type { ReactNode } from 'react';
import { ResourceDocsLayout } from '@/components/site/ResourceDocsLayout';
import { productDocsPageTree } from '@/lib/stealth/resource-tree';

export default function DocsLayoutRoute({ children }: { children: ReactNode }) {
  return <ResourceDocsLayout tree={productDocsPageTree}>{children}</ResourceDocsLayout>;
}

import type { ReactNode } from 'react';
import { ResourceDocsLayout } from '@/components/site/ResourceDocsLayout';

export default function BlogLayoutRoute({ children }: { children: ReactNode }) {
  return <ResourceDocsLayout>{children}</ResourceDocsLayout>;
}

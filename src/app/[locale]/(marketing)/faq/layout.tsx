import type { ReactNode } from 'react';
import { ResourceDocsLayout } from '@/components/site/ResourceDocsLayout';
import { pageLocale } from '@/lib/stealth/i18n-server';
import { resourcesTree } from '@/lib/stealth/resource-tree';

export default async function FaqLayoutRoute({ children }: { children: ReactNode }) {
  const locale = await pageLocale();
  return <ResourceDocsLayout locale={locale} tree={resourcesTree(locale)}>{children}</ResourceDocsLayout>;
}

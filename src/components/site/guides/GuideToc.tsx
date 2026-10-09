'use client';

import type { TOCItemType } from 'fumadocs-core/toc';
import { TOCProvider, TOCScrollArea } from 'fumadocs-ui/components/toc';
import { TOCItem, TOCItems } from 'fumadocs-ui/components/toc/clerk';

/* The Fumadocs "On this page" list with the active-heading indicator, for guide articles. */
export function GuideToc({ items, label }: { items: TOCItemType[]; label: string }) {
  return (
    <TOCProvider toc={items}>
      <nav
        aria-label={label}
        className="sticky top-24 flex max-h-[calc(100dvh-8rem)] flex-col"
      >
        <p className="mb-3 text-sm font-medium text-fd-muted-foreground">{label}</p>
        <TOCScrollArea>
          <TOCItems>
            {items.map(item => <TOCItem key={item.url} item={item} />)}
          </TOCItems>
        </TOCScrollArea>
      </nav>
    </TOCProvider>
  );
}

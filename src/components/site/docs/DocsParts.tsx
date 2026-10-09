import { CalendarBlank, FolderSimple } from '@phosphor-icons/react/dist/ssr';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Button } from '@/components/ui/button';

/* Small pieces shared by the docs and guide pages, built on Fumadocs components so they read
   as part of the docs, not as a second design system. */

export function DocsArticleMeta({ updated, section }: { updated: string; section?: string }) {
  return (
    <div className="
      flex flex-wrap items-center gap-x-5 gap-y-1 border-b pb-5 text-sm
      text-fd-muted-foreground
    "
    >
      <span className="inline-flex items-center gap-1.5">
        <CalendarBlank aria-hidden="true" className="size-4" />
        {updated}
      </span>
      {section
        ? (
            <span className="inline-flex items-center gap-1.5">
              <FolderSimple aria-hidden="true" className="size-4" />
              {section}
            </span>
          )
        : null}
    </div>
  );
}

export type DocsLink = { href: string; title: string; description: string };

export function DocsRelated({ heading, items }: { heading: string; items: DocsLink[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <section className="mt-10" aria-label={heading}>
      <h2 className="mb-4 text-lg font-semibold">{heading}</h2>
      <Cards>
        {items.map(item => (
          <Card key={item.href} href={item.href} title={item.title} description={item.description} />
        ))}
      </Cards>
    </section>
  );
}

export function DocsSupport({
  title,
  text,
  actions,
}: {
  title: string;
  text: string;
  actions: { href: string; label: string }[];
}) {
  return (
    <aside className="
      mt-10 flex flex-col gap-4 rounded-xl border bg-fd-card p-5
      sm:flex-row sm:items-center sm:justify-between
    "
    >
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-fd-muted-foreground">{text}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {actions.map((action, index) => (
          <Button asChild key={action.href} variant={index === 0 ? 'default' : 'outline'}>
            <a href={action.href}>{action.label}</a>
          </Button>
        ))}
      </div>
    </aside>
  );
}

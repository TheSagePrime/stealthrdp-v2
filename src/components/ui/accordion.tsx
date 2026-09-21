import { Plus } from 'lucide-react';
import { cn } from '@/utils/Helpers';

/**
 * Accordion built on native disclosure elements: keyboard support, find-in-page
 * and no JavaScript are free, and the stack stays frozen (no new dependency).
 */
function Accordion({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="accordion" className={cn('grid gap-3', className)} {...props} />;
}

function AccordionItem({
  className,
  title,
  children,
  ...props
}: Omit<React.ComponentProps<'details'>, 'children'> & {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <details
      data-slot="accordion-item"
      className={cn(
        'group rounded-md border border-divider bg-surface-1 px-5',
        className,
      )}
      {...props}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold text-body-text marker:hidden">
        <span>{title}</span>
        <Plus className="size-4 shrink-0 text-body-muted transition-transform group-open:rotate-45" aria-hidden="true" />
      </summary>
      <div className="pb-5 text-body-muted">{children}</div>
    </details>
  );
}

export { Accordion, AccordionItem };

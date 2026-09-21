import { cn } from '@/utils/Helpers';

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        `
          inline-flex min-w-6 items-center justify-center rounded-sm
          border border-border-control bg-surface-2 px-1.5 py-0.5
          font-mono text-micro text-body-muted
        `,
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };

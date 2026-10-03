import { cn } from '@/utils/Helpers';

export function Select({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn(`
        min-h-11 w-full rounded-md border border-input bg-background px-3 py-2
        text-base text-foreground
        focus-visible:outline-2 focus-visible:outline-ring
        disabled:cursor-not-allowed disabled:opacity-50
      `, className)}
      {...props}
    />
  );
}

import { cn } from '@/utils/Helpers';

export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(`
        min-h-24 w-full rounded-md border border-input bg-background px-3 py-2
        text-base text-foreground
        placeholder:text-muted-foreground
        focus-visible:outline-2 focus-visible:outline-ring
        disabled:cursor-not-allowed disabled:opacity-50
      `, className)}
      {...props}
    />
  );
}

import { cn } from '@/utils/Helpers';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        `
          flex min-h-11 w-full rounded-md border border-input bg-background px-3
          py-2 text-base text-foreground
          placeholder:text-muted-foreground
          focus-visible:outline-2 focus-visible:outline-ring
          disabled:cursor-not-allowed disabled:opacity-50
        `,
        className,
      )}
      {...props}
    />
  );
}

export { Input };

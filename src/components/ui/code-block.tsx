import { cn } from '@/utils/Helpers';

/** Command or configuration block. Mono face, hairline frame, real scroll. */
function CodeBlock({
  className,
  children,
  ...props
}: React.ComponentProps<'pre'>) {
  return (
    <pre
      data-slot="code-block"
      tabIndex={0}
      className={cn(
        `
          max-w-full overflow-x-auto overscroll-x-contain rounded-md border
          border-divider bg-surface-1 p-4 font-mono text-mono-sm/relaxed
          text-body-text
        `,
        className,
      )}
      {...props}
    >
      {children}
    </pre>
  );
}

export { CodeBlock };

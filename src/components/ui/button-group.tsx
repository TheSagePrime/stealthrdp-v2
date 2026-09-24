import { cn } from '@/utils/Helpers';

function ButtonGroup({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      className={cn(
        `
          inline-flex w-fit items-stretch
          [&>*:not(:first-child)]:-ml-px
          [&>*:not(:first-child)]:rounded-l-none
          [&>*:not(:last-child)]:rounded-r-none
        `,
        className,
      )}
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="button-group-text"
      className={cn(
        'inline-flex min-h-11 items-center border border-input bg-background px-3 text-small text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupText };

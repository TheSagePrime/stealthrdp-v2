import { cn } from '@/utils/Helpers';

export type PillState = 'ok' | 'warn' | 'bad' | 'unknown' | 'neutral';

/**
 * Status pill. Always an icon plus a label, so state never depends on colour
 * alone (WCAG 1.4.1, DESIGN.md section 10).
 */
function Pill({
  className,
  state = 'neutral',
  icon,
  children,
  ...props
}: React.ComponentProps<'span'> & {
  state?: PillState;
  icon?: React.ReactNode;
}) {
  return (
    <span
      data-slot="pill"
      data-state={state}
      className={cn('sr-pill', className)}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}

export { Pill };

import { cn } from '@/utils/Helpers';

/**
 * Provisioning progress. The numeric value is always exposed as text, so the
 * state does not depend on the bar (DESIGN.md section 10).
 */
function Progress({
  className,
  value = 0,
  max = 100,
  label,
  ...props
}: Omit<React.ComponentProps<'div'>, 'children'> & {
  value?: number;
  max?: number;
  label: string;
}) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percent = max === 0 ? 0 : Math.round((clamped / max) * 100);

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-label={label}
      className={cn('grid gap-2', className)}
      {...props}
    >
      <div className="h-1 w-full overflow-hidden rounded-full bg-surface-3">
        <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
      </div>
      <span className="font-mono text-micro text-body-muted tabular-nums">{`${percent}%`}</span>
    </div>
  );
}

export { Progress };

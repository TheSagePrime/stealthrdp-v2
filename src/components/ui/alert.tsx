import { Warning as AlertTriangle, CheckCircle as CheckCircle2, Info, XCircle } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@/utils/Helpers';

export type AlertTone = 'info' | 'ok' | 'warn' | 'bad';

const toneIcon = {
  info: Info,
  ok: CheckCircle2,
  warn: AlertTriangle,
  bad: XCircle,
} as const;

const toneRing = {
  info: 'text-body-muted',
  ok: 'text-status-ok',
  warn: 'text-status-warn',
  bad: 'text-status-bad',
} as const;

/** Alert. Icon plus text; the tone colour is never the only signal. */
function Alert({
  className,
  tone = 'info',
  children,
  ...props
}: React.ComponentProps<'div'> & { tone?: AlertTone }) {
  const Icon = toneIcon[tone];

  return (
    <div
      data-slot="alert"
      role={tone === 'bad' || tone === 'warn' ? 'alert' : 'status'}
      className={cn(
        `
          flex items-start gap-3 rounded-md border border-divider
          bg-surface-1 px-4 py-3 text-small text-body-text
        `,
        className,
      )}
      {...props}
    >
      <Icon className={cn('mt-0.5 size-4 shrink-0', toneRing[tone])} aria-hidden="true" />
      <div className="grid gap-1">{children}</div>
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('font-semibold', className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-body-muted', className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };

// DashboardBlocks (MIT), copied from its official registry. See THIRD_PARTY_NOTICES.md.
'use client';

import type { KeyboardEvent, PointerEvent } from 'react';
import { CheckCircle, CircleDashed, Warning, WarningOctagon, Wrench, XCircle } from '@phosphor-icons/react';
import { useRef, useState } from 'react';

import { cn } from '@/utils/Helpers';

type StatusLevel = 'operational' | 'degraded' | 'partial' | 'major' | 'maintenance' | 'unknown';

type StatusConfig = {
  /** Solid fill for dots and uptime bars. */
  fill: string;
  icon: React.ReactNode;
  label: string;
  /** Tinted background with readable foreground, for badges. */
  soft: string;
  /** Readable foreground on the card surface. */
  text: string;
};

/** Reserved status colors. Always shown with an icon or label, never color alone. */
const statusConfig: Record<StatusLevel, StatusConfig> = {
  operational: {
    fill: 'bg-[var(--uptime-up)]',
    icon: <CheckCircle aria-hidden />,
    label: 'Operational',
    soft: 'bg-muted text-foreground',
    text: 'text-foreground',
  },
  degraded: {
    fill: 'bg-[var(--uptime-degraded)]',
    icon: <Warning aria-hidden />,
    label: 'Degraded performance',
    soft: 'bg-muted text-foreground',
    text: 'text-foreground',
  },
  partial: {
    fill: 'bg-[var(--uptime-degraded)]',
    icon: <WarningOctagon aria-hidden />,
    label: 'Partial outage',
    soft: 'bg-muted text-foreground',
    text: 'text-foreground',
  },
  major: {
    fill: 'bg-[var(--uptime-down)]',
    icon: <XCircle aria-hidden />,
    label: 'Major outage',
    soft: 'bg-muted text-foreground',
    text: 'text-foreground',
  },
  maintenance: {
    fill: 'bg-primary',
    icon: <Wrench aria-hidden />,
    label: 'Maintenance',
    soft: 'bg-muted text-foreground',
    text: 'text-foreground',
  },
  unknown: {
    fill: 'bg-muted-foreground/25',
    icon: <CircleDashed aria-hidden />,
    label: 'No data',
    soft: 'bg-muted text-muted-foreground',
    text: 'text-muted-foreground',
  },
};

type StatusIndicatorProps = {
  className?: string;
  /** Hide the label visually but keep it for assistive technology. */
  hideLabel?: boolean;
  label?: string;
  status: StatusLevel;
};

/** A status dot with its label. */
function StatusIndicator({ className, hideLabel = false, label, status }: StatusIndicatorProps) {
  const config = statusConfig[status];
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm', config.text, className)}>
      <span aria-hidden className={cn('size-2 shrink-0 rounded-full', config.fill)} />
      <span className={cn(hideLabel && 'sr-only')}>{label ?? config.label}</span>
    </span>
  );
}

type StatusBadgeProps = {
  className?: string;
  label?: string;
  status: StatusLevel;
};

/** A tinted pill with the status icon and label. */
function StatusBadge({ className, label, status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        `
          inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs
          font-medium whitespace-nowrap
          [&_svg]:size-3.5 [&_svg]:shrink-0
        `,
        config.soft,
        className,
      )}
    >
      {config.icon}
      {label ?? config.label}
    </span>
  );
}

type StatusLegendProps = {
  className?: string;
  statuses: StatusLevel[];
};

function StatusLegend({ className, statuses }: StatusLegendProps) {
  return (
    <ul className={cn(`
      flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground
    `, className)}
    >
      {statuses.map(status => (
        <li key={status} className="flex items-center gap-1.5">
          <span aria-hidden className={cn('h-2.5 w-1 rounded-sm', statusConfig[status].fill)} />
          {statusConfig[status].label}
        </li>
      ))}
    </ul>
  );
}

type UptimeDay = {
  label: string;
  note?: string;
  status: StatusLevel;
  /** Share of the day the service was up, 0–100. */
  uptime?: number;
};

/** Truncates rather than rounds, so any downtime never displays as 100%. */
function formatUptime(value: number) {
  if (value >= 100) {
    return '100%';
  }
  return `${(Math.floor(value * 100) / 100).toFixed(2)}%`;
}

function describeDay(day: UptimeDay | undefined) {
  if (!day) {
    return '';
  }
  const parts = [day.label, statusConfig[day.status].label];
  if (day.uptime !== undefined && day.status !== 'unknown') {
    parts.push(`${formatUptime(day.uptime)} uptime`);
  }
  if (day.note) {
    parts.push(day.note);
  }
  return parts.join(', ');
}

type UptimeBarProps = {
  className?: string;
  days: UptimeDay[];
  /** Names the service for assistive technology. */
  label: string;
};

/**
 * One bar per day, colored by status. Hover or use the arrow keys to read a day.
 */
function UptimeBar({ className, days, label }: UptimeBarProps) {
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const last = days.length - 1;
  const activeDay = active === null ? undefined : days[active];

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || days.length === 0) {
      return;
    }
    const ratio = (event.clientX - rect.left) / rect.width;
    setActive(Math.min(last, Math.max(0, Math.floor(ratio * days.length))));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = active ?? last;
    const next
      = event.key === 'ArrowLeft'
        ? current - 1
        : event.key === 'ArrowRight'
          ? current + 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (next === null) {
      return;
    }
    event.preventDefault();
    setActive(Math.min(last, Math.max(0, next)));
  };

  const position = active === null ? 0 : ((active + 0.5) / days.length) * 100;
  const align = position < 15 ? 'start' : position > 85 ? 'end' : 'center';

  if (days.length === 0) {
    return null;
  }

  return (
    <div className={cn('@container relative', className)}>
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label={`${label}, daily status`}
        aria-orientation="horizontal"
        aria-valuemax={days.length}
        aria-valuemin={1}
        aria-valuenow={(active ?? last) + 1}
        aria-valuetext={describeDay(days[active ?? last])}
        className="
          flex h-8 cursor-default gap-px rounded-sm outline-none
          focus-visible:ring-[3px] focus-visible:ring-ring/50
          @md:gap-0.5
        "
        onBlur={() => setActive(null)}
        onFocus={() => setActive(value => value ?? last)}
        onKeyDown={onKeyDown}
        onPointerLeave={() => setActive(null)}
        onPointerMove={onPointerMove}
      >
        {days.map((day, index) => (
          <span
            key={day.label}
            aria-hidden
            className={cn(
              'h-full min-w-0 flex-1 rounded-sm transition-opacity duration-150',
              statusConfig[day.status].fill,
              active !== null && active !== index && 'opacity-50',
            )}
          />
        ))}
      </div>
      {activeDay && (
        <div
          aria-hidden
          className={cn(
            `
              pointer-events-none absolute bottom-full z-10 mb-2 grid w-max
              max-w-56 gap-1 rounded-lg bg-popover px-3 py-2 text-xs
              text-popover-foreground shadow-md ring-1 ring-foreground/10
            `,
            align === 'center' && '-translate-x-1/2',
            align === 'end' && '-translate-x-full',
          )}
          style={{ left: `${position}%` }}
        >
          <span className="text-muted-foreground">{activeDay.label}</span>
          <StatusIndicator className="text-xs font-medium" status={activeDay.status} />
          {activeDay.uptime !== undefined && activeDay.status !== 'unknown' && (
            <span className="tabular-nums">
              {formatUptime(activeDay.uptime)}
              {' '}
              uptime
            </span>
          )}
          {activeDay.note && <span className="text-muted-foreground">{activeDay.note}</span>}
        </div>
      )}
    </div>
  );
}

export { StatusBadge, StatusLegend, UptimeBar };

export type { StatusLevel, UptimeDay };

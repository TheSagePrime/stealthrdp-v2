'use client';

import type { SiteLocale } from '@/config/i18n';
import type { UptimeDay as ReportUptimeDay } from '@/lib/stealth/uptime';
import { cn } from '@/utils/Helpers';
import { statusCopy } from '@/content/i18n/status';
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

type DayStatus = 'operational' | 'degraded' | 'partial' | 'major' | 'unknown';

type BarDay = ReportUptimeDay & { label: string; status: DayStatus };

const fill: Record<DayStatus, string> = {
  operational: 'var(--uptime-up)',
  degraded: 'color-mix(in srgb, var(--uptime-up) 50%, var(--surface-1))',
  partial: 'var(--uptime-degraded)',
  major: 'var(--uptime-down)',
  unknown: 'var(--uptime-none)',
};

function percent(value: number, locale: SiteLocale): string {
  const t = statusCopy[locale].board;
  return t.percent(value.toFixed(3).replace('.', t.decimal));
}

function status(ratio: number | null): DayStatus {
  if (ratio === null) return 'unknown';
  if (ratio >= 100) return 'operational';
  if (ratio >= 99) return 'degraded';
  if (ratio >= 95) return 'partial';
  return 'major';
}

/**
 * DashboardBlocks' status-02 Uptime Bars interaction, adapted to our UTC UptimeRobot data.
 * Source: https://www.dashboardblocks.com/docs/components/status
 * License notice: THIRD_PARTY_NOTICES.md
 */
export function DashboardBlocksUptimeBar({ days, locale, name }: {
  days: ReportUptimeDay[];
  locale: SiteLocale;
  name: string;
}) {
  const t = statusCopy[locale].board;
  const items: BarDay[] = days.map((day) => {
    const date = new Date(`${day.date}T00:00:00Z`);
    return {
      ...day,
      label: t.day(date.getUTCDate(), t.months[date.getUTCMonth()] ?? '', date.getUTCFullYear()),
      status: status(day.ratio),
    };
  });
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const last = items.length - 1;
  const latestDay = days[days.length - 1];
  const activeDay = active === null ? undefined : items[active];

  const describe = (day: BarDay | undefined) => {
    if (!day) return '';
    return day.ratio === null
      ? t.noRecords(day.label)
      : `${day.label}: ${percent(day.ratio, locale)}`;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || items.length === 0) return;
    const ratio = (event.clientX - rect.left) / rect.width;
    setActive(Math.min(last, Math.max(0, Math.floor(ratio * items.length))));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = active ?? last;
    const next = event.key === 'ArrowLeft'
      ? current - 1
      : event.key === 'ArrowRight'
        ? current + 1
        : event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? last
            : null;
    if (next === null) return;
    event.preventDefault();
    setActive(Math.min(last, Math.max(0, next)));
  };

  const position = active === null ? 0 : ((active + 0.5) / items.length) * 100;
  const align = position < 15 ? 'start' : position > 85 ? 'end' : 'center';

  if (items.length === 0) return null;

  return (
    <div className="@container relative">
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label={`${name}, ${t.historyBars}`}
        aria-orientation="horizontal"
        aria-valuemax={items.length}
        aria-valuemin={1}
        aria-valuenow={(active ?? last) + 1}
        aria-valuetext={describe(items[active ?? last])}
        className="focus-visible:ring-ring/50 flex h-8 cursor-default gap-px rounded-[3px] outline-none focus-visible:ring-[3px] @md:gap-[2px]"
        onBlur={() => setActive(null)}
        onFocus={() => setActive(value => value ?? last)}
        onKeyDown={onKeyDown}
        onPointerLeave={() => setActive(null)}
        onPointerMove={onPointerMove}
      >
        {items.map((day, index) => (
          <span
            key={day.date}
            aria-hidden
            className={cn(
              'h-full min-w-0 flex-1 rounded-[2px] transition-opacity duration-150',
              active !== null && active !== index && 'opacity-50',
            )}
            style={{ backgroundColor: fill[day.status] }}
          />
        ))}
      </div>
      {activeDay && (
        <div
          aria-hidden
          className={cn(
            'bg-popover text-popover-foreground pointer-events-none absolute bottom-full z-10 mb-2 grid w-max max-w-56 gap-1 rounded-lg px-3 py-2 text-xs shadow-md ring-1 ring-foreground/10',
            align === 'center' && '-translate-x-1/2',
            align === 'end' && '-translate-x-full',
          )}
          style={{ left: `${position}%` }}
        >
          <span className="text-muted-foreground">{activeDay.label}</span>
          <span className="tabular-nums">
            {activeDay.ratio === null
              ? t.legend[4]
              : `${percent(activeDay.ratio, locale)} ${t.historyUptimeLabel}`}
          </span>
        </div>
      )}
      <div className="text-muted-foreground mt-2 flex justify-between text-xs">
        <span>{t.daysAgo(items.length)}</span>
        {latestDay && latestDay.ratio !== null && (
          <span className="text-foreground font-medium">
            {percent(latestDay.ratio, locale)} {t.historyUptimeLabel}
          </span>
        )}
        <span>{t.today}</span>
      </div>
    </div>
  );
}

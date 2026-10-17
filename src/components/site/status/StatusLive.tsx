'use client';

import type { ReactNode } from 'react';
import type { SiteLocale } from '@/config/i18n';
import { useRouter } from 'next/navigation';
import { createContext, use, useEffect, useState, useTransition } from 'react';
import { statusCopy } from '@/content/i18n/status';

const ClockContext = createContext<number | null>(null);

/** One clock and refresh schedule for the entire board; preserve disclosure/scroll state. */
export function StatusLive({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    const refresh = () => {
      if (document.visibilityState === 'visible') {
        startTransition(() => router.refresh());
      }
    };
    const timer = window.setInterval(refresh, 60_000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(tick);
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [router]);
  return <ClockContext value={now}>{children}</ClockContext>;
}

export function MeasurementTime({ at, locale, updated = false }: { at: string; locale: SiteLocale; updated?: boolean }) {
  const now = use(ClockContext);
  const t = statusCopy[locale].board;
  const seconds = now === null ? null : Math.max(0, Math.floor((now - Date.parse(at)) / 1000));
  const date = new Date(at);
  const absolute = `${t.day(date.getUTCDate(), t.months[date.getUTCMonth()] ?? '', date.getUTCFullYear())}, ${at.slice(11, 19)} UTC`;
  return (
    <span>
      {updated ? `${t.pageUpdated}: ` : ''}
      <time dateTime={at} title={absolute}>{seconds === null ? absolute : t.age(seconds)}</time>
      {updated && <span>{` · ${t.refreshEveryMinute}`}</span>}
      {updated && seconds !== null && seconds > 120 && <span>{` · ${t.staleData}`}</span>}
    </span>
  );
}

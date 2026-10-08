'use client';

import type { SiteLocale } from '@/config/i18n';
import type { UptimeDay } from '@/lib/stealth/uptime';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Tooltip } from '@/components/ui/tooltip';
import { statusCopy } from '@/content/i18n/status';
import styles from './UptimeHistory.module.css';

function level(ratio: number | null): string {
  if (ratio === null) {
    return 'none';
  }
  if (ratio >= 100) {
    return 'up';
  }
  if (ratio >= 99) {
    return 'minor';
  }
  return ratio >= 95 ? 'degraded' : 'down';
}

export function UptimeHistory({ days, locale, name }: { days: UptimeDay[]; locale: SiteLocale; name: string }) {
  const t = statusCopy[locale].board;
  const describe = (day: UptimeDay) => {
    const date = new Date(`${day.date}T00:00:00Z`);
    const dateLabel = t.day(date.getUTCDate(), t.months[date.getUTCMonth()] ?? '', date.getUTCFullYear());
    return day.ratio === null ? t.noRecords(dateLabel) : `${dateLabel}: ${t.percent(day.ratio.toFixed(3).replace('.', t.decimal))}`;
  };
  const months = [...new Set(days.map(day => day.date.slice(0, 7)))];
  const byDate = new Map(days.map(day => [day.date, day]));
  const dayButton = (day: UptimeDay, calendar = false) => (
    <Tooltip key={day.date} label={describe(day)} className={calendar ? styles.calendarTip : styles.barTip}>
      <Button variant="ghost" type="button" className={calendar ? styles.calendarDay : styles.dayBar} data-level={level(day.ratio)} aria-label={describe(day)}>
        {calendar ? Number(day.date.slice(8)) : <span className="sr-only">{day.date}</span>}
      </Button>
    </Tooltip>
  );
  return (
    <div className={styles.history}>
      <Tabs items={[
        { id: 'bars', label: t.historyBars, content: (
          <>
            <div className={styles.bars} aria-label={name}>{days.map(day => dayButton(day))}</div>
            <div className={styles.axis}>
              <span className={styles.wideDate}>{days[0]?.date}</span>
              <span className={styles.narrowDate}>{days.at(-30)?.date ?? days[0]?.date}</span>
              <span>{t.today}</span>
            </div>
          </>
        ) },
        { id: 'calendar', label: t.historyCalendar, content: (
          <div className={styles.months}>
            {months.map((month) => {
              const first = new Date(`${month}-01T00:00:00Z`);
              const offset = (first.getUTCDay() + 6) % 7;
              const length = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
              return (
                <section className={styles.month} key={month} aria-label={`${t.months[first.getUTCMonth()]} ${first.getUTCFullYear()}`}>
                  <h4>{`${t.months[first.getUTCMonth()]} ${first.getUTCFullYear()}`}</h4>
                  <div className={styles.calendarGrid}>
                    {t.weekdays.map(weekday => <span className={styles.weekday} key={weekday}>{weekday}</span>)}
                    {Array.from({ length: offset }, (_, index) => <span key={`blank-${index}`} />)}
                    {Array.from({ length }, (_, index) => {
                      const date = `${month}-${String(index + 1).padStart(2, '0')}`;
                      const day = byDate.get(date);
                      return day ? dayButton(day, true) : <span className={styles.outsideDay} key={date}>{index + 1}</span>;
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) },
      ]}
      />
    </div>
  );
}

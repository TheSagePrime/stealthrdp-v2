'use client';
/* eslint-disable better-tailwindcss/no-unknown-classes */

import type { ReactNode } from 'react';
import type { PillState } from '@/components/ui/pill';
import {
  CheckCircle,
  ClockCountdown,
  Pulse,
  Question,
  Warning,
  XCircle,
} from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill } from '@/components/ui/pill';
import { groupName, groupOrder } from './status/status-groups';
import { StatusFleet } from './status/StatusFleet';

type Monitor = {
  label: string;
  region: string;
  status: string;
  uptimeRatio: number | null;
};

type StatusPayload = {
  stat: string;
  checkedAt?: string | null;
  monitors: Monitor[];
};

function stateLabel(status: string): string {
  if (status === 'up') {
    return 'Operational';
  }
  if (status === 'degraded') {
    return 'Degraded';
  }
  if (status === 'down') {
    return 'Down';
  }
  if (status === 'paused') {
    return 'Paused';
  }
  return 'Unknown';
}

function pillState(status: string): PillState {
  if (status === 'up') {
    return 'ok';
  }
  if (status === 'degraded') {
    return 'warn';
  }
  if (status === 'down') {
    return 'bad';
  }
  if (status === 'paused') {
    return 'unknown';
  }
  return 'neutral';
}

function pillIcon(status: string) {
  if (status === 'up') {
    return <CheckCircle size={15} weight="fill" aria-hidden="true" />;
  }
  if (status === 'degraded') {
    return <Warning size={15} weight="fill" aria-hidden="true" />;
  }
  if (status === 'down') {
    return <XCircle size={15} weight="fill" aria-hidden="true" />;
  }
  return <Question size={15} weight="fill" aria-hidden="true" />;
}

/* Downtime that a 90-day uptime ratio allows, as a rough human figure. */
function downtime(ratio: number | null): string {
  if (ratio === null) {
    return '—';
  }
  const minutes = ((100 - ratio) / 100) * 90 * 24 * 60;
  if (minutes < 1) {
    return 'Under 1 min';
  }
  if (minutes < 90) {
    return `≈ ${Math.round(minutes)} min`;
  }
  return `≈ ${(minutes / 60).toFixed(1)} h`;
}

export function StatusGrid({ fallback, children }: { fallback: StatusPayload; children: ReactNode }) {
  const [payload, setPayload] = useState<StatusPayload>(fallback);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/uptime', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('status unavailable');
        }
        return response.json() as Promise<StatusPayload>;
      })
      .then((next) => {
        if (next.stat === 'ok' && Array.isArray(next.monitors) && next.monitors.length) {
          setPayload(next);
          setLive(true);
        }
      })
      .catch(() => {
        // Keep the verified server-rendered snapshot visible.
      });

    return () => controller.abort();
  }, []);

  const summary = useMemo(() => {
    const operational = payload.monitors.filter(monitor => monitor.status === 'up').length;
    const degraded = payload.monitors.filter(monitor => monitor.status === 'degraded').length;
    const unavailable = payload.monitors.filter(monitor => monitor.status === 'down').length;
    const ratios = payload.monitors
      .map(monitor => monitor.uptimeRatio)
      .filter((value): value is number => typeof value === 'number');
    const average = ratios.length
      ? ratios.reduce((sum, value) => sum + value, 0) / ratios.length
      : null;

    return { operational, degraded, unavailable, average };
  }, [payload.monitors]);

  const grouped = useMemo(() => {
    const result = new Map<string, Monitor[]>();
    for (const monitor of payload.monitors) {
      const group = groupName(monitor.region);
      result.set(group, [...(result.get(group) ?? []), monitor]);
    }
    return [...result.entries()].sort(([a], [b]) => groupOrder.indexOf(a) - groupOrder.indexOf(b));
  }, [payload.monitors]);

  const allHealthy = summary.unavailable === 0 && summary.degraded === 0;

  const checked = live && payload.checkedAt
    ? `Live feed · checked ${payload.checkedAt.slice(11, 16)} UTC`
    : 'Last published snapshot · live feed not connected';

  return (
    <>
      <section className="srv-status-v2-hero">
        <div className="sr-container sr-os-hero-grid">
          <div className="srv-status-v2-copy">
            {children}
            <div className="srv-status-v2-state" data-state={allHealthy ? 'ok' : 'attention'} role="status">
              {allHealthy
                ? <CheckCircle size={22} weight="fill" aria-hidden="true" />
                : <Warning size={22} weight="fill" aria-hidden="true" />}
              <div>
                <strong>
                  {allHealthy
                    ? `All ${payload.monitors.length} monitored services operational`
                    : `${summary.degraded + summary.unavailable} of ${payload.monitors.length} services need attention`}
                </strong>
                <span>{checked}</span>
              </div>
            </div>
          </div>
          <StatusFleet monitors={payload.monitors} average={summary.average} live={live} />
        </div>
      </section>

      <section className="srv-status-v2-body">
        <div className="sr-container srv-status-v2-console">
          <div className="srv-status-v2-metrics">
            <Card className="srv-status-v2-metric">
              <CardHeader>
                <span className="srv-status-v2-metric-icon"><CheckCircle size={18} weight="fill" /></span>
                <CardTitle>Operational</CardTitle>
              </CardHeader>
              <CardContent>
                <strong>
                  {summary.operational}
                  /
                  {payload.monitors.length}
                </strong>
                <span>monitored services</span>
              </CardContent>
            </Card>

            <Card className="srv-status-v2-metric">
              <CardHeader>
                <span className="srv-status-v2-metric-icon"><Pulse size={18} weight="fill" /></span>
                <CardTitle>90-day average</CardTitle>
              </CardHeader>
              <CardContent>
                <strong>{summary.average === null ? '—' : `${summary.average.toFixed(3)}%`}</strong>
                <span>across reported monitors</span>
              </CardContent>
            </Card>

            <Card className="srv-status-v2-metric">
              <CardHeader>
                <span className="srv-status-v2-metric-icon"><ClockCountdown size={18} weight="fill" /></span>
                <CardTitle>Data source</CardTitle>
              </CardHeader>
              <CardContent>
                <strong>{live ? 'Live' : 'Snapshot'}</strong>
                <span>{live ? 'public feed connected' : 'safe fallback active'}</span>
              </CardContent>
            </Card>
          </div>

          <Card className="srv-status-v2-table-card">
            <table className="srv-status-v2-table">
              <caption>Service details</caption>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">90-day uptime</th>
                  <th scope="col">Downtime in 90 days</th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              {grouped.map(([name, monitors]) => (
                <tbody key={name}>
                  <tr className="srv-status-v2-table-group">
                    <th scope="colgroup" colSpan={4}>
                      {name}
                      <span>{`${monitors.length} service${monitors.length === 1 ? '' : 's'}`}</span>
                    </th>
                  </tr>
                  {monitors.map(monitor => (
                    <tr key={monitor.label}>
                      <th scope="row">
                        <strong>{monitor.label}</strong>
                        <span>{monitor.region}</span>
                      </th>
                      <td className="srv-status-v2-num">{monitor.uptimeRatio === null ? '—' : `${monitor.uptimeRatio.toFixed(3)}%`}</td>
                      <td className="srv-status-v2-num">{downtime(monitor.uptimeRatio)}</td>
                      <td>
                        <Pill state={pillState(monitor.status)} icon={pillIcon(monitor.status)}>
                          {stateLabel(monitor.status)}
                        </Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </Card>

          <Card className="srv-status-v2-help">
            <CardContent>
              <div>
                <strong>Something looks wrong on your server?</strong>
                <span>Status covers shared infrastructure. Account or server-specific issues still need support.</span>
              </div>
              <div>
                <a href="https://wa.me/447441426993" target="_blank" rel="noopener noreferrer">
                  WhatsApp support
                </a>
                <a href="https://dash.stealthrdp.com/submitticket.php">
                  Open a ticket
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

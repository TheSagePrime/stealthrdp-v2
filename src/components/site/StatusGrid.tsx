'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pulse as Activity, CheckCircle as CheckCircle2, Question as CircleHelp, Warning as TriangleAlert, XCircle } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, type PillState } from '@/components/ui/pill';
import { Progress } from '@/components/ui/progress';

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
  if (status === 'up') return 'Operational';
  if (status === 'degraded') return 'Degraded';
  if (status === 'down') return 'Down';
  if (status === 'paused') return 'Paused';
  return 'Unknown';
}

function pillState(status: string): PillState {
  if (status === 'up') return 'ok';
  if (status === 'degraded') return 'warn';
  if (status === 'down') return 'bad';
  if (status === 'paused') return 'unknown';
  return 'neutral';
}

function pillIcon(status: string) {
  if (status === 'up') return <CheckCircle2 size={16} weight="fill" aria-hidden="true" />;
  if (status === 'degraded') return <TriangleAlert size={16} weight="fill" aria-hidden="true" />;
  if (status === 'down') return <XCircle size={16} weight="fill" aria-hidden="true" />;
  return <CircleHelp size={16} weight="fill" aria-hidden="true" />;
}

export function StatusGrid({ fallback }: { fallback: StatusPayload }) {
  const [payload, setPayload] = useState<StatusPayload>(fallback);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/uptime', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('status unavailable');
        return response.json() as Promise<StatusPayload>;
      })
      .then((next) => {
        if (next.stat === 'ok' && Array.isArray(next.monitors) && next.monitors.length) {
          setPayload(next);
          setLive(true);
        }
      })
      .catch(() => {
        // The server-rendered verified snapshot remains visible as the fallback.
      });

    return () => controller.abort();
  }, []);

  const summary = useMemo(() => {
    const operational = payload.monitors.filter(monitor => monitor.status === 'up').length;
    const degraded = payload.monitors.filter(monitor => monitor.status === 'degraded').length;
    const unavailable = payload.monitors.filter(monitor => monitor.status === 'down').length;
    return { operational, degraded, unavailable };
  }, [payload.monitors]);

  const allHealthy = summary.unavailable === 0 && summary.degraded === 0;

  return (
    <div className="sr-status-panel srv-status-console">
      <Card className="srv-status-summary-card gap-4 py-5">
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="grid gap-1">
            <p className="sr-kicker">Current snapshot</p>
            <h2 className="text-heading-4 font-semibold text-body-text">
              {allHealthy
                ? 'All monitored services operational'
                : 'Service health requires attention'}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <Pill
              state={summary.operational > 0 ? 'ok' : 'unknown'}
              icon={<CheckCircle2 size={16} weight="fill" aria-hidden="true" />}
            >
              <span>
                <strong className="font-semibold text-body-text">{summary.operational}</strong>
                {' operational'}
              </span>
            </Pill>
            <Pill state="neutral" icon={<Activity size={16} weight="fill" aria-hidden="true" />}>
              <span>
                <strong className="font-semibold text-body-text">{payload.monitors.length}</strong>
                {' monitored'}
              </span>
            </Pill>
          </div>
        </CardContent>
      </Card>

      <p className="sr-status-source" aria-live="polite">
        {live ? 'Live status · refreshed from the public UptimeRobot status feed' : 'Published fallback snapshot · live refresh unavailable'}
      </p>

      <div className="sr-status-grid">
        {payload.monitors.map(monitor => (
          <Card key={monitor.label} className="srv-status-monitor" data-status={monitor.status}>
            <CardHeader className="grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="grid gap-1.5">
                <CardTitle className="text-small text-body-text">{monitor.label}</CardTitle>
                <CardDescription className="text-micro text-body-dim">
                  {monitor.region}
                </CardDescription>
              </div>
              <Pill state={pillState(monitor.status)} icon={pillIcon(monitor.status)}>
                {stateLabel(monitor.status)}
              </Pill>
            </CardHeader>

            <CardContent className="grid gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-micro text-body-dim">90-day uptime</span>
                <span className="font-mono text-small text-body-text tabular-nums">
                  {monitor.uptimeRatio === null ? '—' : `${monitor.uptimeRatio.toFixed(3)}%`}
                </span>
              </div>
              {monitor.uptimeRatio === null ? null : (
                <Progress
                  value={monitor.uptimeRatio}
                  max={100}
                  label={`90-day uptime for ${monitor.label}`}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

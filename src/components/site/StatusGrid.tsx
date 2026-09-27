'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle,
  ClockCountdown,
  Pulse,
  Question,
  Warning,
  XCircle,
} from '@phosphor-icons/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  if (status === 'up') return <CheckCircle size={15} weight="fill" aria-hidden="true" />;
  if (status === 'degraded') return <Warning size={15} weight="fill" aria-hidden="true" />;
  if (status === 'down') return <XCircle size={15} weight="fill" aria-hidden="true" />;
  return <Question size={15} weight="fill" aria-hidden="true" />;
}

function groupName(region: string): string {
  if (region.startsWith('USA')) return 'USA infrastructure';
  if (region.startsWith('EU')) return 'EU infrastructure';
  return 'Platform services';
}

export function StatusGrid({ fallback }: { fallback: StatusPayload }) {
  const [payload, setPayload] = useState<StatusPayload>(fallback);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/uptime', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('status unavailable');
        return response.json() as Promise<StatusPayload>;
      })
      .then(next => {
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
    return [...result.entries()];
  }, [payload.monitors]);

  const allHealthy = summary.unavailable === 0 && summary.degraded === 0;

  return (
    <div className="srv-status-v2-console">
      <Alert tone={allHealthy ? 'ok' : 'warn'} className="srv-status-v2-alert">
        <div>
          <AlertTitle>
            {allHealthy ? 'Everything we monitor is operational.' : 'One or more services need attention.'}
          </AlertTitle>
          <AlertDescription>
            {live
              ? 'Live refresh is connected to the public status feed.'
              : 'Showing the latest published safe snapshot while live refresh is unavailable.'}
          </AlertDescription>
        </div>
      </Alert>

      <div className="srv-status-v2-metrics">
        <Card className="srv-status-v2-metric">
          <CardHeader>
            <span className="srv-status-v2-metric-icon"><CheckCircle size={18} weight="fill" /></span>
            <CardTitle>Operational</CardTitle>
          </CardHeader>
          <CardContent>
            <strong>{summary.operational}/{payload.monitors.length}</strong>
            <span>monitored services</span>
          </CardContent>
        </Card>

        <Card className="srv-status-v2-metric">
          <CardHeader>
            <span className="srv-status-v2-metric-icon"><Pulse size={18} weight="fill" /></span>
            <CardTitle>90-day average</CardTitle>
          </CardHeader>
          <CardContent>
            <strong>{summary.average === null ? '—' : summary.average.toFixed(3) + '%'}</strong>
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

      <div className="srv-status-v2-groups">
        {grouped.map(([name, monitors]) => (
          <Card key={name} className="srv-status-v2-group">
            <CardHeader className="srv-status-v2-group-head">
              <div>
                <CardTitle>{name}</CardTitle>
                <span>{monitors.length} service{monitors.length === 1 ? '' : 's'}</span>
              </div>
              <Pill
                state={monitors.every(monitor => monitor.status === 'up') ? 'ok' : 'warn'}
                icon={<Pulse size={14} weight="fill" aria-hidden="true" />}
              >
                {monitors.every(monitor => monitor.status === 'up') ? 'Operational' : 'Attention'}
              </Pill>
            </CardHeader>

            <CardContent className="srv-status-v2-monitor-list">
              {monitors.map(monitor => (
                <div className="srv-status-v2-monitor" key={monitor.label}>
                  <div className="srv-status-v2-monitor-name">
                    <strong>{monitor.label}</strong>
                    <span>{monitor.region}</span>
                  </div>
                  <div className="srv-status-v2-monitor-uptime">
                    <span>{monitor.uptimeRatio === null ? '—' : monitor.uptimeRatio.toFixed(3) + '%'}</span>
                    {monitor.uptimeRatio === null ? null : (
                      <Progress
                        value={monitor.uptimeRatio}
                        max={100}
                        label={'90-day uptime for ' + monitor.label}
                      />
                    )}
                  </div>
                  <Pill state={pillState(monitor.status)} icon={pillIcon(monitor.status)}>
                    {stateLabel(monitor.status)}
                  </Pill>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

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
  );
}

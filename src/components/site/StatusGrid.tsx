'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2, Clock3 } from 'lucide-react';

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

  return (
    <div className="sr-status-panel">
      <div className="sr-status-summary">
        <div>
          <span className="sr-status-summary-icon"><Activity /></span>
          <div>
            <p className="sr-kicker">Current snapshot</p>
            <h2>{summary.unavailable === 0 && summary.degraded === 0 ? 'All monitored services operational' : 'Service health requires attention'}</h2>
          </div>
        </div>

        <div className="sr-status-summary-stats">
          <span><CheckCircle2 /> <strong>{summary.operational}</strong> operational</span>
          <span><Clock3 /> <strong>{payload.monitors.length}</strong> monitored</span>
        </div>
      </div>

      <p className="sr-status-source" aria-live="polite">
        {live ? 'Live status · refreshed from the public UptimeRobot status feed' : 'Published fallback snapshot · live refresh unavailable'}
      </p>

      <div className="sr-status-grid">
        {payload.monitors.map(monitor => (
          <article className="sr-status-card" key={monitor.label}>
            <div className="sr-status-card-head">
              <span className="sr-status-dot" data-state={monitor.status} aria-hidden="true" />
              <div>
                <span className="sr-status-name">{monitor.label}</span>
                <p className="sr-muted">{monitor.region}</p>
              </div>
              <span className="sr-status-value" data-state={monitor.status}>{stateLabel(monitor.status)}</span>
            </div>

            <div className="sr-status-metric">
              <span>90-day uptime</span>
              <b>{monitor.uptimeRatio === null ? '—' : `${monitor.uptimeRatio.toFixed(3)}%`}</b>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

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

  return (
    <>
      <p className="sr-status-source" aria-live="polite">
        {live ? 'Live status · refreshed from the public UptimeRobot status feed' : 'Published fallback snapshot · live refresh unavailable'}
      </p>
      <div className="sr-status-grid">
        {payload.monitors.map(monitor => (
          <article className="sr-status-card" key={monitor.label}>
            <div className="sr-status-line">
              <span className="sr-status-name">{monitor.label}</span>
              <span className="sr-status-value" data-state={monitor.status}>{stateLabel(monitor.status)}</span>
            </div>
            <p className="sr-muted">{monitor.region}</p>
            <div className="sr-status-line">
              <span className="sr-muted">90-day uptime</span>
              <b>{monitor.uptimeRatio === null ? '—' : `${monitor.uptimeRatio.toFixed(3)}%`}</b>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

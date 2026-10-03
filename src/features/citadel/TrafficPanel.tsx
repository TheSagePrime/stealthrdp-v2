'use client';

import type { DomainView, JsonValue, ResourceView } from './catalog';
import { useEffect, useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import styles from './CitadelDashboard.module.css';

type Point = { at: number; primary: number; blocked: number };
function record(value: JsonValue | undefined): Record<string, JsonValue> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}
function numeric(value: JsonValue | undefined): number {
  const number = Number(value || 0);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}
function points(data: Record<string, JsonValue> | undefined, bandwidth = false): Point[] {
  const rows = data?.[bandwidth ? 'series' : 'points'];
  if (!Array.isArray(rows)) {
    return [];
  }
  return rows.map((row) => {
    const item = record(row);
    const metric = record(item.vps);
    const rawAt = bandwidth ? item.day : item.bucketStart;
    return { at: typeof rawAt === 'number' ? rawAt : Date.parse(String(rawAt)), primary: numeric(bandwidth ? item.cleanGb : metric.requests), blocked: numeric(metric.blocked) };
  }).filter(point => Number.isFinite(point.at)).sort((a, b) => a.at - b.at);
}
function TrafficChart({ samples, bandwidth = false }: { samples: Point[]; bandwidth?: boolean }) {
  const id = useId();
  if (!samples.length) {
    return <p className={styles.muted}>No traffic samples in this range.</p>;
  }
  const first = samples[0]!.at;
  const last = samples.at(-1)!.at;
  const ceiling = Math.max(1, ...samples.flatMap(sample => [sample.primary, sample.blocked]));
  const line = (key: 'primary' | 'blocked') => samples.map((sample, index) => `${index ? 'L' : 'M'} ${24 + ((sample.at - first) / Math.max(1, last - first)) * 592} ${160 - (sample[key] / ceiling) * 136}`).join(' ');
  const total = samples.reduce((sum, sample) => sum + sample.primary, 0);
  return (
    <>
      <svg className={styles.chart} viewBox="0 0 640 184" role="img" aria-labelledby={id}>
        <title id={id}>
          {bandwidth ? 'Clean bandwidth in GB per day' : 'Proxy requests and blocked traffic per time bucket'}
          .
          {' '}
          {samples.length}
          {' '}
          samples, from
          {' '}
          {new Date(first).toLocaleString()}
          {' '}
          to
          {' '}
          {new Date(last).toLocaleString()}
          .
        </title>
        <path d={line('primary')} className={styles.chartPrimary} />
        {!bandwidth ? <path d={line('blocked')} className={styles.chartBlocked} /> : null}
      </svg>
      <div className={styles.chartLegend}>
        <span className={styles.chartPrimaryLabel}>{bandwidth ? `Clean transfer: ${total.toFixed(3)} GB` : `Proxy requests: ${total.toLocaleString()}`}</span>
        {!bandwidth
          ? (
              <span className={styles.chartBlockedLabel}>
                Blocked:
                {samples.reduce((sum, sample) => sum + sample.blocked, 0).toLocaleString()}
              </span>
            )
          : null}
      </div>
      <p className={styles.muted}>
        {new Date(first).toLocaleString()}
        {' '}
        –
        {' '}
        {new Date(last).toLocaleString()}
      </p>
    </>
  );
}
export function TrafficPanel({ base, domains, onExpired }: { base: string; domains: DomainView[]; onExpired: () => void }) {
  const [domain, setDomain] = useState('');
  const [minutes, setMinutes] = useState('60');
  const [range, setRange] = useState('billing');
  const [analytics, setAnalytics] = useState<ResourceView | null>(null);
  const [bandwidth, setBandwidth] = useState<ResourceView | null>(null);
  const [live, setLive] = useState<ResourceView | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let pending = false;
    async function refresh() {
      if (pending || document.visibilityState === 'hidden') {
        return;
      }
      pending = true;
      setLoading(true);
      setError('');
      const query = new URLSearchParams({ minutes });
      if (domain) {
        query.set('domainId', domain);
      }
      const liveQuery = domain ? `?${new URLSearchParams({ domainId: domain })}` : '';
      try {
        const values = await Promise.all([`analytics?${query}`, `service/bandwidth?${new URLSearchParams({ range })}`, `analytics/live${liveQuery}`].map(async (path) => {
          const response = await fetch(`/api/citadel/${base}/${path}`, { signal: controller.signal, cache: 'no-store', credentials: 'same-origin', redirect: 'error' });
          const data = await response.json();
          if (response.status === 401) {
            onExpired();
          }
          if (!response.ok) {
            throw new Error(data.error || 'Traffic is temporarily unavailable.');
          }
          return data as ResourceView;
        }));
        if (!controller.signal.aborted) {
          setAnalytics(values[0]!);
          setBandwidth(values[1]!);
          setLive(values[2]!);
        }
      } catch (failure) {
        if (!controller.signal.aborted) {
          setError(failure instanceof Error ? failure.message : 'Traffic is temporarily unavailable.');
        }
      } finally {
        pending = false;
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    void refresh();
    const timer = setInterval(() => {
      void refresh();
    }, 15000);
    const resume = () => {
      if (document.visibilityState === 'visible') {
        void refresh();
      }
    };
    document.addEventListener('visibilitychange', resume);
    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener('visibilitychange', resume);
    };
  }, [base, domain, minutes, range, revision, onExpired]);
  return (
    <div className={styles.formGroup} aria-busy={loading}>
      <div className={styles.toolbar}>
        <label>
          Traffic scope
          <Select
            value={domain}
            onChange={(event) => {
              setAnalytics(null);
              setLive(null);
              setDomain(event.target.value);
            }}
          >
            <option value="">All your domains</option>
            {domains.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </Select>
        </label>
        <Button variant="outline" disabled={loading} onClick={() => setRevision(value => value + 1)}>Refresh traffic</Button>
      </div>
      {error ? <p role="alert">{error}</p> : null}
      <Card>
        <CardHeader>
          <CardTitle>Traffic history</CardTitle>
          <CardDescription>Operational proxy metrics. These are separate from billed bandwidth.</CardDescription>
        </CardHeader>
        <CardContent>
          <label>
            Traffic window
            <Select
              value={minutes}
              onChange={(event) => {
                setAnalytics(null);
                setMinutes(event.target.value);
              }}
            >
              {[['15', '15 minutes'], ['30', '30 minutes'], ['60', '1 hour'], ['180', '3 hours'], ['360', '6 hours'], ['720', '12 hours'], ['1440', '1 day'], ['4320', '3 days'], ['10080', '7 days']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Select>
          </label>
          {analytics ? <TrafficChart samples={points(analytics.data)} /> : <p role="status">Loading traffic…</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Latest proxy counters</CardTitle>
          <CardDescription>Refreshed every 15 seconds while this page is visible.</CardDescription>
        </CardHeader>
        <CardContent>
          {live
            ? (
                <dl className={styles.fields}>
                  {live.fields.map(field => (
                    <div key={field.label} className={styles.field}>
                      <dt>{field.label}</dt>
                      <dd>{field.value}</dd>
                    </div>
                  ))}
                </dl>
              )
            : <p role="status">Loading proxy counters…</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Clean bandwidth</CardTitle>
          <CardDescription>Passed-to-origin traffic for the whole organisation. Blocked and challenged traffic does not count.</CardDescription>
        </CardHeader>
        <CardContent>
          <label>
            Bandwidth range
            <Select
              value={range}
              onChange={(event) => {
                setBandwidth(null);
                setRange(event.target.value);
              }}
            >
              {[['billing', 'Billing period'], ['30', 'Last 30 days'], ['60', 'Last 60 days'], ['90', 'Last 90 days']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Select>
          </label>
          {bandwidth
            ? (
                <>
                  <TrafficChart samples={points(bandwidth.data, true)} bandwidth />
                  <dl className={styles.fields}>
                    {bandwidth.fields.map(field => (
                      <div className={styles.field} key={field.label}>
                        <dt>{field.label}</dt>
                        <dd>{field.value}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              )
            : <p role="status">Loading bandwidth…</p>}
        </CardContent>
      </Card>
    </div>
  );
}

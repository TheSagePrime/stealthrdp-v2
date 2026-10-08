'use client';

import type { PointerEvent } from 'react';
import type { SiteLocale } from '@/config/i18n';
import type { ResponseSample } from '@/lib/stealth/uptime';
import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { statusCopy } from '@/content/i18n/status';
import styles from './ResponseChart.module.css';

export function ResponseChart({ samples, locale, service }: { samples: ResponseSample[]; locale: SiteLocale; service: string }) {
  const t = statusCopy[locale].board;
  const id = useId();
  const [selectedAt, setSelectedAt] = useState<string | null>(null);
  const active = samples.find(sample => sample.at === selectedAt) ?? samples.at(-1);
  const measured = samples.flatMap(sample => sample.ms === null ? [] : [sample.ms]);
  if (measured.length === 0) {
    return <p className={styles.note}>{t.responseEmpty}</p>;
  }
  const maximum = Math.max(...measured);
  const minimum = Math.min(...measured);
  const ceiling = Math.max(1, maximum * 1.15);
  const first = Date.parse(samples[0]!.at);
  const end = Math.max(first + 1, Date.parse(samples.at(-1)!.at));
  const x = (sample: ResponseSample) => (Date.parse(sample.at) - first) / (end - first) * 1000;
  const y = (ms: number) => 160 - ms / ceiling * 140;
  let newSegment = true;
  let previous = 0;
  const path = samples.map((sample) => {
    const at = Date.parse(sample.at);
    if (sample.ms === null) {
      newSegment = true;
      previous = at;
      return '';
    }
    // Never draw through absent checks or missing samples.
    const move = newSegment || at - previous > 10 * 60_000;
    newSegment = false;
    previous = at;
    return `${move ? 'M' : 'L'}${x(sample).toFixed(1)},${y(sample.ms).toFixed(1)}`;
  }).join(' ');
  const timestamp = (at: string) => `${at.slice(0, 10)} ${at.slice(11, 16)} UTC`;
  const value = (ms: number | null) => ms === null ? t.responseMissing : `${Math.round(ms)} ms`;
  const inspectPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const at = first + Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)) * (end - first);
    const nearest = samples.reduce((best, sample) => Math.abs(Date.parse(sample.at) - at) < Math.abs(Date.parse(best.at) - at) ? sample : best, samples[0]!);
    setSelectedAt(nearest.at);
  };
  return (
    <section className={styles.chart} aria-labelledby={id}>
      <div className={styles.head}>
        <h4 id={id}>{t.responseChart}</h4>
        <p>{t.responseHint}</p>
      </div>
      <div className={styles.plot}>
        <div className={styles.scale}>
          <span>{`${Math.ceil(ceiling)} ms`}</span>
          <span>0 ms</span>
        </div>
        <svg
          viewBox="0 0 1000 180"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${service}: ${t.responseChart}`}
          onPointerMove={inspectPointer}
          onPointerDown={inspectPointer}
        >
          <path className={styles.gridline} d="M0,20 H1000 M0,90 H1000 M0,160 H1000" />
          <path className={styles.line} d={path} />
          {active?.ms !== null && active?.ms !== undefined && <circle className={styles.point} cx={x(active)} cy={y(active.ms)} r="4" />}
        </svg>
      </div>
      <div className={styles.axis}>
        <span>{timestamp(samples[0]!.at)}</span>
        <span>{timestamp(samples.at(-1)!.at)}</span>
      </div>
      <div className={styles.inspect} aria-label={t.responseInspect}>
        <Button
          variant="outline"
          size="sm"
          aria-label={`${t.responseInspect}: ←`}
          onClick={() => {
            const index = samples.findIndex(sample => sample === active);
            setSelectedAt(samples[Math.max(0, index - 1)]!.at);
          }}
        >
          ←
        </Button>
        <output>{active ? `${timestamp(active.at)} · ${value(active.ms)}` : ''}</output>
        <Button
          variant="outline"
          size="sm"
          aria-label={`${t.responseInspect}: →`}
          onClick={() => {
            const index = samples.findIndex(sample => sample === active);
            setSelectedAt(samples[Math.min(samples.length - 1, index + 1)]!.at);
          }}
        >
          →
        </Button>
      </div>
      <dl className={styles.stats}>
        <div>
          <dt>{t.sampleAverage}</dt>
          <dd>{value(measured.reduce((sum, ms) => sum + ms, 0) / measured.length)}</dd>
        </div>
        <div>
          <dt>{t.minimum}</dt>
          <dd>{value(minimum)}</dd>
        </div>
        <div>
          <dt>{t.maximum}</dt>
          <dd>{value(maximum)}</dd>
        </div>
      </dl>
    </section>
  );
}

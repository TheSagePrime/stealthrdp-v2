'use client';

import type { CitadelCopy } from '@/content/i18n/en/citadel';
import { useState } from 'react';
import { fill } from '@/lib/stealth/i18n';
import styles from './CitadelIncident.module.css';

/*
 * A simulated 30-minute HTTP flood drawn with the Edge, Proxy and Blocked
 * series Citadel Analytics uses. The numbers are generated from a fixed seed,
 * so every stat on the card is derived from the same data the chart draws.
 */

const STEP = 1 / 3; // minutes between samples (20 s)
const SPAN = 30; // minutes on the x axis
const START_HOUR = 14;
const attack = { start: 4, escalate: 5, end: 21 } as const;

/* When each event in the copy happens: started, escalated, ended, healed. */
const eventTimes = [attack.start, attack.escalate, attack.end, 24.5];

function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

type Sample = { t: number; edge: number; proxy: number; blocked: number };

function simulate(): Sample[] {
  const random = seeded(7);
  const samples: Sample[] = [];
  for (let index = 0; index <= SPAN / STEP; index++) {
    const t = index * STEP;
    const base = 520 + 70 * Math.sin(t / 2.6) + 50 * random();
    const ramp = Math.min(1, Math.max(0, (t - attack.start) / 1.4));
    const decay = Math.min(1, Math.max(0, (attack.end + 1.4 - t) / 1.4));
    const envelope = t < attack.start ? 0 : Math.min(ramp, decay);
    const flood = envelope * 17600 * (0.8 + 0.2 * random()) * (1 + 0.06 * Math.sin(t * 2.1));
    /* Before Auto escalates, part of the flood reaches the origin. */
    const leak = flood * (t < attack.escalate + STEP ? 0.11 : 0.0035);
    const proxy = base * 0.97 + leak;
    const edge = base + flood;
    samples.push({ t, edge, proxy, blocked: edge - proxy });
  }
  return samples;
}

const samples = simulate();

const peakEdge = Math.max(...samples.map(sample => sample.edge));
const settled = samples.filter(sample => sample.t > attack.escalate + 0.5 && sample.t < attack.end);
const originDuringAttack = Math.max(...settled.map(sample => sample.proxy));
const attackWindow = samples.filter(sample => sample.t >= attack.start && sample.t <= attack.end + 1.4);
const stoppedShare = attackWindow.reduce((sum, sample) => sum + sample.blocked, 0)
  / attackWindow.reduce((sum, sample) => sum + sample.edge, 0);
const totalBlocked = attackWindow.reduce((sum, sample) => sum + sample.blocked, 0) * STEP * 60;

const EDGE_MAX = 20000;
const ORIGIN_MAX = 2500;

type IncidentWords = CitadelCopy['incident'];

function compact(value: number, t: IncidentWords) {
  return value >= 1000 ? `${(value / 1000).toFixed(1).replace('.', t.decimal)}${t.thousand}` : String(Math.round(value));
}

function clock(t: number) {
  const minutes = Math.round(t);
  return `${START_HOUR}:${String(minutes).padStart(2, '0')}`;
}

function area(values: number[], max: number, floor?: number[]) {
  const x = (index: number) => ((samples[index]!.t / SPAN) * 1000).toFixed(1);
  const y = (value: number) => (100 - (Math.min(value, max) / max) * 100).toFixed(2);
  const top = values.map((value, index) => `${index ? 'L' : 'M'}${x(index)} ${y(value)}`).join(' ');
  const bottom = floor
    ? floor.map((_, offset) => {
        const index = floor.length - 1 - offset;
        return `L${x(index)} ${y(floor[index]!)}`;
      }).join(' ')
    : `L1000 100 L0 100`;
  return { line: top, fill: `${top} ${bottom} Z` };
}

const edgeShape = area(samples.map(sample => sample.edge), EDGE_MAX, samples.map(sample => sample.proxy));
const edgeProxy = area(samples.map(sample => sample.proxy), EDGE_MAX);
const originShape = area(samples.map(sample => sample.proxy), ORIGIN_MAX);

const ticks = [0, 5, 10, 15, 20, 25, 30];

export function CitadelIncident({ copy: t }: { copy: IncidentWords }) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover === null ? null : samples[hover]!;
  const events = t.events.map((label, index) => ({
    at: eventTimes[index] ?? 0,
    label: fill(label, { minutes: attack.end - attack.start }),
  }));

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const share = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    setHover(Math.round(share * (samples.length - 1)));
  };

  const left = (t: number) => `${(t / SPAN) * 100}%`;

  return (
    <figure className={styles.card} aria-labelledby="citadel-incident-caption">
      <div className={styles.head}>
        <div>
          <strong>{t.title}</strong>
          <span>{t.subtitle}</span>
        </div>
        <ul className={styles.legend} aria-label={t.seriesLabel}>
          <li data-series="edge">{t.series.edge}</li>
          <li data-series="blocked">{t.series.blocked}</li>
          <li data-series="proxy">{t.series.proxy}</li>
        </ul>
      </div>

      <div className={styles.body}>
        <div className={styles.charts}>
          <div className={styles.events} aria-hidden="true">
            {events.map(event => (
              <span key={event.label} style={{ left: left(event.at) }}>{event.label}</span>
            ))}
          </div>

          <div
            className={styles.plot}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            aria-hidden="true"
          >
            {events.map(event => (
              <i key={event.label} className={styles.marker} style={{ left: left(event.at) }} />
            ))}

            <div className={styles.panel} data-panel="edge">
              <span className={styles.panelLabel}>{t.edgePanel}</span>
              <span className={styles.axis} data-at="top">{t.axes.edgeTop}</span>
              <span className={styles.axis} data-at="mid">{t.axes.edgeMid}</span>
              <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
                <path d={edgeShape.fill} className={styles.blockedFill} />
                <path d={edgeProxy.fill} className={styles.proxyFill} />
                <path d={edgeShape.line} className={styles.edgeLine} />
              </svg>
            </div>

            <div className={styles.panel} data-panel="origin">
              <span className={styles.panelLabel}>{t.originPanel}</span>
              <span className={styles.axis} data-at="top">{t.axes.originTop}</span>
              <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
                <path d={originShape.fill} className={styles.proxyFill} />
                <path d={originShape.line} className={styles.proxyLine} />
              </svg>
            </div>

            {active && (
              <>
                <i className={styles.crosshair} style={{ left: left(active.t) }} />
                <div className={styles.tooltip} data-flip={active.t > SPAN * 0.62 || undefined} style={{ left: left(active.t) }}>
                  <strong>{clock(active.t)}</strong>
                  <span data-series="edge">{fill(t.tooltip.edge, { value: compact(active.edge, t) })}</span>
                  <span data-series="blocked">{fill(t.tooltip.blocked, { value: compact(active.blocked, t) })}</span>
                  <span data-series="proxy">{fill(t.tooltip.origin, { value: compact(active.proxy, t) })}</span>
                </div>
              </>
            )}
          </div>

          <div className={styles.ticks} aria-hidden="true">
            {ticks.map(tick => (
              <span key={tick} style={{ left: left(tick) }}>{clock(tick)}</span>
            ))}
          </div>
        </div>

        <dl className={styles.stats}>
          <div>
            <dt>{t.stats.peakEdge}</dt>
            <dd>
              {compact(peakEdge, t)}
              <small>{t.rate}</small>
            </dd>
          </div>
          <div>
            <dt>{t.stats.peakOrigin}</dt>
            <dd>
              {compact(originDuringAttack, t)}
              <small>{t.rate}</small>
            </dd>
          </div>
          <div>
            <dt>{t.stats.stopped}</dt>
            <dd>
              {(stoppedShare * 100).toFixed(1).replace('.', t.decimal)}
              <small>%</small>
            </dd>
          </div>
          <div>
            <dt>{t.stats.neverSaw}</dt>
            <dd>
              {`${(totalBlocked / 1e6).toFixed(1).replace('.', t.decimal)}${t.million}`}
            </dd>
          </div>
        </dl>
      </div>

      <figcaption id="citadel-incident-caption" className={styles.caption}>
        {fill(t.caption, {
          peak: compact(peakEdge, t),
          start: clock(attack.start),
          origin: compact(originDuringAttack, t),
          end: clock(attack.end),
        })}
      </figcaption>
    </figure>
  );
}

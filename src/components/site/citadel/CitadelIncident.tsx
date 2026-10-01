'use client';

import { useState } from 'react';
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

const events = [
  { at: attack.start, label: 'Attack started' },
  { at: attack.escalate, label: 'Auto raised the level to JS' },
  { at: attack.end, label: `Attack ended · ${attack.end - attack.start} min` },
  { at: 24.5, label: 'Auto healed to baseline' },
] as const;

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

function compact(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(Math.round(value));
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

export function CitadelIncident() {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover === null ? null : samples[hover]!;

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
          <strong>Example: a 17-minute HTTP flood</strong>
          <span>Simulated data · 14:00 to 14:30</span>
        </div>
        <ul className={styles.legend} aria-label="Series">
          <li data-series="edge">Edge requests</li>
          <li data-series="blocked">Blocked at the edge</li>
          <li data-series="proxy">Proxied to origin</li>
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
              <span className={styles.panelLabel}>At the Citadel edge · requests/s</span>
              <span className={styles.axis} data-at="top">20k</span>
              <span className={styles.axis} data-at="mid">10k</span>
              <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
                <path d={edgeShape.fill} className={styles.blockedFill} />
                <path d={edgeProxy.fill} className={styles.proxyFill} />
                <path d={edgeShape.line} className={styles.edgeLine} />
              </svg>
            </div>

            <div className={styles.panel} data-panel="origin">
              <span className={styles.panelLabel}>At your origin · requests/s</span>
              <span className={styles.axis} data-at="top">2.5k</span>
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
                  <span data-series="edge">{`Edge ${compact(active.edge)} r/s`}</span>
                  <span data-series="blocked">{`Blocked ${compact(active.blocked)} r/s`}</span>
                  <span data-series="proxy">{`Origin ${compact(active.proxy)} r/s`}</span>
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
            <dt>Peak at the edge</dt>
            <dd>
              {compact(peakEdge)}
              <small>r/s</small>
            </dd>
          </div>
          <div>
            <dt>Peak at the origin after Auto escalated</dt>
            <dd>
              {compact(originDuringAttack)}
              <small>r/s</small>
            </dd>
          </div>
          <div>
            <dt>Attack requests stopped at the edge</dt>
            <dd>
              {(stoppedShare * 100).toFixed(1)}
              <small>%</small>
            </dd>
          </div>
          <div>
            <dt>Requests the origin never saw</dt>
            <dd>
              {`${(totalBlocked / 1e6).toFixed(1)}M`}
            </dd>
          </div>
        </dl>
      </div>

      <figcaption id="citadel-incident-caption" className={styles.caption}>
        {`Simulated example. Requests at the edge climb from about 500 to ${compact(peakEdge)} per second at ${clock(attack.start)}. `}
        {`For one minute some of the flood reaches the origin, then Auto raises the challenge level to JS and origin traffic falls back to about ${compact(originDuringAttack)} requests per second until the attack ends at ${clock(attack.end)}.`}
      </figcaption>
    </figure>
  );
}

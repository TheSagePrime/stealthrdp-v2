'use client';

import { useEffect, useRef } from 'react';
import { groupName, groupOrder } from './status-groups';
import styles from './StatusFleet.module.css';

/*
 * Hero visual for /status: the uptime monitor at the core and every
 * monitored service as a node, grouped like the list below. Each node shows
 * its real state and 90-day uptime. Check pulses travel only while the live
 * feed is connected, so a snapshot never looks live.
 */

export type FleetMonitor = {
  label: string;
  region: string;
  status: string;
  uptimeRatio: number | null;
};

const ROW = 36;
const HEAD = 28;

type Row = { kind: 'head'; y: number; name: string } | { kind: 'node'; y: number; monitor: FleetMonitor };

/* Group headers and node rows from `top`, in group order. */
function rows(monitors: FleetMonitor[], top: number) {
  const list: Row[] = [];
  let y = top;
  for (const name of groupOrder) {
    const members = monitors.filter(monitor => groupName(monitor.region) === name);
    if (!members.length) {
      continue;
    }
    list.push({ kind: 'head', y: y + 16, name });
    y += HEAD;
    for (const monitor of members) {
      list.push({ kind: 'node', y: y + ROW / 2, monitor });
      y += ROW;
    }
  }
  return { list, bottom: y };
}

const uptimeText = (value: number | null) => (value === null ? '—' : `${value.toFixed(3)}%`);

function Node({ x, y, width, labelX, monitor, live }: {
  x: number;
  y: number;
  width: number;
  labelX: number;
  monitor: FleetMonitor;
  live: boolean;
}) {
  return (
    <g className={styles.node} data-status={monitor.status}>
      <rect x={x} y={y - 15} width={width} height="30" rx="15" className={styles.pill} />
      {live && monitor.status === 'up' && <circle cx={x + 18} cy={y} r="5" className={styles.ping} />}
      <circle cx={x + 18} cy={y} r="4.5" className={styles.dot} />
      <text x={labelX} y={y + 4} className={styles.label}>{monitor.label}</text>
      <text x={x + width - 14} y={y + 4} textAnchor="end" className={styles.uptime}>{uptimeText(monitor.uptimeRatio)}</text>
    </g>
  );
}

function Core({ x, y, r, average, id }: { x: number; y: number; r: number; average: number | null; id: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" className={styles.haloInner} />
          <stop offset="100%" className={styles.haloOuter} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r + 90} fill={`url(#${id})`} />
      <circle cx={x} cy={y} r={r + 8} className={styles.aura} />
      <circle cx={x} cy={y} r={r} className={styles.disc} />
      <circle cx={x} cy={y} r={r - 8} className={styles.inner} />
      <text x={x} y={y - 12} textAnchor="middle" className={styles.coreNote}>90-day</text>
      <text x={x} y={y + 8} textAnchor="middle" className={styles.coreValue}>{average === null ? '—' : `${average.toFixed(2)}%`}</text>
      <text x={x} y={y + 24} textAnchor="middle" className={styles.coreNote}>average</text>
    </g>
  );
}

export function StatusFleet({ monitors, average, live }: {
  monitors: FleetMonitor[];
  average: number | null;
  live: boolean;
}) {
  const figureRef = useRef<HTMLDivElement>(null);

  /* Pause the check pulses while the figure is off screen. */
  useEffect(() => {
    const element = figureRef.current;
    if (!element || !live) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      element.querySelectorAll('svg').forEach(svg => (entry?.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [live]);

  const wide = rows(monitors, 20);
  const wideHeight = Math.max(360, wide.bottom + 16);
  const core = { x: 92, y: wideHeight / 2, r: 54 };
  const nodeX = 236;

  const tall = rows(monitors, 156);
  const tallHeight = tall.bottom + 12;
  const lastTall = tall.list.at(-1)?.y ?? 160;
  const spine = `M180 110 C180 136 22 124 22 150 L22 ${lastTall}`;

  return (
    <div ref={figureRef} className={styles.figure} data-live={live || undefined}>
      <svg viewBox={`0 0 580 ${wideHeight}`} className={styles.scene} data-layout="wide" aria-hidden="true">
        {wide.list.map((row, index) => {
          if (row.kind === 'head') {
            return null;
          }
          const d = `M${core.x + core.r} ${core.y} C${core.x + 120} ${core.y} ${nodeX - 70} ${row.y} ${nodeX} ${row.y}`;
          return (
            <g key={row.monitor.label} data-status={row.monitor.status} className={styles.wire}>
              <path d={d} className={styles.link} />
              {live && (
                <circle r="3" className={styles.comet}>
                  <animateMotion path={d} dur="2.8s" begin={`${(index * 0.37) % 2.8}s`} repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}
        <Core {...core} average={average} id="fleet-halo-wide" />
        {wide.list.map(row => (row.kind === 'head'
          ? <text key={row.name} x={nodeX + 4} y={row.y} className={styles.group}>{row.name}</text>
          : <Node key={row.monitor.label} x={nodeX} y={row.y} width={336} labelX={nodeX + 34} monitor={row.monitor} live={live} />))}
      </svg>

      <svg viewBox={`0 0 360 ${tallHeight}`} className={styles.scene} data-layout="tall" aria-hidden="true">
        <path d={spine} className={styles.link} />
        {live && [0, 1.4].map(begin => (
          <circle key={begin} r="3" className={styles.comet}>
            <animateMotion path={spine} dur="2.8s" begin={`${begin}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <Core x={180} y={58} r={46} average={average} id="fleet-halo-tall" />
        {tall.list.map(row => (row.kind === 'head'
          ? <text key={row.name} x={36} y={row.y} className={styles.group}>{row.name}</text>
          : (
              <g key={row.monitor.label}>
                <path d={`M22 ${row.y} L32 ${row.y}`} className={styles.link} />
                <Node x={32} y={row.y} width={322} labelX={66} monitor={row.monitor} live={live} />
              </g>
            )))}
      </svg>
    </div>
  );
}

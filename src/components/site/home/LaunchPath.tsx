'use client';

import { Laptop, ShoppingCart } from '@phosphor-icons/react';
import styles from './LaunchPath.module.css';

/*
 * Homepage hero illustration: the path from checkout to a working session.
 * A light travels plan → region → VPS → your computer; each station lights
 * up as it arrives. Motion is SVG SMIL on a handful of elements and stops
 * for reduced motion; the parent pauses it off screen.
 */

export type LaunchOs = 'windows' | 'linux';

const os = {
  windows: { logo: '/brand/windows.svg', name: 'Windows Server', client: 'Remote Desktop' },
  linux: { logo: '/brand/ubuntu.svg', name: 'Ubuntu Linux', client: 'SSH client' },
} as const;

type Point = [number, number];

const layouts = {
  wide: {
    width: 680,
    height: 430,
    plan: { x: 10, y: 50, w: 210 },
    region: [258, 214] as Point,
    core: [452, 214] as Point,
    coreR: 70,
    you: { x: 446, y: 338, w: 226 },
  },
  tall: {
    width: 360,
    height: 560,
    plan: { x: 75, y: 10, w: 210 },
    region: [92, 176] as Point,
    core: [212, 314] as Point,
    coreR: 62,
    you: { x: 67, y: 470, w: 226 },
  },
} as const;

type LayoutName = keyof typeof layouts;

const CYCLE = 6;
const TRAVEL = 0.78;

function geometry(name: LayoutName) {
  const g = layouts[name];
  const [rx, ry] = g.region;
  const [cx, cy] = g.core;
  const wide = name === 'wide';
  const planOut: Point = wide ? [g.plan.x + g.plan.w, g.plan.y + 24] : [g.plan.x + g.plan.w / 2, g.plan.y + 48];
  const regionIn: Point = [rx, ry - 26];
  const regionOut: Point = wide ? [rx + 26, ry] : [rx + 18, ry + 18];
  const coreIn: Point = wide ? [cx - g.coreR, cy] : [cx - g.coreR * 0.72, cy - g.coreR * 0.69];
  const coreOut: Point = wide ? [cx, cy + g.coreR] : [cx - g.coreR * 0.5, cy + g.coreR * 0.86];
  const youIn: Point = wide ? [g.you.x, g.you.y + 24] : [g.you.x + g.you.w / 2, g.you.y];

  /* Each leg is a cubic Bézier: start, two controls, end. */
  const legs: Array<[Point, Point, Point, Point]> = wide
    ? [
        [planOut, [planOut[0] + 44, planOut[1]], [rx, planOut[1] + 40], regionIn],
        [regionOut, [regionOut[0] + 30, regionOut[1]], [coreIn[0] - 30, coreIn[1]], coreIn],
        [coreOut, [cx, coreOut[1] + 50], [youIn[0] - 30, youIn[1]], youIn],
      ]
    : [
        [planOut, [planOut[0], planOut[1] + 50], [rx, regionIn[1] - 50], regionIn],
        [regionOut, [regionOut[0] + 40, regionOut[1] + 40], [coreIn[0] - 40, coreIn[1] - 30], coreIn],
        [coreOut, [coreOut[0] - 10, coreOut[1] + 40], [youIn[0], youIn[1] - 40], youIn],
      ];
  return { g, legs };
}

const fmt = ([x, y]: Point) => `${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`;
const toPath = ([p0, p1, p2, p3]: [Point, Point, Point, Point]) => `M${fmt(p0)} C${fmt(p1)} ${fmt(p2)} ${fmt(p3)}`;

function cubicLength([p0, p1, p2, p3]: [Point, Point, Point, Point]) {
  let length = 0;
  let previous = p0;
  for (let step = 1; step <= 64; step++) {
    const t = step / 64;
    const u = 1 - t;
    const point: Point = [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ];
    length += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
    previous = point;
  }
  return length;
}

const round = (value: number) => Math.round(value * 1000) / 1000;

function Scene({ name, system, region, from, prefix }: {
  name: LayoutName;
  system: LaunchOs;
  region: 'USA' | 'EU';
  from: string;
  prefix: string;
}) {
  const { g, legs } = geometry(name);
  const wide = name === 'wide';
  const paths = legs.map(toPath);
  const full = paths.join(' ');
  /* Arrival times along the trip, so each station lights as the light lands. */
  const lengths = legs.map(cubicLength);
  const total = lengths.reduce((sum, value) => sum + value, 0);
  const arrive = [
    round((lengths[0]! / total) * TRAVEL),
    round(((lengths[0]! + lengths[1]!) / total) * TRAVEL),
    TRAVEL,
  ];
  const timing = { dur: `${CYCLE}s`, repeatCount: 'indefinite' } as const;
  const light = (at: number) => ({
    values: '0;0;1;1;0',
    keyTimes: `0;${at};${round(at + 0.02)};0.97;1`,
  });
  const [rx, ry] = g.region;
  const [cx, cy] = g.core;
  const data = os[system];

  return (
    <svg viewBox={`0 0 ${g.width} ${g.height}`} className={styles.scene} data-layout={name} aria-hidden="true">
      <defs>
        <radialGradient id={`${prefix}-halo`}>
          <stop offset="0%" className={styles.haloInner} />
          <stop offset="60%" className={styles.haloMid} />
          <stop offset="100%" className={styles.haloOuter} />
        </radialGradient>
        <linearGradient id={`${prefix}-beam`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={g.width} y2={g.height}>
          <stop offset="0%" className={styles.stopPrimary} />
          <stop offset="100%" className={styles.stopGlow} />
        </linearGradient>
      </defs>

      <circle cx={cx} cy={cy} r={g.coreR + 120} fill={`url(#${prefix}-halo)`} />

      {paths.map(leg => (
        <g key={leg}>
          <path d={leg} className={styles.beamGlow} stroke={`url(#${prefix}-beam)`} />
          <path d={leg} className={styles.beam} stroke={`url(#${prefix}-beam)`} />
        </g>
      ))}

      {/* The traveller: a bright head with a soft trail. */}
      <g className={styles.traveller}>
        <circle r="9" className={styles.trail}>
          <animateMotion path={full} keyPoints="0;1;1" keyTimes={`0;${TRAVEL};1`} calcMode="linear" {...timing} />
        </circle>
        <circle r="4" className={styles.head}>
          <animateMotion path={full} keyPoints="0;1;1" keyTimes={`0;${TRAVEL};1`} calcMode="linear" {...timing} />
        </circle>
      </g>

      {/* Plan */}
      <g>
        <rect x={g.plan.x} y={g.plan.y} width={g.plan.w} height="48" rx="24" className={styles.pill} />
        <circle cx={g.plan.x + 24} cy={g.plan.y + 24} r="15" className={styles.pillIcon} />
        <ShoppingCart x={g.plan.x + 15} y={g.plan.y + 15} size={18} weight="duotone" className={styles.icon} />
        <text x={g.plan.x + 48} y={g.plan.y + 21} className={styles.name}>Pick a plan</text>
        <text x={g.plan.x + 48} y={g.plan.y + 37} className={styles.note}>{`from ${from}/mo`}</text>
      </g>

      {/* Region */}
      <g>
        <circle cx={rx} cy={ry} r="26" className={styles.node} />
        <circle cx={rx} cy={ry} r="26" className={styles.nodeLit} opacity="0">
          <animate attributeName="opacity" {...light(arrive[0]!)} {...timing} />
        </circle>
        <text x={rx} y={ry + 4} textAnchor="middle" className={styles.regionText}>{region}</text>
        <text x={wide ? rx : rx} y={ry + 46} textAnchor="middle" className={styles.note}>Region</text>
      </g>

      {/* VPS core */}
      <g>
        <circle cx={cx} cy={cy} r={g.coreR} className={styles.coreDisc} />
        <circle cx={cx} cy={cy} r={g.coreR} className={styles.coreRim} stroke={`url(#${prefix}-beam)`} />
        <circle cx={cx} cy={cy} r={g.coreR - 9} className={styles.coreInner} />
        <circle cx={cx} cy={cy} r={g.coreR} className={styles.coreRing} opacity="0">
          <animate attributeName="opacity" values="0;0;0.8;0;0" keyTimes={`0;${arrive[1]};${round(arrive[1]! + 0.01)};${round(arrive[1]! + 0.12)};1`} {...timing} />
          <animate attributeName="r" values={`${g.coreR};${g.coreR};${g.coreR};${g.coreR + 26};${g.coreR + 26}`} keyTimes={`0;${arrive[1]};${round(arrive[1]! + 0.01)};${round(arrive[1]! + 0.12)};1`} {...timing} />
        </circle>
        <image key={data.logo} href={data.logo} x={cx - g.coreR * 0.4} y={cy - g.coreR * 0.46} width={g.coreR * 0.8} height={g.coreR * 0.8} className={styles.logo} />
        <text x={cx} y={cy + g.coreR * 0.58} textAnchor="middle" className={styles.coreName}>{data.name}</text>
        <g className={styles.status} opacity="0">
          <animate attributeName="opacity" {...light(arrive[1]!)} {...timing} />
          <rect x={cx - 34} y={wide ? cy - g.coreR - 34 : cy - g.coreR - 30} width="68" height="22" rx="11" />
          <circle cx={cx - 20} cy={wide ? cy - g.coreR - 23 : cy - g.coreR - 19} r="3.5" />
          <text x={cx + 6} y={wide ? cy - g.coreR - 19 : cy - g.coreR - 15} textAnchor="middle">Online</text>
        </g>
      </g>

      {/* Your computer */}
      <g>
        <rect x={g.you.x} y={g.you.y} width={g.you.w} height="48" rx="24" className={styles.pill} />
        <rect x={g.you.x} y={g.you.y} width={g.you.w} height="48" rx="24" className={styles.pillLit} opacity="0">
          <animate attributeName="opacity" {...light(arrive[2]!)} {...timing} />
        </rect>
        <circle cx={g.you.x + 24} cy={g.you.y + 24} r="15" className={styles.pillIcon} />
        <Laptop x={g.you.x + 15} y={g.you.y + 15} size={18} weight="duotone" className={styles.icon} />
        <text x={g.you.x + 48} y={g.you.y + 21} className={styles.name}>Your computer</text>
        <text x={g.you.x + 48} y={g.you.y + 37} className={styles.note}>{`Connected · ${data.client}`}</text>
      </g>
    </svg>
  );
}

export function LaunchPath({ system, region, from }: { system: LaunchOs; region: 'USA' | 'EU'; from: string }) {
  return (
    <div className={styles.figure}>
      <Scene name="wide" system={system} region={region} from={from} prefix="launch-w" />
      <Scene name="tall" system={system} region={region} from={from} prefix="launch-t" />
    </div>
  );
}

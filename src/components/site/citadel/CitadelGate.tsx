'use client';

import type { Icon } from '@phosphor-icons/react';
import { Browser, Lightning, MagnifyingGlass, Robot } from '@phosphor-icons/react';
import { useEffect, useId, useRef, useState } from 'react';
import styles from './CitadelGate.module.css';

/*
 * Hero illustration: four kinds of HTTP traffic travel as light along beams
 * into the Citadel core. A beam's colour depends on where it is, not on what
 * sent it: every request is neutral until Citadel inspects it. Clean requests
 * pass through the core and leave as one bright beam to the origin; attacks
 * turn red, hit the core's edge and break apart. The traffic is simulated.
 *
 * Motion is SVG SMIL so comets, sparks, ripples and verdict flashes share one
 * clock without JavaScript timers. Reduced motion freezes a mid-flight frame.
 */

type Outcome = 'pass' | 'challenge' | 'limit';

type Lane = {
  name: string;
  request: string;
  icon: Icon;
  outcome: Outcome;
  comets: number;
  dur: number;
  offset: number;
};

const lanes: Lane[] = [
  { name: 'Visitor', request: 'GET /pricing', icon: Browser, outcome: 'pass', comets: 3, dur: 3.9, offset: 0 },
  { name: 'Search bot', request: 'GET /sitemap.xml', icon: MagnifyingGlass, outcome: 'pass', comets: 1, dur: 4.4, offset: 1.6 },
  { name: 'Headless bot', request: 'POST /login', icon: Robot, outcome: 'challenge', comets: 2, dur: 3.4, offset: 0.7 },
  { name: 'HTTP flood', request: 'GET /search?q=…', icon: Lightning, outcome: 'limit', comets: 4, dur: 2.2, offset: 0.25 },
];

/* Share of a pass comet's cycle spent travelling; the rest it is hidden. */
const PASS_TRAVEL = 0.9;
/* Share of a blocked comet's cycle before it hits the core. */
const BLOCK_HIT = 0.62;
/* A challenged request holds for this share of the cycle before it fails. */
const CHALLENGE_HOLD = 0.12;

type Point = [number, number];

const round = (value: number) => Math.round(value * 1000) / 1000;
const fmt = ([x, y]: Point) => `${round(x)} ${round(y)}`;
const distance = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);

function cubicLength(p0: Point, p1: Point, p2: Point, p3: Point) {
  let length = 0;
  let previous = p0;
  for (let step = 1; step <= 48; step++) {
    const t = step / 48;
    const u = 1 - t;
    const point: Point = [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ];
    length += distance(point, previous);
    previous = point;
  }
  return length;
}

/*
 * Two layouts: `wide` flows left to right beside the headline; `tall` flows
 * top to bottom on phones so the labels stay legible.
 */
const layouts = {
  wide: {
    viewBox: '0 0 640 470',
    core: [352, 222] as Point,
    radius: 56,
    origin: [526, 222] as Point,
    source: (index: number): Point => [150, [56, 164, 280, 388][index]!],
  },
  tall: {
    viewBox: '0 0 360 610',
    core: [180, 296] as Point,
    radius: 48,
    origin: [180, 478] as Point,
    source: (index: number): Point => [[45, 135, 225, 315][index]!, 108],
  },
} as const;

type LayoutName = keyof typeof layouts;

function beam(name: LayoutName, index: number) {
  const { core, radius, origin, source } = layouts[name];
  const start = source(index);
  const wide = name === 'wide';
  const c1: Point = wide ? [start[0] + 96, start[1]] : [start[0], start[1] + 74];
  const c2: Point = wide
    ? [core[0] - 70, core[1] + (start[1] - core[1]) * 0.3]
    : [core[0] + (start[0] - core[0]) * 0.3, core[1] - 66];
  const dx = c2[0] - core[0];
  const dy = c2[1] - core[1];
  const scale = (radius + 3) / Math.hypot(dx, dy);
  const edge: Point = [core[0] + dx * scale, core[1] + dy * scale];
  const curve = `M${fmt(start)} C${fmt(c1)} ${fmt(c2)} ${fmt(edge)}`;
  const laneLength = cubicLength(start, c1, c2, edge);
  const total = laneLength + distance(edge, core) + distance(core, origin);

  return {
    edge,
    lane: curve,
    full: `${curve} L${fmt(core)} L${fmt(origin)}`,
    /* Where on a pass beam the comet reaches the centre of the core. */
    coreAt: round(((laneLength + distance(edge, core)) / total) * PASS_TRAVEL),
  };
}

/* A comet: three stacked dashes with one shared head, plus a bright tip. */
function Comet({ path, gradient, begin, dur, travel, fade }: {
  path: string;
  gradient: string;
  begin: string;
  dur: string;
  travel: number;
  fade: [number, number];
}) {
  const layers = [
    { length: 34, className: styles.cometGlow },
    { length: 18, className: styles.cometBody },
    { length: 7, className: styles.cometCore },
  ];
  const timing = { begin, dur, repeatCount: 'indefinite' } as const;

  return (
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;1;0;0" keyTimes={`0;0.03;${fade[0]};${fade[1]};1`} {...timing} />
      {layers.map(layer => (
        <path
          key={layer.length}
          d={path}
          pathLength={100}
          className={layer.className}
          stroke={`url(#${gradient})`}
          strokeDasharray={`${layer.length} 200`}
          strokeDashoffset={layer.length}
        >
          <animate
            attributeName="stroke-dashoffset"
            values={`${layer.length};${layer.length - 100};${layer.length - 100}`}
            keyTimes={`0;${travel};1`}
            calcMode="linear"
            {...timing}
          />
        </path>
      ))}
      <circle r="3.2" className={styles.cometTip} fill={`url(#${gradient})`}>
        <animateMotion path={path} keyPoints="0;1;1" keyTimes={`0;${travel};1`} calcMode="linear" {...timing} />
      </circle>
    </g>
  );
}

/*
 * Effects that repeat once per comet. Comets in a lane are evenly staggered,
 * so one animation with period dur / comets lines up with every one of them.
 */
function periodic(lane: Lane, at: number) {
  const period = lane.dur / lane.comets;
  return { period, begin: `${round(lane.offset + at * lane.dur)}s`, dur: `${round(period)}s` };
}

function Sparks({ lane, at, point, core, tone }: { lane: Lane; at: number; point: Point; core: Point; tone: string }) {
  const { period, begin, dur } = periodic(lane, at);
  const end = round(Math.min(0.7, 0.42 / period));
  const angle = Math.atan2(point[1] - core[1], point[0] - core[0]);
  const spread = [-0.9, -0.45, 0, 0.45, 0.9];

  return (
    <g transform={`translate(${fmt(point)})`}>
      {spread.map((offset, index) => {
        const reach = 13 + (index % 2) * 7;
        const x = round(Math.cos(angle + offset) * reach);
        const y = round(Math.sin(angle + offset) * reach);
        return (
          <circle key={offset} r={index % 2 ? 1.6 : 2.2} className={styles.spark} data-tone={tone} opacity="0">
            <animate attributeName="opacity" values="0;1;0;0" keyTimes={`0;0.01;${end};1`} begin={begin} dur={dur} repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="translate" values={`0 0;${x} ${y};${x} ${y}`} keyTimes={`0;${end};1`} begin={begin} dur={dur} repeatCount="indefinite" />
          </circle>
        );
      })}
    </g>
  );
}

function Ripple({ lane, at, center, from, to, tone }: { lane: Lane; at: number; center: Point; from: number; to: number; tone: string }) {
  const { period, begin, dur } = periodic(lane, at);
  const end = round(Math.min(0.85, 0.6 / period));
  return (
    <circle cx={center[0]} cy={center[1]} r={from} className={styles.ripple} data-tone={tone} opacity="0">
      <animate attributeName="r" values={`${from};${to};${to}`} keyTimes={`0;${end};1`} begin={begin} dur={dur} repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;0.75;0;0" keyTimes={`0;0.01;${end};1`} begin={begin} dur={dur} repeatCount="indefinite" />
    </circle>
  );
}

function Scene({ name, prefix }: { name: LayoutName; prefix: string }) {
  const layout = layouts[name];
  const wide = name === 'wide';
  const { core, radius, origin } = layout;
  const id = (key: string) => `${prefix}-${name}-${key}`;
  const shapes = lanes.map((_, index) => beam(name, index));

  /* Colour by position: neutral on approach, then the verdict colour. */
  const span = wide
    ? { x1: 150, y1: 0, x2: origin[0], y2: 0, from: 150, to: origin[0], axis: 0 }
    : { x1: 0, y1: 108, x2: 0, y2: origin[1], from: 108, to: origin[1], axis: 1 };
  const stop = (value: number) => `${round(((value - span.from) / (span.to - span.from)) * 100)}%`;
  const coreAxis = core[span.axis]!;

  const tags = wide
    ? [
        { lane: 2, text: '403 · Challenge failed', x: core[0] - 76, y: core[1] + radius + 38, width: 152 },
        { lane: 3, text: '429 · Rate limited', x: core[0] - 64, y: core[1] + radius + 66, width: 128 },
      ]
    : [
        { lane: 2, text: '403 Blocked', x: core[0] - 132, y: core[1] + radius + 28, width: 96 },
        { lane: 3, text: '429 Limited', x: core[0] + 36, y: core[1] + radius + 28, width: 96 },
      ];

  return (
    <svg viewBox={layout.viewBox} className={styles.scene} data-layout={name} aria-hidden="true">
      <defs>
        <linearGradient id={id('pass')} gradientUnits="userSpaceOnUse" x1={span.x1} y1={span.y1} x2={span.x2} y2={span.y2}>
          <stop offset="0%" className={styles.stopNeutral} />
          <stop offset={stop(coreAxis - radius - 40)} className={styles.stopNeutral} />
          <stop offset={stop(coreAxis)} className={styles.stopPrimary} />
          <stop offset="100%" className={styles.stopGlow} />
        </linearGradient>
        <linearGradient id={id('block')} gradientUnits="userSpaceOnUse" x1={span.x1} y1={span.y1} x2={span.x2} y2={span.y2}>
          <stop offset="0%" className={styles.stopNeutral} />
          <stop offset={stop(coreAxis - radius - 90)} className={styles.stopNeutral} />
          <stop offset={stop(coreAxis - radius)} className={styles.stopBad} />
          <stop offset="100%" className={styles.stopBad} />
        </linearGradient>
        <linearGradient id={id('out')} gradientUnits="userSpaceOnUse" x1={span.x1} y1={span.y1} x2={span.x2} y2={span.y2}>
          <stop offset={stop(coreAxis)} className={styles.stopPrimary} />
          <stop offset="100%" className={styles.stopGlow} />
        </linearGradient>
        <radialGradient id={id('halo')}>
          <stop offset="0%" className={styles.haloInner} />
          <stop offset="55%" className={styles.haloMid} />
          <stop offset="100%" className={styles.haloOuter} />
        </radialGradient>
        <linearGradient id={id('sweep')} x1="1" y1="0.5" x2="0.4" y2="0">
          <stop offset="0%" className={styles.sweepStrong} />
          <stop offset="100%" className={styles.sweepClear} />
        </linearGradient>
        <clipPath id={id('clip')}>
          <circle cx={core[0]} cy={core[1]} r={radius - 8} />
        </clipPath>
        <linearGradient id={id('rim')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" className={styles.stopPrimary} />
          <stop offset="100%" className={styles.stopGlow} />
        </linearGradient>
      </defs>

      <circle cx={core[0]} cy={core[1]} r={radius + 120} fill={`url(#${id('halo')})`} />

      {/* Beam tracks with a constant stream of faint particles */}
      {shapes.map((shape, index) => {
        const lane = lanes[index]!;
        return (
          <g key={lane.name}>
            <path d={shape.lane} className={styles.track} />
            <path d={shape.lane} className={styles.stream} stroke={`url(#${id(lane.outcome === 'pass' ? 'pass' : 'block')})`}>
              <animate attributeName="stroke-dashoffset" values="0;-14" dur={`${round(0.5 + index * 0.08)}s`} repeatCount="indefinite" />
            </path>
          </g>
        );
      })}
      <path d={`M${fmt(core)} L${fmt(origin)}`} className={styles.laserGlow} stroke={`url(#${id('out')})`} />
      <path d={`M${fmt(core)} L${fmt(origin)}`} className={styles.outTrack} stroke={`url(#${id('out')})`} />
      <path d={`M${fmt(core)} L${fmt(origin)}`} className={styles.laserStream}>
        <animate attributeName="stroke-dashoffset" values="0;-18" dur="0.45s" repeatCount="indefinite" />
      </path>

      {/* Comets */}
      {lanes.map((lane, index) => {
        const shape = shapes[index]!;
        const pass = lane.outcome === 'pass';
        const hold = lane.outcome === 'challenge' ? CHALLENGE_HOLD : 0;
        return Array.from({ length: lane.comets }, (_, comet) => {
          const begin = `${round(lane.offset + (comet * lane.dur) / lane.comets)}s`;
          return pass
            ? <Comet key={begin} path={shape.full} gradient={id('pass')} begin={begin} dur={`${lane.dur}s`} travel={PASS_TRAVEL} fade={[0.86, PASS_TRAVEL]} />
            : <Comet key={begin} path={shape.lane} gradient={id('block')} begin={begin} dur={`${lane.dur}s`} travel={BLOCK_HIT} fade={[round(BLOCK_HIT + hold), round(BLOCK_HIT + hold + 0.06)]} />;
        });
      })}

      {/* Impacts and pass-through pulses */}
      {lanes.map((lane, index) => {
        const shape = shapes[index]!;
        if (lane.outcome === 'pass') {
          return (
            <g key={lane.name}>
              <Ripple lane={lane} at={shape.coreAt} center={core} from={radius} to={radius + 30} tone="pass" />
              <Ripple lane={lane} at={PASS_TRAVEL} center={origin} from={4} to={22} tone="pass" />
            </g>
          );
        }
        const hold = lane.outcome === 'challenge' ? CHALLENGE_HOLD : 0;
        return (
          <g key={lane.name}>
            {hold > 0 && <Ripple lane={lane} at={BLOCK_HIT} center={shape.edge} from={3} to={16} tone="challenge" />}
            <Sparks lane={lane} at={BLOCK_HIT + hold} point={shape.edge} core={core} tone="block" />
            <Ripple lane={lane} at={BLOCK_HIT + hold} center={core} from={radius} to={radius + 14} tone="block" />
          </g>
        );
      })}

      {/* Citadel core */}
      <g className={styles.core}>
        <circle cx={core[0]} cy={core[1]} r={radius + 4} className={styles.coreAura} stroke={`url(#${id('rim')})`}>
          <animate attributeName="opacity" values="0.35;0.8;0.35" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx={core[0]} cy={core[1]} r={radius} className={styles.coreDisc} />
        <circle cx={core[0]} cy={core[1]} r={radius} className={styles.coreRim} stroke={`url(#${id('rim')})`} />
        <circle cx={core[0]} cy={core[1]} r={radius - 8} className={styles.coreInner} />
        <g clipPath={`url(#${id('clip')})`}>
          <path
            d={`M${fmt(core)} L${core[0] + radius} ${core[1]} A${radius} ${radius} 0 0 0 ${round(core[0] + radius * Math.cos(-1.1))} ${round(core[1] + radius * Math.sin(-1.1))} Z`}
            fill={`url(#${id('sweep')})`}
          >
            <animateTransform attributeName="transform" type="rotate" values={`0 ${fmt(core)};360 ${fmt(core)}`} dur="3.6s" repeatCount="indefinite" />
          </path>
        </g>
        <image
          href="/brand/citadel-shield.svg"
          x={core[0] - radius * 0.52}
          y={core[1] - radius * 0.6}
          width={radius * 1.04}
          height={radius * 1.17}
        />
      </g>
      {wide
        ? <text x={core[0]} y={core[1] - radius - 16} textAnchor="middle" className={styles.coreLabel}>Citadel</text>
        : <text x={core[0] - radius - 14} y={core[1] + 4} textAnchor="end" className={styles.coreLabel}>Citadel</text>}

      {/* Verdicts flash each time their lane is stopped */}
      {tags.map((tag) => {
        const lane = lanes[tag.lane]!;
        const hold = lane.outcome === 'challenge' ? CHALLENGE_HOLD : 0;
        const { period, begin, dur } = periodic(lane, BLOCK_HIT + hold);
        const end = round(Math.min(0.9, 0.7 / period));
        return (
          <g key={tag.text} className={styles.tag}>
            <rect x={tag.x} y={tag.y} width={tag.width} height="22" rx="11" />
            <rect x={tag.x} y={tag.y} width={tag.width} height="22" rx="11" className={styles.tagFlash} opacity="0">
              <animate attributeName="opacity" values="0;1;0;0" keyTimes={`0;0.02;${end};1`} begin={begin} dur={dur} repeatCount="indefinite" />
            </rect>
            <text x={tag.x + tag.width / 2} y={tag.y + 15} textAnchor="middle">{tag.text}</text>
          </g>
        );
      })}

      {/* Sources */}
      {lanes.map((lane, index) => {
        const [sx, sy] = layout.source(index);
        const LaneIcon = lane.icon;
        const tone = lane.outcome === 'pass' ? 'pass' : 'block';
        return wide
          ? (
              <g key={lane.name}>
                <rect x="0" y={sy - 23} width="150" height="46" rx="23" className={styles.pill} />
                <circle cx="23" cy={sy} r="15" className={styles.pillIcon} data-tone={tone} />
                <LaneIcon x={14} y={sy - 9} size={18} weight="duotone" className={styles.icon} />
                <text x="46" y={sy - 3} className={styles.name}>{lane.name}</text>
                <text x="46" y={sy + 12} className={styles.request}>{lane.request}</text>
              </g>
            )
          : (
              <g key={lane.name}>
                <circle cx={sx} cy="34" r="22" className={styles.pill} />
                <circle cx={sx} cy="34" r="15" className={styles.pillIcon} data-tone={tone} />
                <LaneIcon x={sx - 9} y={25} size={18} weight="duotone" className={styles.icon} />
                <text x={sx} y="78" textAnchor="middle" className={styles.name}>{lane.name}</text>
                <text x={sx} y="93" textAnchor="middle" className={styles.request}>{lane.request.split(' ')[1]}</text>
              </g>
            );
      })}

      {/* Origin */}
      <g transform={wide ? `translate(${origin[0]} ${origin[1] - 44})` : `translate(${origin[0] - 66} ${origin[1]})`}>
        <rect width={wide ? 112 : 132} height="88" rx="18" className={styles.origin} />
        <rect x="14" y="14" width="30" height="30" rx="9" className={styles.originTile} />
        <Browser x={20} y={20} size={18} weight="duotone" className={styles.originIcon} />
        <text x="14" y="62" className={styles.name}>Your origin</text>
        <circle cx="18" cy="75" r="3.5" className={styles.okDot} />
        <text x="27" y="79" className={styles.note}>Clean only</text>
      </g>
    </svg>
  );
}

type Decision = { verdict: 'Pass' | 'Challenge' | 'Block' | 'Limit'; request: string; reason: string };

const decisions: Decision[] = [
  { verdict: 'Pass', request: 'GET /pricing', reason: 'Browser session verified' },
  { verdict: 'Limit', request: 'GET /search?q=…', reason: '429 · over the rate-limit preset' },
  { verdict: 'Challenge', request: 'POST /login', reason: 'JS challenge issued' },
  { verdict: 'Pass', request: 'GET /sitemap.xml', reason: 'Search crawler' },
  { verdict: 'Block', request: 'POST /login', reason: '403 · challenge failed, strike added' },
  { verdict: 'Limit', request: 'GET /search?q=…', reason: '429 · over the rate-limit preset' },
  { verdict: 'Pass', request: 'GET /assets/app.css', reason: 'Served from cache' },
  { verdict: 'Pass', request: 'POST /api/webhook', reason: 'Path allowlisted' },
];

const verdictTone = { Pass: 'pass', Challenge: 'challenge', Block: 'block', Limit: 'block' } as const;

export function CitadelGate() {
  const prefix = useId().replace(/[^a-z0-9]/gi, '');
  const root = useRef<HTMLElement>(null);
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const figure = root.current;
    if (!figure) {
      return;
    }
    const svgs = [...figure.querySelectorAll('svg')];
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;

    const apply = () => {
      const play = visible && !motion.matches && document.visibilityState === 'visible';
      for (const svg of svgs) {
        if (motion.matches) {
          /* A representative frozen frame: comets in flight and one impact. */
          svg.setCurrentTime(2.35);
        }
        if (play) {
          svg.unpauseAnimations();
        } else {
          svg.pauseAnimations();
        }
      }
      setRunning(play);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      apply();
    });
    observer.observe(figure);
    motion.addEventListener('change', apply);
    document.addEventListener('visibilitychange', apply);
    apply();

    return () => {
      observer.disconnect();
      motion.removeEventListener('change', apply);
      document.removeEventListener('visibilitychange', apply);
    };
  }, []);

  useEffect(() => {
    if (!running) {
      return;
    }
    const timer = window.setInterval(() => setTick(value => value + 1), 1400);
    return () => window.clearInterval(timer);
  }, [running]);

  const rows = Array.from({ length: 3 }, (_, row) => {
    const index = (((tick - row) % decisions.length) + decisions.length) % decisions.length;
    return { key: tick - row, ...decisions[index]! };
  });

  return (
    <figure ref={root} className={styles.figure} aria-labelledby={`${prefix}-caption`}>
      <div className={styles.stage}>
        <Scene name="wide" prefix={prefix} />
        <Scene name="tall" prefix={prefix} />
      </div>

      <div className={styles.log}>
        <div className={styles.logHead}>
          <span>Decision log</span>
          <span>Simulated requests</span>
        </div>
        <ol aria-hidden="true">
          {rows.map(row => (
            <li key={row.key} data-tone={verdictTone[row.verdict]}>
              <b>{row.verdict}</b>
              <code>{row.request}</code>
              <span>{row.reason}</span>
            </li>
          ))}
        </ol>
      </div>

      <figcaption id={`${prefix}-caption`} className={styles.caption}>
        Illustration of how Citadel handles requests: visitors and search crawlers pass through Citadel to the
        origin, a headless bot fails a JS challenge and is blocked with 403, and an HTTP flood is rate-limited with 429.
      </figcaption>
    </figure>
  );
}

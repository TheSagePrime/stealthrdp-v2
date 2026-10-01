'use client';

import type { Icon } from '@phosphor-icons/react';
import { Browser, Lightning, MagnifyingGlass, Robot } from '@phosphor-icons/react';
import { useEffect, useId, useRef, useState } from 'react';
import styles from './CitadelGate.module.css';

/*
 * Hero illustration: four kinds of HTTP traffic reach the Citadel edge.
 * Every request enters the same neutral colour, because attack traffic looks
 * normal until it is inspected. The gate classifies it: clean requests turn
 * blue and continue to the origin, the rest are challenged, rate-limited or
 * blocked at the edge. The traffic is simulated and labelled as such.
 *
 * Motion is SVG SMIL so every packet, ripple and colour change shares one
 * clock without JavaScript timers. Reduced motion freezes a mid-flight frame.
 */

type Outcome = 'pass' | 'challenge' | 'limit';

type Lane = {
  name: string;
  request: string;
  icon: Icon;
  outcome: Outcome;
  /* Verdict shown where a blocked lane stops; pass lanes visibly continue. */
  chip?: { wide: string; tall: string };
  packets: number;
  dur: number;
  offset: number;
};

const lanes: Lane[] = [
  { name: 'Visitor', request: 'GET /pricing', icon: Browser, outcome: 'pass', packets: 3, dur: 3.6, offset: 0 },
  { name: 'Search bot', request: 'GET /sitemap.xml', icon: MagnifyingGlass, outcome: 'pass', packets: 1, dur: 4.2, offset: 1.3 },
  { name: 'Headless bot', request: 'POST /login', icon: Robot, outcome: 'challenge', chip: { wide: '403 · Challenge failed', tall: 'Blocked' }, packets: 2, dur: 3.8, offset: 0.5 },
  { name: 'HTTP flood', request: 'GET /search?q=…', icon: Lightning, outcome: 'limit', chip: { wide: '429 · Rate limited', tall: 'Limited' }, packets: 6, dur: 2.4, offset: 0.2 },
];

/* Fraction of a blocked packet's cycle at which it reaches the gate. */
const arrive = { challenge: 0.55, limit: 0.62 } as const;

type Point = [number, number];

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
    length += Math.hypot(point[0] - previous[0], point[1] - previous[1]);
    previous = point;
  }
  return length;
}

const round = (value: number) => Math.round(value * 1000) / 1000;

/*
 * Two layouts share one drawing routine: `wide` flows left to right beside the
 * headline; `tall` flows top to bottom on phones so labels stay legible.
 */
const layouts = {
  wide: {
    viewBox: '0 0 600 440',
    lane: (index: number) => [84, 178, 272, 366][index]!,
    start: 164,
    gate: 340,
    gateHalf: 10,
    origin: [468, 200] as Point,
  },
  tall: {
    viewBox: '0 0 360 540',
    lane: (index: number) => [45, 135, 225, 315][index]!,
    start: 104,
    gate: 252,
    gateHalf: 10,
    origin: [180, 424] as Point,
  },
} as const;

type LayoutName = keyof typeof layouts;

function geometry(name: LayoutName, index: number) {
  const layout = layouts[name];
  const across = layout.lane(index);
  const through = layout.gate + layout.gateHalf + 2;
  const before = layout.gate - layout.gateHalf - 2;
  /* `pt` maps (along, across) into x/y for the chosen orientation. */
  const pt = (along: number, side: number): Point => (name === 'wide' ? [along, side] : [side, along]);
  const [ox, oy] = layout.origin;
  const originAlong = name === 'wide' ? ox : oy;
  const originAcross = name === 'wide' ? oy : ox;
  const bend = (originAlong - through) * 0.62;
  const c0 = pt(through, across);
  const c1 = pt(through + bend, across);
  const c2 = pt(originAlong - bend * 0.7, originAcross);
  const c3 = pt(originAlong, originAcross);
  const [sx, sy] = pt(layout.start, across);
  const [bx, by] = pt(before, across);
  const passPath = `M${sx} ${sy} L${c0[0]} ${c0[1]} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${c3[0]} ${c3[1]}`;
  const straight = through - layout.start;
  const total = straight + cubicLength(c0, c1, c2, c3);
  return {
    node: pt(layout.gate, across),
    stopPath: `M${sx} ${sy} L${bx} ${by}`,
    passPath,
    /* Share of a pass packet's trip spent before the gate. */
    passFraction: round((layout.gate - layout.start) / total),
  };
}

function Packets({ name, lane, index, prefix }: { name: LayoutName; lane: Lane; index: number; prefix: string }) {
  const shape = geometry(name, index);
  const pathId = `${prefix}-${name}-lane-${index}`;
  const pass = lane.outcome === 'pass';
  const hit = lane.outcome === 'pass' ? shape.passFraction : arrive[lane.outcome];
  const [nx, ny] = shape.node;

  return (
    <g>
      <path id={pathId} d={pass ? shape.passPath : shape.stopPath} className={styles.track} />
      {Array.from({ length: lane.packets }, (_, packet) => {
        const begin = `${round(lane.offset + (packet * lane.dur) / lane.packets)}s`;
        const dur = `${lane.dur}s`;
        const ripple = (at: number, tone: string) => (
          <circle cx={nx} cy={ny} r="7" className={styles.ripple} data-tone={tone} opacity="0">
            <animate attributeName="r" values="7;7;22;22" keyTimes={`0;${at};${round(at + 0.16)};1`} dur={dur} begin={begin} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0;0.7;0;0" keyTimes={`0;${at};${round(at + 0.01)};${round(at + 0.16)};1`} dur={dur} begin={begin} repeatCount="indefinite" />
          </circle>
        );

        return (
          <g key={begin}>
            {pass && ripple(hit, 'pass')}
            {lane.outcome === 'challenge' && ripple(hit, 'challenge')}
            {lane.outcome === 'challenge' && ripple(round(hit + 0.16), 'block')}
            {lane.outcome === 'limit' && ripple(hit, 'block')}

            <g opacity="0">
              <animateMotion
                dur={dur}
                begin={begin}
                repeatCount="indefinite"
                rotate="auto"
                calcMode="linear"
                {...(pass ? {} : { keyPoints: '0;1;1', keyTimes: `0;${hit};1` })}
              >
                <mpath href={`#${pathId}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0;0"
                keyTimes={pass ? '0;0.04;0.93;0.99;1' : `0;0.04;${round(hit + (lane.outcome === 'challenge' ? 0.2 : 0.04))};${round(hit + (lane.outcome === 'challenge' ? 0.3 : 0.14))};1`}
                dur={dur}
                begin={begin}
                repeatCount="indefinite"
              />
              <rect x="-9" y="-4" width="18" height="8" rx="4" className={styles.packet} />
              {pass && (
                <rect x="-9" y="-4" width="18" height="8" rx="4" className={styles.packetPass} opacity="0">
                  <animate attributeName="opacity" values="0;0;1;1" keyTimes={`0;${hit};${round(hit + 0.02)};1`} dur={dur} begin={begin} repeatCount="indefinite" />
                </rect>
              )}
              {lane.outcome === 'challenge' && (
                <rect x="-9" y="-4" width="18" height="8" rx="4" className={styles.packetChallenge} opacity="0">
                  <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes={`0;${hit};${round(hit + 0.02)};${round(hit + 0.16)};${round(hit + 0.18)};1`} dur={dur} begin={begin} repeatCount="indefinite" />
                </rect>
              )}
              {!pass && (
                <rect x="-9" y="-4" width="18" height="8" rx="4" className={styles.packetBlock} opacity="0">
                  <animate
                    attributeName="opacity"
                    values="0;0;1;1"
                    keyTimes={lane.outcome === 'challenge' ? `0;${round(hit + 0.16)};${round(hit + 0.18)};1` : `0;${hit};${round(hit + 0.02)};1`}
                    dur={dur}
                    begin={begin}
                    repeatCount="indefinite"
                  />
                </rect>
              )}
            </g>
          </g>
        );
      })}
    </g>
  );
}

function chipWidth(text: string) {
  return Math.round(text.length * 6.4 + 18);
}

function Scene({ name, prefix }: { name: LayoutName; prefix: string }) {
  const layout = layouts[name];
  const wide = name === 'wide';
  const [ox, oy] = layout.origin;

  return (
    <svg viewBox={layout.viewBox} className={styles.scene} data-layout={name} aria-hidden="true">
      {/* Gate */}
      {wide
        ? <rect x={layout.gate - layout.gateHalf} y="34" width={layout.gateHalf * 2} height="384" rx={layout.gateHalf} className={styles.gate} />
        : <rect x="8" y={layout.gate - layout.gateHalf} width="344" height={layout.gateHalf * 2} rx={layout.gateHalf} className={styles.gate} />}

      {lanes.map((lane, index) => (
        <Packets key={lane.name} name={name} lane={lane} index={index} prefix={prefix} />
      ))}

      {/* Gate nodes, chips and sources sit above the packets. */}
      {lanes.map((lane, index) => {
        const shape = geometry(name, index);
        const [nx, ny] = shape.node;
        const across = layout.lane(index);
        const label = lane.chip && (wide ? lane.chip.wide : lane.chip.tall);
        const width = label ? chipWidth(label) : 0;
        const chipX = wide ? layout.gate + layout.gateHalf + 10 : across - width / 2;
        const chipY = wide ? across - 10 : layout.gate + layout.gateHalf + 10;
        const LaneIcon = lane.icon;
        const tile = wide ? { x: 0, y: across - 20 } : { x: across - 20, y: 0 };

        return (
          <g key={lane.name}>
            <circle cx={nx} cy={ny} r="6" className={styles.node} data-tone={lane.outcome} />
            {label && (
              <g className={styles.chip}>
                <rect x={chipX} y={chipY} width={width} height="20" rx="10" />
                <text x={chipX + width / 2} y={chipY + 14} textAnchor="middle">{label}</text>
              </g>
            )}
            <rect x={tile.x} y={tile.y} width="40" height="40" rx="12" className={styles.tile} />
            <LaneIcon x={tile.x + 10} y={tile.y + 10} size={20} weight="duotone" className={styles.tileIcon} />
            {wide
              ? (
                  <>
                    <text x="52" y={across - 3} className={styles.name}>{lane.name}</text>
                    <text x="52" y={across + 14} className={styles.request}>{lane.request}</text>
                  </>
                )
              : (
                  <>
                    <text x={across} y="62" textAnchor="middle" className={styles.name}>{lane.name}</text>
                    <text x={across} y="78" textAnchor="middle" className={styles.request}>{lane.request.split(' ')[1]}</text>
                  </>
                )}
          </g>
        );
      })}

      {/* Citadel mark on the gate */}
      <g transform={wide ? `translate(${layout.gate} 225)` : `translate(180 ${layout.gate})`}>
        <circle r="31" className={styles.shieldDisc} />
        <image href="/brand/citadel-shield.svg" x="-18" y="-21" width="36" height="41" />
      </g>
      <text
        x={wide ? layout.gate : 180}
        y={wide ? 22 : layout.gate - 46}
        textAnchor="middle"
        className={styles.gateLabel}
      >
        Citadel edge
      </text>

      {/* Origin */}
      <g transform={wide ? `translate(${ox} ${oy - 50})` : `translate(${ox - 70} ${oy})`}>
        <rect width="140" height="100" rx="16" className={styles.origin} />
        <rect x="16" y="16" width="34" height="34" rx="10" className={styles.originTile} />
        <Browser x={23} y={23} size={20} weight="duotone" className={styles.originIcon} />
        <text x="16" y="70" className={styles.name}>Your origin</text>
        <circle cx="20" cy="84" r="3.5" className={styles.okDot} />
        <text x="29" y="88" className={styles.note}>Clean traffic only</text>
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
          /* A representative frozen frame: packets in flight and one verdict. */
          svg.setCurrentTime(2.3);
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

  const rows = Array.from({ length: 4 }, (_, row) => {
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
        Illustration of how Citadel handles requests: visitors and search crawlers pass to the origin,
        a headless bot fails a JS challenge and is blocked with 403, and an HTTP flood is rate-limited with 429.
      </figcaption>
    </figure>
  );
}

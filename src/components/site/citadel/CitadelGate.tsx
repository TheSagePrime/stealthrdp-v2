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
 * Static parts (tracks, core, labels) are SVG. Everything that moves is drawn
 * on one canvas from one requestAnimationFrame loop, so the animation causes
 * no style recalculation. It stops off screen and in background tabs, and
 * reduced motion draws one still frame.
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
/* The still frame drawn for reduced motion: comets in flight, one impact. */
const STILL_FRAME = 2.35;

type Point = [number, number];

const round = (value: number) => Math.round(value * 1000) / 1000;
const fmt = ([x, y]: Point) => `${round(x)} ${round(y)}`;
const distance = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/*
 * Two layouts: `wide` flows left to right beside the headline; `tall` flows
 * top to bottom on phones so the labels stay legible.
 */
const layouts = {
  wide: {
    width: 680,
    height: 470,
    core: [362, 222] as Point,
    radius: 56,
    origin: [522, 222] as Point,
    source: (index: number): Point => [160, [56, 164, 280, 388][index]!],
  },
  tall: {
    width: 360,
    height: 610,
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
  const lane = `M${fmt(start)} C${fmt(c1)} ${fmt(c2)} ${fmt(edge)}`;
  return { edge, lane, full: `${lane} L${fmt(core)} L${fmt(origin)}` };
}

/* Phase (0–1) of something that repeats every `period` seconds from `begin`. */
function cycle(time: number, begin: number, period: number) {
  return time < begin ? -1 : ((time - begin) % period) / period;
}

/* Opacity that ramps in over [0, inEnd], holds, then fades over [outStart, outEnd]. */
function envelope(phase: number, inEnd: number, outStart: number, outEnd: number) {
  if (phase < 0 || phase >= outEnd) {
    return 0;
  }
  if (phase < inEnd) {
    return phase / inEnd;
  }
  return phase < outStart ? 1 : 1 - (phase - outStart) / (outEnd - outStart);
}

type Rgb = [number, number, number];

function hex(value: string): Rgb {
  const match = value.trim().match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  return match ? [Number.parseInt(match[1]!, 16), Number.parseInt(match[2]!, 16), Number.parseInt(match[3]!, 16)] : [0, 0, 0];
}

const mix = (a: Rgb, b: Rgb, share: number): Rgb => [0, 1, 2].map(i => Math.round(a[i]! * share + b[i]! * (1 - share))) as Rgb;
const rgba = (c: Rgb, alpha = 1) => `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;

/* Theme tokens from global.css, read once so the canvas matches the SVG. */
function palette(element: Element) {
  const style = getComputedStyle(element);
  const token = (name: string) => hex(style.getPropertyValue(name));
  const primary = token('--primary');
  return {
    primary,
    glow: token('--citadel-glow'),
    bad: token('--status-bad'),
    warn: token('--status-warn'),
    surface: token('--citadel-surface'),
    neutral: mix(token('--citadel-muted'), primary, 0.72),
  };
}

/* Measures a path once so comet tips can follow it without the DOM. */
function sampler(d: string) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  const length = path.getTotalLength();
  const points: Point[] = Array.from({ length: 241 }, (_, step) => {
    const point = path.getPointAtLength((step / 240) * length);
    return [point.x, point.y];
  });
  const index = (share: number) => Math.round(Math.min(1, Math.max(0, share)) * 240);
  return {
    length,
    at: (share: number): Point => points[index(share)]!,
    /* Traces the part of the path between two shares as a short polyline. */
    trace: (context: CanvasRenderingContext2D, from: number, to: number) => {
      const first = index(from);
      const last = index(to);
      context.beginPath();
      context.moveTo(points[first]![0], points[first]![1]);
      for (let step = first + 1; step <= last; step++) {
        context.lineTo(points[step]![0], points[step]![1]);
      }
    },
  };
}

function useBeamCanvas(
  name: LayoutName,
  canvas: React.RefObject<HTMLCanvasElement | null>,
  flashes: React.RefObject<Array<SVGRectElement | null>>,
) {
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context) {
      return;
    }
    const layout = layouts[name];
    const wide = name === 'wide';
    const { core, radius, origin } = layout;
    const colors = palette(element);
    const shapes = lanes.map((_, index) => {
      const shape = beam(name, index);
      const lane = sampler(shape.lane);
      const full = sampler(shape.full);
      return {
        ...shape,
        lanePath: new Path2D(shape.lane),
        laneSampler: lane,
        fullSampler: full,
        /* Where on a pass beam the comet reaches the centre of the core. */
        coreShare: ((lane.length + distance(shape.edge, core)) / full.length) * PASS_TRAVEL,
      };
    });
    const laser = new Path2D(`M${fmt(core)} L${fmt(origin)}`);

    /* Colour by position along the flow axis. */
    const axis = wide ? 0 : 1;
    const from = wide ? 160 : 108;
    const to = origin[axis];
    const at = (value: number) => Math.min(1, Math.max(0, (value - from) / (to - from)));
    const gradient = () => (wide ? context.createLinearGradient(from, 0, to, 0) : context.createLinearGradient(0, from, 0, to));
    const pass = gradient();
    pass.addColorStop(0, rgba(colors.neutral));
    pass.addColorStop(at(core[axis] - radius - 40), rgba(colors.neutral));
    pass.addColorStop(at(core[axis]), rgba(colors.primary));
    pass.addColorStop(1, rgba(colors.glow));
    const block = gradient();
    block.addColorStop(0, rgba(colors.neutral));
    block.addColorStop(at(core[axis] - radius - 90), rgba(colors.neutral));
    block.addColorStop(at(core[axis] - radius), rgba(colors.bad));
    block.addColorStop(1, rgba(colors.bad));
    const out = gradient();
    out.addColorStop(at(core[axis]), rgba(colors.primary));
    out.addColorStop(1, rgba(colors.glow));

    let scale = 1;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = element.clientWidth;
      if (!width) {
        return;
      }
      scale = (width / layout.width) * ratio;
      element.width = Math.round(width * ratio);
      element.height = Math.round((width / layout.width) * layout.height * ratio);
    };

    const stroke = (path: Path2D, style: CanvasGradient, width: number, alpha: number, dash: number[], offset: number) => {
      context.globalAlpha = alpha;
      context.strokeStyle = style;
      context.lineWidth = width;
      context.setLineDash(dash);
      context.lineDashOffset = offset;
      context.stroke(path);
    };

    const ring = (center: Point, r: number, color: Rgb, alpha: number) => {
      context.globalAlpha = alpha;
      context.strokeStyle = rgba(color);
      context.lineWidth = 1.75;
      context.setLineDash([]);
      context.beginPath();
      context.arc(center[0], center[1], r, 0, Math.PI * 2);
      context.stroke();
    };

    /* A comet: stacked strokes that share one head (a soft glow, a body and
       a bright core), plus a tip with a light outline. Each is a short
       polyline, so the cost does not grow with the beam's length. */
    const comet = (path: ReturnType<typeof sampler>, share: number, style: CanvasGradient, alpha: number) => {
      context.setLineDash([]);
      context.strokeStyle = style;
      for (const [dash, width, layer] of [[38, 15, 0.14], [26, 8, 0.3], [18, 4.5, 0.75], [8, 2.4, 1]] as const) {
        context.globalAlpha = alpha * layer;
        context.lineWidth = width;
        path.trace(context, share - dash / path.length, share);
        context.stroke();
      }
      const [x, y] = path.at(share);
      context.globalAlpha = alpha;
      context.fillStyle = style;
      context.strokeStyle = rgba(colors.surface);
      context.lineWidth = 1.2;
      context.beginPath();
      context.arc(x, y, 3.2, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    };

    const draw = (time: number) => {
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, layout.width, layout.height);
      context.lineCap = 'round';

      /* Everything that travels is hidden inside the core disc. */
      context.save();
      context.beginPath();
      context.rect(0, 0, layout.width, layout.height);
      context.arc(core[0], core[1], radius, 0, Math.PI * 2);
      context.clip('evenodd');

      shapes.forEach((shape, index) => {
        const style = lanes[index]!.outcome === 'pass' ? pass : block;
        stroke(shape.lanePath, style, 2, 0.4, [0.01, 7], -((time * (28 + index * 3)) % 7));
      });
      stroke(laser, out, 2, 0.9, [0.01, 9], -((time * 40) % 9));

      shapes.forEach((shape, index) => {
        const lane = lanes[index]!;
        const hold = lane.outcome === 'challenge' ? CHALLENGE_HOLD : 0;
        for (let k = 0; k < lane.comets; k++) {
          const phase = cycle(time, lane.offset + (k * lane.dur) / lane.comets, lane.dur);
          if (phase < 0) {
            continue;
          }
          if (lane.outcome === 'pass') {
            const share = Math.min(1, phase / PASS_TRAVEL);
            const alpha = envelope(phase, 0.03, 0.86, PASS_TRAVEL);
            if (alpha > 0) {
              comet(shape.fullSampler, share, pass, alpha);
            }
          } else {
            const share = Math.min(1, phase / BLOCK_HIT);
            const alpha = envelope(phase, 0.03, BLOCK_HIT + hold, BLOCK_HIT + hold + 0.06);
            if (alpha > 0) {
              comet(shape.laneSampler, share, block, alpha);
            }
          }
        }
      });
      context.restore();

      /* Pass-through pulses, origin arrivals, challenges, impacts and sparks.
         Comets in a lane are evenly staggered, so one effect with period
         dur / comets lines up with every one of them. */
      shapes.forEach((shape, index) => {
        const lane = lanes[index]!;
        const period = lane.dur / lane.comets;
        const progress = (share: number, seconds: number) => {
          const phase = cycle(time, lane.offset + share * lane.dur, period);
          const end = Math.min(0.85, seconds / period);
          return phase < 0 || phase > end ? -1 : phase / end;
        };

        if (lane.outcome === 'pass') {
          const through = progress(shape.coreShare, 0.6);
          if (through >= 0) {
            ring(core, radius + 30 * through, colors.glow, 0.75 * (1 - through));
          }
          const arrival = progress(PASS_TRAVEL, 0.6);
          if (arrival >= 0) {
            ring(wide ? [origin[0] + 23, origin[1]] : [origin[0], origin[1] + 22], 15 + 15 * arrival, colors.glow, 0.75 * (1 - arrival));
          }
          return;
        }

        const hold = lane.outcome === 'challenge' ? CHALLENGE_HOLD : 0;
        if (hold) {
          const challenge = progress(BLOCK_HIT, 0.6);
          if (challenge >= 0) {
            ring(shape.edge, 3 + 13 * challenge, colors.warn, 0.75 * (1 - challenge));
          }
        }
        const impact = progress(BLOCK_HIT + hold, 0.6);
        if (impact >= 0) {
          ring(core, radius + 14 * impact, colors.bad, 0.75 * (1 - impact));
        }
        const burst = progress(BLOCK_HIT + hold, 0.42);
        if (burst >= 0) {
          const angle = Math.atan2(shape.edge[1] - core[1], shape.edge[0] - core[0]);
          context.globalAlpha = 1 - burst;
          context.fillStyle = rgba(colors.bad);
          [-0.9, -0.45, 0, 0.45, 0.9].forEach((spread, spark) => {
            const reach = (13 + (spark % 2) * 7) * burst;
            context.beginPath();
            context.arc(
              shape.edge[0] + Math.cos(angle + spread) * reach,
              shape.edge[1] + Math.sin(angle + spread) * reach,
              spark % 2 ? 1.6 : 2.2,
              0,
              Math.PI * 2,
            );
            context.fill();
          });
        }

        /* Verdict tags flash in the SVG; only write when the value changes. */
        const flash = flashes.current?.[index - 2];
        if (flash) {
          const lit = progress(BLOCK_HIT + hold, 0.7);
          const opacity = lit >= 0 ? (1 - lit).toFixed(2) : '0';
          if (flash.getAttribute('opacity') !== opacity) {
            flash.setAttribute('opacity', opacity);
          }
        }
      });

      /* Core: a breathing aura around the disc and a sweep inside it. */
      const breath = 0.35 + 0.45 * (0.5 - 0.5 * Math.cos((time / 2.8) * Math.PI * 2));
      const aura = context.createRadialGradient(core[0], core[1], radius - 2, core[0], core[1], radius + 18);
      aura.addColorStop(0, rgba(colors.glow, 0.5 * breath));
      aura.addColorStop(1, rgba(colors.glow, 0));
      context.globalAlpha = 1;
      context.fillStyle = aura;
      context.beginPath();
      context.arc(core[0], core[1], radius + 18, 0, Math.PI * 2);
      context.arc(core[0], core[1], radius, 0, Math.PI * 2, true);
      context.fill();

      if ('createConicGradient' in context) {
        const sweep = context.createConicGradient(((time / 3.6) % 1) * Math.PI * 2, core[0], core[1]);
        sweep.addColorStop(0, rgba(colors.glow, 0.34));
        sweep.addColorStop(0.17, rgba(colors.glow, 0));
        sweep.addColorStop(1, rgba(colors.glow, 0));
        context.fillStyle = sweep;
        context.beginPath();
        context.arc(core[0], core[1], radius - 8, 0, Math.PI * 2);
        context.fill();
      }
    };

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let visible = false;
    let clock = STILL_FRAME;
    let last = 0;
    /* Slow devices drop to about 30 fps when a frame takes too long to draw. */
    let cost = 0;
    let skip = false;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (cost > 9) {
        skip = !skip;
        if (skip) {
          return;
        }
      }
      /* Cap a frame's step so a long stall does not skip the animation ahead. */
      clock += last ? Math.min(now - last, 100) / 1000 : 0;
      last = now;
      const start = performance.now();
      draw(clock);
      cost = cost * 0.9 + (performance.now() - start) * 0.1;
    };

    const update = () => {
      cancelAnimationFrame(frame);
      last = 0;
      resize();
      /* The layout hidden by CSS has no width and never draws. */
      if (!element.clientWidth) {
        return;
      }
      if (motion.matches) {
        draw(STILL_FRAME);
      } else if (visible && document.visibilityState === 'visible') {
        frame = requestAnimationFrame(tick);
      } else {
        draw(clock);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      update();
    });
    observer.observe(element);
    const sizer = new ResizeObserver(update);
    sizer.observe(element);
    motion.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizer.disconnect();
      motion.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, [name, canvas, flashes]);
}

function Scene({ name, prefix }: { name: LayoutName; prefix: string }) {
  const layout = layouts[name];
  const wide = name === 'wide';
  const { core, radius, origin } = layout;
  const id = (key: string) => `${prefix}-${name}-${key}`;
  const canvas = useRef<HTMLCanvasElement>(null);
  const flashes = useRef<Array<SVGRectElement | null>>([]);
  useBeamCanvas(name, canvas, flashes);

  const viewBox = `0 0 ${layout.width} ${layout.height}`;
  const outAxis = wide
    ? { x1: core[0], y1: 0, x2: origin[0], y2: 0 }
    : { x1: 0, y1: core[1], x2: 0, y2: origin[1] };

  const tags = wide
    ? [
        { text: '403 · Challenge failed', x: core[0] - 76, y: core[1] + radius + 38, width: 152 },
        { text: '429 · Rate limited', x: core[0] - 64, y: core[1] + radius + 66, width: 128 },
      ]
    : [
        { text: '403 Blocked', x: core[0] - 132, y: core[1] + radius + 28, width: 96 },
        { text: '429 Limited', x: core[0] + 36, y: core[1] + radius + 28, width: 96 },
      ];

  return (
    <div className={styles.scene} data-layout={name}>
      {/* Back layer: light, tracks and the core body */}
      <svg viewBox={viewBox} className={styles.back} aria-hidden="true">
        <defs>
          <radialGradient id={id('halo')}>
            <stop offset="0%" className={styles.haloInner} />
            <stop offset="55%" className={styles.haloMid} />
            <stop offset="100%" className={styles.haloOuter} />
          </radialGradient>
          <linearGradient id={id('out')} gradientUnits="userSpaceOnUse" {...outAxis}>
            <stop offset="0%" className={styles.stopPrimary} />
            <stop offset="100%" className={styles.stopGlow} />
          </linearGradient>
        </defs>
        <circle cx={core[0]} cy={core[1]} r={radius + 120} fill={`url(#${id('halo')})`} />
        {lanes.map((lane, index) => (
          <path key={lane.name} d={beam(name, index).lane} className={styles.track} />
        ))}
        <path d={`M${fmt(core)} L${fmt(origin)}`} className={styles.laserGlow} stroke={`url(#${id('out')})`} />
        <path d={`M${fmt(core)} L${fmt(origin)}`} className={styles.outTrack} stroke={`url(#${id('out')})`} />
        <circle cx={core[0]} cy={core[1]} r={radius} className={styles.coreDisc} />
        <circle cx={core[0]} cy={core[1]} r={radius - 8} className={styles.coreInner} />
      </svg>

      <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />

      {/* Front layer: rim, shield, verdict tags, sources and origin */}
      <svg viewBox={viewBox} className={styles.front} aria-hidden="true">
        <defs>
          <linearGradient id={id('rim')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" className={styles.stopPrimary} />
            <stop offset="100%" className={styles.stopGlow} />
          </linearGradient>
        </defs>
        <circle cx={core[0]} cy={core[1]} r={radius} className={styles.coreRim} stroke={`url(#${id('rim')})`} />
        <image
          href="/brand/citadel-shield.svg"
          x={core[0] - radius * 0.52}
          y={core[1] - radius * 0.6}
          width={radius * 1.04}
          height={radius * 1.17}
        />
        {wide
          ? <text x={core[0]} y={core[1] - radius - 16} textAnchor="middle" className={styles.coreLabel}>Citadel</text>
          : <text x={core[0] - radius - 14} y={core[1] + 4} textAnchor="end" className={styles.coreLabel}>Citadel</text>}

        {tags.map((tag, index) => (
          <g key={tag.text} className={styles.tag}>
            <rect x={tag.x} y={tag.y} width={tag.width} height="22" rx="11" />
            <rect
              ref={(node) => {
                flashes.current[index] = node;
              }}
              x={tag.x}
              y={tag.y}
              width={tag.width}
              height="22"
              rx="11"
              className={styles.tagFlash}
              opacity="0"
            />
            <text x={tag.x + tag.width / 2} y={tag.y + 15} textAnchor="middle">{tag.text}</text>
          </g>
        ))}

        {lanes.map((lane, index) => {
          const [sx, sy] = layout.source(index);
          const LaneIcon = lane.icon;
          return wide
            ? (
                <g key={lane.name}>
                  <rect x="0" y={sy - 23} width="160" height="46" rx="23" className={styles.pill} />
                  <circle cx="23" cy={sy} r="15" className={styles.pillIcon} />
                  <LaneIcon x={14} y={sy - 9} size={18} weight="duotone" className={styles.icon} />
                  <text x="46" y={sy - 3} className={styles.name}>{lane.name}</text>
                  <text x="46" y={sy + 12} className={styles.request}>{lane.request}</text>
                </g>
              )
            : (
                <g key={lane.name}>
                  <circle cx={sx} cy="34" r="22" className={styles.pill} />
                  <circle cx={sx} cy="34" r="15" className={styles.pillIcon} />
                  <LaneIcon x={sx - 9} y={25} size={18} weight="duotone" className={styles.icon} />
                  <text x={sx} y="78" textAnchor="middle" className={styles.name}>{lane.name}</text>
                  <text x={sx} y="93" textAnchor="middle" className={styles.request}>{lane.request.split(' ')[1]}</text>
                </g>
              );
        })}

        {/* Origin: mirrors the sources; the beam lands on its icon. */}
        {wide
          ? (
              <g transform={`translate(${origin[0]} ${origin[1]})`}>
                <rect x="0" y="-23" width="150" height="46" rx="23" className={styles.origin} />
                <circle cx="23" cy="0" r="15" className={styles.originTile} />
                <Browser x={14} y={-9} size={18} weight="duotone" className={styles.originIcon} />
                <text x="46" y="-3" className={styles.name}>Your origin</text>
                <circle cx="50" cy="10" r="3" className={styles.okDot} />
                <text x="58" y="14" className={styles.note}>Clean traffic</text>
              </g>
            )
          : (
              <g transform={`translate(${origin[0]} ${origin[1] + 22})`}>
                <circle r="22" className={styles.origin} />
                <circle r="15" className={styles.originTile} />
                <Browser x={-9} y={-9} size={18} weight="duotone" className={styles.originIcon} />
                <text y="44" textAnchor="middle" className={styles.name}>Your origin</text>
                <circle cx="-38" cy="56" r="3" className={styles.okDot} />
                <text x="-30" y="60" className={styles.note}>Clean traffic</text>
              </g>
            )}
      </svg>
    </div>
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

  /* The log only advances while the figure is on screen and motion is allowed. */
  useEffect(() => {
    const figure = root.current;
    if (!figure) {
      return;
    }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const apply = () => setRunning(visible && !motion.matches && document.visibilityState === 'visible');
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      apply();
    });
    observer.observe(figure);
    motion.addEventListener('change', apply);
    document.addEventListener('visibilitychange', apply);
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
        <p className={styles.logHead}>Decision log</p>
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
        How Citadel handles requests: visitors and search crawlers pass through Citadel to the
        origin, a headless bot fails a JS challenge and is blocked with 403, and an HTTP flood is rate-limited with 429.
      </figcaption>
    </figure>
  );
}

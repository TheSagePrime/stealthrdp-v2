import type { Icon } from '@phosphor-icons/react';
import type { Plan } from '@/lib/stealth/content';
import {
  GlobeHemisphereEast,
  GlobeHemisphereWest,
  LinuxLogo,
  ShieldCheck,
  UserCircle,
  WindowsLogo,
} from '@phosphor-icons/react/dist/ssr';
import styles from './AboutMap.module.css';

/*
 * Hero visual for /about: what StealthRDP is made of, as one core with its
 * parts around it. Region prices and the plan count come from the live
 * catalogue. Static SVG with SMIL comets, so it needs no client JavaScript.
 */

type Part = { name: string; note: string; icon: Icon };

function parts(plans: Plan[]): Part[] {
  const from = (region: Plan['location']) => {
    const prices = plans.filter(plan => plan.location === region).map(plan => plan.pricing.monthly.amount);
    return prices.length ? `From €${Math.min(...prices).toFixed(2)}/mo` : 'Plans listed per region';
  };
  return [
    { name: 'USA region', note: from('USA'), icon: GlobeHemisphereWest },
    { name: 'Windows Server', note: '2019 · 2022 · 2025', icon: WindowsLogo },
    { name: 'Citadel', note: 'Layer 7 DDoS shield', icon: ShieldCheck },
    { name: 'EU region', note: from('EU'), icon: GlobeHemisphereEast },
    { name: 'Linux', note: 'Ubuntu, Debian +3', icon: LinuxLogo },
    { name: 'Client area', note: 'Billing and tickets', icon: UserCircle },
  ];
}

const WIDTH = 186;
const HEIGHT = 52;

function Satellite({ part, x, y, width }: { part: Part; x: number; y: number; width: number }) {
  const Glyph = part.icon;
  return (
    <g>
      <rect x={x} y={y - HEIGHT / 2} width={width} height={HEIGHT} rx={HEIGHT / 2} className={styles.pill} />
      <circle cx={x + 26} cy={y} r="17" className={styles.pillIcon} />
      <Glyph x={x + 15} y={y - 11} size={22} weight="duotone" className={styles.icon} />
      <text x={x + 52} y={y - 3} className={styles.name}>{part.name}</text>
      <text x={x + 52} y={y + 14} className={styles.note}>{part.note}</text>
    </g>
  );
}

function Core({ x, y, r, count, id }: { x: number; y: number; r: number; count: number; id: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" className={styles.haloInner} />
          <stop offset="100%" className={styles.haloOuter} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r + 100} fill={`url(#${id})`} />
      <circle cx={x} cy={y} r={r + 8} className={styles.aura} />
      <circle cx={x} cy={y} r={r} className={styles.disc} />
      <circle cx={x} cy={y} r={r - 8} className={styles.inner} />
      <circle cx={x} cy={y} r={r} className={styles.pulse} />
      <text x={x} y={y + 2} textAnchor="middle" className={styles.coreName}>StealthRDP</text>
      <text x={x} y={y + 19} textAnchor="middle" className={styles.coreNote}>{`${count} live plans`}</text>
    </g>
  );
}

function Comet({ d, index }: { d: string; index: number }) {
  return (
    <circle r="3.2" className={styles.comet}>
      <animateMotion path={d} dur="2.6s" begin={`${index * 0.43}s`} repeatCount="indefinite" />
    </circle>
  );
}

export function AboutMap({ plans }: { plans: Plan[] }) {
  const list = parts(plans);

  /* Wide: three parts on each side of the core. */
  const core = { x: 300, y: 200, r: 56 };
  const wide = list.map((part, index) => {
    const left = index < 3;
    const y = 80 + (index % 3) * 120;
    const x = left ? 0 : 600 - WIDTH;
    const edge = left ? WIDTH : 600 - WIDTH;
    const start = left ? core.x - core.r : core.x + core.r;
    const mid = (start + edge) / 2;
    return { part, x, y, d: `M${start} ${core.y} C${mid} ${core.y} ${mid} ${y} ${edge} ${y}` };
  });

  /* Tall: core on top, a spine down the middle, parts in two columns. */
  const top = { x: 180, y: 70, r: 48 };
  const tallWidth = 162;
  const tall = list.map((part, index) => {
    const column = index % 2;
    const x = column ? 360 - tallWidth : 0;
    const y = 200 + Math.floor(index / 2) * 76;
    const edge = column ? 360 - tallWidth : tallWidth;
    return { part, x, y, d: `M${top.x} ${top.y + top.r} L${top.x} ${y} L${edge} ${y}` };
  });

  return (
    <div className={styles.figure}>
      <svg viewBox="0 0 600 400" className={styles.scene} data-layout="wide" aria-hidden="true">
        {wide.map((item, index) => (
          <g key={item.part.name}>
            <path d={item.d} className={styles.link} />
            <Comet d={item.d} index={index} />
          </g>
        ))}
        <Core {...core} count={plans.length} id="about-halo-wide" />
        {wide.map(item => <Satellite key={item.part.name} part={item.part} x={item.x} y={item.y} width={WIDTH} />)}
      </svg>

      <svg viewBox="0 0 360 400" className={styles.scene} data-layout="tall" aria-hidden="true">
        {tall.map((item, index) => (
          <g key={item.part.name}>
            <path d={item.d} className={styles.link} />
            <Comet d={item.d} index={index} />
          </g>
        ))}
        <Core {...top} count={plans.length} id="about-halo-tall" />
        {tall.map(item => <Satellite key={item.part.name} part={item.part} x={item.x} y={item.y} width={tallWidth} />)}
      </svg>
    </div>
  );
}

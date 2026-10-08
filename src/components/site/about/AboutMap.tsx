import type { AboutCopy } from '@/content/i18n/en/about';
import type { Plan } from '@/lib/stealth/content';
import { osLogos } from '@/config/os-logos';
import styles from './AboutMap.module.css';

/*
 * Hero visual for /about: what StealthRDP is made of, as one core with its
 * parts around it. Region prices and the plan count come from the live
 * catalogue. Static SVG with SMIL comets, so it needs no client JavaScript.
 */

/* Each part's artwork: the country flags, the panel's Windows mark, our Linux and Citadel marks, and a Fluent icon. */
type Part = { name: string; note: string; icon: string };
type MapWords = AboutCopy['map'];

function parts(plans: Plan[], t: MapWords): Part[] {
  const from = (region: Plan['location']) => {
    const prices = plans.filter(plan => plan.location === region).map(plan => plan.pricing.monthly.amount);
    return prices.length ? t.from(Math.min(...prices)) : t.noPlans;
  };
  return [
    { name: t.usa, note: from('USA'), icon: '/images/flags/us-circle.svg' },
    { name: 'Windows Server', note: '2019 · 2022 · 2025', icon: osLogos.windows },
    { name: 'Citadel', note: t.citadelNote, icon: '/brand/citadel-shield.svg' },
    { name: t.eu, note: from('EU'), icon: '/images/flags/nl-circle.svg' },
    { name: 'Linux', note: t.linuxNote, icon: '/brand/linux.svg' },
    { name: t.clientArea, note: t.clientAreaNote, icon: '/images/fluent-color/receipt.svg' },
  ];
}

const WIDTH = 186;
const HEIGHT = 52;

function Satellite({ part, x, y, width }: { part: Part; x: number; y: number; width: number }) {
  return (
    <g>
      <rect x={x} y={y - HEIGHT / 2} width={width} height={HEIGHT} rx={HEIGHT / 2} className={styles.pill} />
      <circle cx={x + 26} cy={y} r="17" className={styles.pillIcon} />
      <image href={part.icon} x={x + 14} y={y - 12} width={24} height={24} preserveAspectRatio="xMidYMid meet" />
      <text x={x + 52} y={y - 3} className={styles.name}>{part.name}</text>
      <text x={x + 52} y={y + 14} className={styles.note}>{part.note}</text>
    </g>
  );
}

function Core({ x, y, r, note, id }: { x: number; y: number; r: number; note: string; id: string }) {
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
      <text x={x} y={y + 19} textAnchor="middle" className={styles.coreNote}>{note}</text>
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

export function AboutMap({ plans, words }: { plans: Plan[]; words: MapWords }) {
  const list = parts(plans, words);

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
        <Core {...core} note={words.livePlans(plans.length)} id="about-halo-wide" />
        {wide.map(item => <Satellite key={item.part.name} part={item.part} x={item.x} y={item.y} width={WIDTH} />)}
      </svg>

      <svg viewBox="0 0 360 400" className={styles.scene} data-layout="tall" aria-hidden="true">
        {tall.map((item, index) => (
          <g key={item.part.name}>
            <path d={item.d} className={styles.link} />
            <Comet d={item.d} index={index} />
          </g>
        ))}
        <Core {...top} note={words.livePlans(plans.length)} id="about-halo-tall" />
        {tall.map(item => <Satellite key={item.part.name} part={item.part} x={item.x} y={item.y} width={tallWidth} />)}
      </svg>
    </div>
  );
}

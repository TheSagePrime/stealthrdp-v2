'use client';

import type { SiteLocale } from '@/config/i18n';
import type { OsCopy } from '@/content/i18n/en/os';
import { Laptop } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { osCopy } from '@/content/i18n/os';
import styles from './OsSession.module.css';

/*
 * Hero illustration for the OS pages: your computer holds a session with a
 * VPS. Input travels to the server on one beam, the screen or shell comes
 * back on the other. The core shows the operating systems listed on the page
 * and the region pills take turns, because both are chosen per order.
 * Motion is CSS transforms and opacity only; reduced motion stops it.
 */

type Kind = 'windows' | 'linux' | 'plans';

/* An image may override how you connect to it; /plans mixes Windows and Linux. */
type Image = { label: string; logo: string; client?: string; session?: string; access?: string };

function sessionContent(t: OsCopy['session']): Record<Kind, { client: string; session: string; access: string; images: Image[]; facts: string[] }> {
  return {
    windows: {
      client: t.windows.client,
      session: t.windows.session,
      access: 'Administrator',
      images: [
        { label: 'Windows Server 2019', logo: '/brand/windows.png' },
        { label: 'Windows Server 2022', logo: '/brand/windows.png' },
        { label: 'Windows Server 2025', logo: '/brand/windows.png' },
      ],
      facts: t.facts,
    },
    linux: {
      client: t.linux.client,
      session: t.linux.session,
      access: 'root',
      images: [
        { label: 'Ubuntu 24.04 LTS', logo: '/brand/ubuntu.png' },
        { label: 'Debian 13', logo: '/brand/debian.png' },
        { label: 'AlmaLinux 10', logo: '/brand/almalinux.png' },
        { label: 'Fedora 44', logo: '/brand/fedora.png' },
        { label: 'CentOS Stream 9', logo: '/brand/centos.png' },
      ],
      facts: t.facts,
    },
    plans: {
      client: t.windows.client,
      session: t.windows.session,
      access: 'Administrator',
      images: [
        { label: 'Windows Server', logo: '/brand/windows.png' },
        { label: t.linuxImage, logo: '/brand/linux.svg', client: t.linux.client, session: t.linux.session, access: 'root' },
      ],
      facts: t.facts,
    },
  };
}

const regions = ['USA', 'EU'] as const;

/* Pill width for an 11.5px label. */
const factWidth = (text: string) => Math.round(text.length * 6.5 + 28);

function useCycle(length: number, ms: number, root: React.RefObject<Element | null>) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const element = root.current;
    if (!element) {
      return;
    }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;
    let visible = false;
    const apply = () => {
      window.clearInterval(timer);
      if (visible && !motion.matches && document.visibilityState === 'visible') {
        timer = window.setInterval(() => setIndex(value => (value + 1) % length), ms);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      apply();
    });
    observer.observe(element);
    motion.addEventListener('change', apply);
    document.addEventListener('visibilitychange', apply);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      motion.removeEventListener('change', apply);
      document.removeEventListener('visibilitychange', apply);
    };
  }, [length, ms, root]);
  return index;
}

function Core({ x, y, r, image, access, prefix, signedInAs, labelBelow = false }: {
  x: number;
  y: number;
  r: number;
  labelBelow?: boolean;
  image: Image;
  access: string;
  prefix: string;
  signedInAs: string;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 110} fill={`url(#${prefix}-halo)`} />
      <circle cx={x} cy={y} r={r + 10} className={styles.aura} />
      <circle cx={x} cy={y} r={r} className={styles.disc} />
      <circle cx={x} cy={y} r={r} className={styles.rim} stroke={`url(#${prefix}-rim)`} />
      <circle cx={x} cy={y} r={r - 9} className={styles.inner} />
      <circle cx={x} cy={y} r={r} className={styles.pulse} />
      <image key={image.logo} href={image.logo} x={x - r * 0.42} y={y - r * 0.42} width={r * 0.84} height={r * 0.84} className={styles.logo} />
      <text key={image.label} x={x} y={labelBelow ? y + r + 28 : y - r - 18} textAnchor="middle" className={styles.version}>{image.label}</text>
      <text x={x} y={labelBelow ? y + r + 50 : y + r + 26} textAnchor="middle" className={styles.access}>
        {signedInAs}
        {' '}
        <tspan className={styles.accessUser}>{access}</tspan>
      </text>
    </g>
  );
}

function Comets({ axis, from, to, at, direction, count, prefix }: {
  axis: 'x' | 'y';
  from: number;
  to: number;
  at: number;
  direction: 'in' | 'out';
  count: number;
  prefix: string;
}) {
  /* A comet is drawn where its trip starts and moved with a transform. Its
     tail gradient uses the comet's own coordinates, so it moves with it. */
  const start = direction === 'in' ? from : to;
  const travel = direction === 'in' ? to - from : from - to;
  const tail = 30 * Math.sign(travel);
  const line = axis === 'x'
    ? { x1: start - tail, y1: at, x2: start, y2: at }
    : { x1: at, y1: start - tail, x2: at, y2: start };
  const tip = axis === 'x' ? { cx: start, cy: at } : { cx: at, cy: start };
  const id = `${prefix}-${direction}-${axis}`;

  return (
    <g className={styles.comets}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" {...line}>
          <stop offset="0%" className={direction === 'in' ? styles.stopPrimaryClear : styles.stopGlowClear} />
          <stop offset="100%" className={direction === 'in' ? styles.stopPrimary : styles.stopGlow} />
        </linearGradient>
      </defs>
      {Array.from({ length: count }, (_, index) => (
        <g

          key={index}
          className={styles.comet}
          data-axis={axis}
          style={{ '--travel': `${travel}px`, '--delay': `${(index * 2.4) / count}s` } as React.CSSProperties}
        >
          <line {...line} className={styles.cometTail} stroke={`url(#${id})`} />
          <circle {...tip} r="3.4" className={styles.cometTip} data-tone={direction} />
        </g>
      ))}
    </g>
  );
}

function Defs({ prefix }: { prefix: string }) {
  return (
    <defs>
      <radialGradient id={`${prefix}-halo`}>
        <stop offset="0%" className={styles.haloInner} />
        <stop offset="55%" className={styles.haloMid} />
        <stop offset="100%" className={styles.haloOuter} />
      </radialGradient>
      <linearGradient id={`${prefix}-rim`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" className={styles.stopPrimary} />
        <stop offset="100%" className={styles.stopGlow} />
      </linearGradient>
    </defs>
  );
}

/* `imageIndex` lets a caller pick the image, so the homepage hero shows Windows or Linux in step with its headline. */
export function OsSession({ kind, imageIndex, locale = 'en' }: { kind: Kind; imageIndex?: number; locale?: SiteLocale }) {
  const t = osCopy[locale].session;
  const data = sessionContent(t)[kind];
  const root = useRef<HTMLDivElement>(null);
  const cycledIndex = useCycle(imageIndex === undefined ? data.images.length : 1, 2600, root);
  const regionIndex = useCycle(regions.length, 3900, root);
  const image = data.images[imageIndex ?? cycledIndex]!;
  const region = regions[regionIndex]!;
  const client = image.client ?? data.client;
  const session = image.session ?? data.session;
  const access = image.access ?? data.access;

  return (
    <div ref={root} className={styles.figure}>
      {/* Wide: computer on the left, VPS core on the right. */}
      <svg viewBox="0 0 680 430" className={styles.scene} data-layout="wide" aria-hidden="true">
        <Defs prefix={`${kind}-w`} />
        <line x1="182" y1="196" x2="352" y2="196" className={styles.track} />
        <line x1="182" y1="214" x2="352" y2="214" className={styles.track} />
        <Comets axis="x" from={182} to={352} at={196} direction="in" count={3} prefix={`${kind}-w`} />
        <Comets axis="x" from={182} to={352} at={214} direction="out" count={4} prefix={`${kind}-w`} />
        <g className={styles.chip}>
          <rect x="216" y="152" width="102" height="24" rx="12" />
          <text x="267" y="168" textAnchor="middle">{session}</text>
        </g>

        <g>
          <rect x="6" y="177" width="176" height="56" rx="28" className={styles.pill} />
          <circle cx="36" cy="205" r="18" className={styles.pillIcon} />
          <Laptop x={25} y={194} size={22} weight="duotone" className={styles.icon} />
          <text x="62" y="201" className={styles.name}>{t.computer}</text>
          <text x="62" y="218" className={styles.note}>{client}</text>
        </g>

        <Core x={420} y={205} r={66} image={image} access={access} prefix={`${kind}-w`} signedInAs={t.signedInAs} />

        {data.facts.map((fact, index) => {
          const y = 150 + index * 55;
          return (
            <g key={fact}>
              <path d={`M486 205 C506 205 506 ${y} 522 ${y}`} className={styles.link} />
              <g className={styles.fact}>
                <rect x="522" y={y - 16} width={factWidth(fact)} height="32" rx="16" />
                <text x={522 + factWidth(fact) / 2} y={y + 5} textAnchor="middle">{fact}</text>
              </g>
            </g>
          );
        })}

        {regions.map((item, index) => (
          <g key={item} className={styles.region} data-active={item === region || undefined}>
            <rect x={364 + index * 62} y="350" width="52" height="28" rx="14" />
            <text x={390 + index * 62} y="369" textAnchor="middle">{item}</text>
          </g>
        ))}
        <text x="420" y="404" textAnchor="middle" className={styles.note}>{t.regionNote}</text>
      </svg>

      {/* Tall: computer on top, VPS core below, for phones. */}
      <svg viewBox="0 0 360 590" className={styles.scene} data-layout="tall" aria-hidden="true">
        <Defs prefix={`${kind}-t`} />
        <line x1="171" y1="76" x2="171" y2="200" className={styles.track} />
        <line x1="189" y1="76" x2="189" y2="200" className={styles.track} />
        <Comets axis="y" from={76} to={200} at={171} direction="in" count={3} prefix={`${kind}-t`} />
        <Comets axis="y" from={76} to={200} at={189} direction="out" count={4} prefix={`${kind}-t`} />
        <g className={styles.chip}>
          <rect x="204" y="118" width="102" height="24" rx="12" />
          <text x="255" y="134" textAnchor="middle">{session}</text>
        </g>

        <g>
          <rect x="92" y="20" width="176" height="56" rx="28" className={styles.pill} />
          <circle cx="122" cy="48" r="18" className={styles.pillIcon} />
          <Laptop x={111} y={37} size={22} weight="duotone" className={styles.icon} />
          <text x="148" y="44" className={styles.name}>{t.computer}</text>
          <text x="148" y="61" className={styles.note}>{client}</text>
        </g>

        <Core x={180} y={262} r={58} image={image} access={access} prefix={`${kind}-t`} signedInAs={t.signedInAs} labelBelow />

        {data.facts.map((fact, index) => {
          /* Two on the first row, one centred below. */
          const row = index < 2 ? 0 : 1;
          const first = factWidth(data.facts[0]!);
          const width = factWidth(fact);
          const x = row
            ? 180 - width / 2
            : index === 0
              ? 180 - (first + factWidth(data.facts[1]!) + 8) / 2
              : 180 - (first + width + 8) / 2 + first + 8;
          return (
            <g key={fact} className={styles.fact}>
              <rect x={x} y={392 + row * 40} width={width} height="32" rx="16" />
              <text x={x + width / 2} y={413 + row * 40} textAnchor="middle">{fact}</text>
            </g>
          );
        })}

        {regions.map((item, index) => (
          <g key={item} className={styles.region} data-active={item === region || undefined}>
            <rect x={124 + index * 62} y="492" width="52" height="28" rx="14" />
            <text x={150 + index * 62} y="511" textAnchor="middle">{item}</text>
          </g>
        ))}
        <text x="180" y="546" textAnchor="middle" className={styles.note}>{t.regionNote}</text>
      </svg>
    </div>
  );
}

'use client';
import type { LaunchOs } from './home/LaunchPath';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LaunchPath } from './home/LaunchPath';
import styles from './HomeHero.module.css';

type OsMode = LaunchOs;

const systems = {
  windows: { name: 'Windows', title: 'Windows VPS' },
  linux: { name: 'Linux', title: 'Linux VPS' },
} as const;

/* One launch-path cycle in LaunchPath; the OS and region change between cycles. */
const CYCLE_MS = 6000;

export function HomeHero({ from }: { from: number }) {
  const [mode, setMode] = useState<OsMode>('windows');
  const [pinned, setPinned] = useState(false);
  const [region, setRegion] = useState<'USA' | 'EU'>('USA');
  const showcaseRef = useRef<HTMLElement>(null);
  const system = systems[mode];
  const price = `€${from.toFixed(2)}`;

  /* Animate only while the hero is on screen, the tab is visible and motion is allowed. */
  useEffect(() => {
    const element = showcaseRef.current;
    if (!element) {
      return;
    }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let timer = 0;
    let tick = 0;
    const apply = () => {
      const play = visible && !motion.matches && document.visibilityState === 'visible';
      for (const svg of element.querySelectorAll('svg')) {
        if (play) {
          svg.unpauseAnimations();
        } else {
          svg.pauseAnimations();
        }
      }
      window.clearInterval(timer);
      if (play) {
        timer = window.setInterval(() => {
          tick += 1;
          if (!pinned) {
            setMode(current => (current === 'windows' ? 'linux' : 'windows'));
          }
          if (tick % 2 === 0) {
            setRegion(current => (current === 'USA' ? 'EU' : 'USA'));
          }
        }, CYCLE_MS);
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
  }, [pinned]);

  const choose = (next: OsMode) => {
    setPinned(true);
    setMode(next);
  };

  return (
    <section className={styles.hero} aria-label="Windows and Linux VPS">
      <div className={styles.heroGrid}>
        <div className={styles.copy}>
          <span className={styles.badge}>Windows &amp; Linux VPS · Instant setup</span>
          <h1>
            {`Your ${system.name} VPS. `}
            <span>Live in 60 seconds.</span>
          </h1>
          <p className={styles.lede}>
            {`High-performance ${mode === 'windows' ? 'remote desktop' : 'Linux server'} infrastructure without the complexity. Enterprise hardware, full administrative access, and 24/7 uptime monitoring.`}
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryButton} href="#plans">
              Choose your server
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className={styles.secondaryButton} href="https://dash.stealthrdp.com/submitticket.php">Ask a pre-sales question</Link>
          </div>
          <div className={styles.meta} aria-label="Plan benefits">
            <span>
              {'Starting from '}
              <strong>{`${price}/month`}</strong>
            </span>
            <span>7-day refund as credit</span>
            <span>No hidden fees</span>
            <span>Cancel anytime</span>
          </div>
        </div>
        <section ref={showcaseRef} className={styles.showcase} aria-label={`${system.title}: from checkout to a connected session`}>
          <div className={styles.osToggle} role="group" aria-label="Operating system">
            {(['windows', 'linux'] as const).map(item => (
              <button key={item} type="button" aria-pressed={mode === item} onClick={() => choose(item)}>
                {systems[item].name}
              </button>
            ))}
          </div>
          <LaunchPath system={mode} region={region} from={price} />
          <Link className={styles.explore} href="/plans">
            {`Explore ${system.name} VPS`}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </section>
  );
}

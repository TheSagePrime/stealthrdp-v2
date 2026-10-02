'use client';
import { ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './HomeHero.module.css';
import { OsSession } from './os/OsSession';

type OsMode = 'windows' | 'linux';

const systems = {
  windows: { name: 'Windows', title: 'Windows VPS' },
  linux: { name: 'Linux', title: 'Linux VPS' },
} as const;

/* The headline and the animation show Windows and Linux in turn. */
const CYCLE_MS = 6000;

export function HomeHero({ from }: { from: number }) {
  const [mode, setMode] = useState<OsMode>('windows');
  const showcaseRef = useRef<HTMLDivElement>(null);
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
    const apply = () => {
      const play = visible && !motion.matches && document.visibilityState === 'visible';
      window.clearInterval(timer);
      if (play) {
        timer = window.setInterval(() => {
          setMode(current => (current === 'windows' ? 'linux' : 'windows'));
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
  }, []);

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
            <span>24/7 support</span>
            <span>No hidden fees</span>
            <span>Cancel anytime</span>
          </div>
        </div>
        <div ref={showcaseRef} className={styles.showcase}>
          <OsSession kind="plans" imageIndex={mode === 'windows' ? 0 : 1} />
        </div>
      </div>
    </section>
  );
}

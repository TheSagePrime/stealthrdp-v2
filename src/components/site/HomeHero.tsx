'use client';
import type { SiteLocale } from '@/config/i18n';
import { ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { homeCopy } from '@/content/i18n/home';
import styles from './HomeHero.module.css';
import { OsSession } from './os/OsSession';

type OsMode = 'windows' | 'linux';

const systems = {
  windows: { name: 'Windows', title: 'Windows VPS' },
  linux: { name: 'Linux', title: 'Linux VPS' },
} as const;

/* The headline and the animation show Windows and Linux in turn. */
const CYCLE_MS = 6000;

export function HomeHero({ from, locale = 'en' }: { from: number; locale?: SiteLocale }) {
  const t = homeCopy[locale].hero;
  const [mode, setMode] = useState<OsMode>('windows');
  const showcaseRef = useRef<HTMLDivElement>(null);
  const system = systems[mode];
  const price = t.price(from);

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
    <section className={styles.hero} aria-label={t.aria}>
      <div className={styles.heroGrid}>
        <div className={styles.copy}>
          <span className={styles.badge}>{t.badge}</span>
          <h1>
            {t.title(system.name)}
            <span>{t.titleSpan}</span>
          </h1>
          <p className={styles.lede}>
            {t.lede(mode)}
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryButton} href="#plans">
              {t.choose}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className={styles.secondaryButton} href="https://dash.stealthrdp.com/submitticket.php">{t.presales}</Link>
          </div>
          <div className={styles.meta} aria-label={t.metaAria}>
            <span>
              {t.startingFrom}
              <strong>{t.perMonth(price)}</strong>
            </span>
            {t.benefits.map(benefit => <span key={benefit}>{benefit}</span>)}
          </div>
        </div>
        <div ref={showcaseRef} className={styles.showcase}>
          <OsSession kind="plans" imageIndex={mode === 'windows' ? 0 : 1} locale={locale} />
        </div>
      </div>
    </section>
  );
}

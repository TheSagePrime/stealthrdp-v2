'use client';
import { ArrowClockwise, ArrowRight, ArrowsLeftRight, ArrowUpRight, Check, CheckCircle, Lightning, Monitor, TerminalWindow } from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './HomeHero.module.css';

type OsMode = 'windows' | 'linux';
type Phase = 0 | 1 | 2;
const systems = {
  windows: { name: 'Windows', title: 'Windows VPS', mark: '/brand/windows.svg', connection: 'Remote desktop ready', icon: Monitor },
  linux: { name: 'Linux', title: 'Linux VPS', mark: '/brand/ubuntu.svg', connection: 'SSH access ready', icon: TerminalWindow },
} as const;

export function HomeHero() {
  const [mode, setMode] = useState<OsMode>('windows');
  const [phase, setPhase] = useState<Phase>(2);
  const [run, setRun] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const showcaseRef = useRef<HTMLElement>(null);
  const system = systems[mode];
  const nextSystem = systems[mode === 'windows' ? 'linux' : 'windows'];
  const ConnectionIcon = system.icon;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduceMotion(query.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState === 'visible');
    updateMotion();
    updateVisibility();
    query.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { threshold: 0.15 });
    if (showcaseRef.current) {
      observer.observe(showcaseRef.current);
    }
    return () => {
      query.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || !inView || !pageVisible) {
      return;
    }
    const interval = window.setInterval(() => setMode(current => current === 'windows' ? 'linux' : 'windows'), 6800);
    return () => window.clearInterval(interval);
  }, [reduceMotion, inView, pageVisible]);

  useEffect(() => {
    if (reduceMotion || !inView || !pageVisible) {
      setPhase(2);
      return;
    }
    setPhase(0);
    const deploying = window.setTimeout(setPhase, 1100, 1);
    const ready = window.setTimeout(setPhase, 3100, 2);
    return () => {
      window.clearTimeout(deploying);
      window.clearTimeout(ready);
    };
  }, [mode, run, reduceMotion, inView, pageVisible]);

  const changeMode = () => setMode(current => current === 'windows' ? 'linux' : 'windows');

  return (
    <section className={styles.hero} aria-label="Windows and Linux VPS">
      <div className={styles.heroGrid}>
        <div className={styles.copy}>
          <span className={styles.badge}>Windows &amp; Linux VPS · Instant setup</span>
          <h1>
            Your
            {system.name}
            {' '}
            VPS.
            <span>Live in 60 seconds.</span>
          </h1>
          <p className={styles.lede}>
            High-performance
            {mode === 'windows' ? 'remote desktop' : 'Linux server'}
            {' '}
            infrastructure without the complexity. Enterprise hardware, full administrative access, and a 99.9% uptime SLA.
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
              Starting from
              <strong>€4.59/month</strong>
            </span>
            <span>7-day money-back</span>
            <span>No hidden fees</span>
            <span>Cancel anytime</span>
          </div>
        </div>
        <section ref={showcaseRef} className={styles.showcase} aria-label={`${system.title} deployment preview`} data-phase={phase} data-reduced-motion={reduceMotion}>
          <div className={styles.scene}>
            <div className={styles.serverArt} key={run}>
              <Image src="/hero/server-stack.jpg" alt="" width={640} height={640} priority draggable={false} />
            </div>
            <button key={mode} className={styles.osIdentity} type="button" aria-label={`Switch to ${nextSystem.title}`} title={`Switch to ${nextSystem.title}`} onClick={changeMode}>
              <span className={styles.osMark}><Image src={system.mark} alt="" width={36} height={36} /></span>
              <strong>{system.title}</strong>
              <span className={styles.switchHint} aria-hidden="true"><ArrowsLeftRight size={17} weight="bold" /></span>
            </button>
          </div>
          <div className={styles.deployment}>
            <div className={styles.deploymentHeading}>
              <span className={styles.deploymentTitle}>
                <Lightning size={18} weight="fill" aria-hidden="true" />
                From
                {' '}
                {system.name}
                {' '}
                setup to ready.
              </span>
              <button type="button" className={styles.replay} onClick={() => setRun(value => value + 1)} disabled={reduceMotion} aria-label="Replay deployment animation">
                <ArrowClockwise size={16} aria-hidden="true" />
                <span>Replay</span>
              </button>
            </div>
            <ol className={styles.steps} aria-label="Example deployment steps">
              {['Choose your OS', 'Deploy your VPS', 'Connect & go'].map((label, index) => (
                <li key={label} data-state={phase > index ? 'complete' : phase === index ? 'active' : 'waiting'}>
                  <span className={styles.stepLine} aria-hidden="true"><span /></span>
                  <span className={styles.stepLabel}>
                    <span className={styles.stepNumber}>{phase > index || phase === 2 ? <Check size={13} weight="bold" aria-hidden="true" /> : `0${index + 1}`}</span>
                    {label}
                  </span>
                </li>
              ))}
            </ol>
            <div className={styles.readyStatus} data-ready={phase === 2}>
              <ConnectionIcon size={19} weight="duotone" aria-hidden="true" />
              <strong>{phase === 2 ? system.connection : 'Preparing your connection'}</strong>
              <CheckCircle size={19} weight="fill" aria-hidden="true" />
            </div>
            <p className={styles.srOnly} role="status">
              {system.title}
              {' '}
              selected.
              {' '}
              {phase === 2 ? system.connection : phase === 0 ? 'Choosing operating system.' : 'Deploying example server.'}
            </p>
          </div>
          <Link className={styles.explore} href="/plans">
            Explore
            {system.name}
            {' '}
            VPS
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </section>
  );
}

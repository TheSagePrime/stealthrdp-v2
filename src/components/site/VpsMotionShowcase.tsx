'use client';

import { ArrowClockwise, ArrowUpRight, Check, CheckCircle, Cpu, GlobeHemisphereWest, HardDrives, Key, Lightning, Monitor, TerminalWindow } from '@phosphor-icons/react';
import { useEffect, useId, useRef, useState } from 'react';
import styles from './VpsMotionShowcase.module.css';

type Mode = 'windows' | 'linux';
type Phase = 0 | 1 | 2;

const systems = {
  windows: { name: 'Windows', title: 'Windows VPS', mark: '/brand/windows.svg', access: 'Administrator access', connection: 'Remote desktop ready', icon: Monitor },
  linux: { name: 'Linux', title: 'Linux VPS', mark: '/brand/ubuntu.svg', access: 'Full root access', connection: 'SSH access ready', icon: TerminalWindow },
} as const;

/** A short illustrative deployment. No live infrastructure data or network calls. */
export function VpsMotionShowcase({ className = '', productBaseUrl = '', reduceMotion = false }: { className?: string; productBaseUrl?: string; reduceMotion?: boolean }) {
  const [mode, setMode] = useState<Mode>('windows');
  const [phase, setPhase] = useState<Phase>(2);
  const [run, setRun] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const reducedMotion = reduceMotion || prefersReducedMotion;
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const rootRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const system = systems[mode];
  const ConnectionIcon = system.icon;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    const updateVisibility = () => setPageVisible(document.visibilityState === 'visible');
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    if (rootRef.current) observer.observe(rootRef.current);
    return () => {
      query.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', updateVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !inView || !pageVisible) {
      setPhase(2);
      return;
    }
    setPhase(0);
    const provision = window.setTimeout(() => setPhase(1), 1100);
    const ready = window.setTimeout(() => setPhase(2), 3200);
    return () => { window.clearTimeout(provision); window.clearTimeout(ready); };
  }, [mode, run, reducedMotion, inView, pageVisible]);

  return (
    <section ref={rootRef} className={`${styles.showcase} ${className}`} aria-labelledby={titleId} data-phase={phase} data-reduced-motion={reducedMotion}>
      <div className={styles.topline}>
        <span className={styles.kicker}><span />Built around you</span>
        <span className={styles.demoLabel}>Deployment preview</span>
      </div>

      <div className={styles.switcher} role="group" aria-label="Preview operating system">
        {(Object.keys(systems) as Mode[]).map(key => (
          <button key={key} type="button" aria-pressed={mode === key} onClick={() => setMode(key)} className={styles.osButton}>
            <img src={systems[key].mark} alt="" width="20" height="20" />
            {systems[key].name}
            <Check size={14} weight="bold" className={styles.selectedCheck} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className={styles.scene}>
        <div className={styles.serverArt} key={`${mode}-${run}`}>
          <img src="/hero/server-stack.png" alt="" width="1280" height="1280" fetchPriority="high" draggable="false" />
        </div>

        <div className={styles.osIdentity} key={mode}>
          <span className={styles.osMark}><img src={system.mark} alt="" width="32" height="32" /></span>
          <div><span className={styles.smallLabel}>Your own space.</span><h2 id={titleId}>{system.title}</h2></div>
        </div>

        <div className={`${styles.annotation} ${styles.compute}`}>
          <Cpu size={24} weight="duotone" aria-hidden="true" />
          <div><strong>Dedicated resources</strong><span>Room to do more.</span></div>
        </div>
        <div className={`${styles.annotation} ${styles.storage}`}>
          <HardDrives size={24} weight="duotone" aria-hidden="true" />
          <div><strong>NVMe storage</strong><span>Built for speed.</span></div>
        </div>

        <div className={styles.connection} data-ready={phase === 2}>
          <span className={styles.connectionIcon}><ConnectionIcon size={22} weight="duotone" aria-hidden="true" /></span>
          <div><span className={styles.smallLabel}>From wherever you are</span><strong>{phase === 2 ? system.connection : 'Preparing your connection'}</strong></div>
          <CheckCircle className={styles.connectionCheck} size={21} weight="fill" aria-hidden="true" />
        </div>
      </div>

      <div className={styles.details}>
        <span><Key size={17} weight="duotone" aria-hidden="true" />{system.access}</span>
        <span><GlobeHemisphereWest size={17} weight="duotone" aria-hidden="true" />USA & Europe</span>
      </div>

      <div className={styles.deployment}>
        <div className={styles.deploymentHeading}>
          <span className={styles.deploymentTitle}><Lightning size={17} weight="fill" aria-hidden="true" />From setup to ready.</span>
          <button type="button" className={styles.replay} onClick={() => setRun(value => value + 1)} disabled={reducedMotion} aria-label="Replay deployment animation"><ArrowClockwise size={16} aria-hidden="true" /><span>Replay</span></button>
        </div>
        <ol className={styles.steps} aria-label="Example deployment steps">
          {['Choose your OS', 'Deploy your VPS', 'Connect & go'].map((label, index) => (
            <li key={label} data-state={phase > index ? 'complete' : phase === index ? 'active' : 'waiting'}>
              <span className={styles.stepLine} aria-hidden="true"><span /></span>
              <span className={styles.stepLabel}><span className={styles.stepNumber}>{phase > index || phase === 2 ? <Check size={12} weight="bold" aria-hidden="true" /> : `0${index + 1}`}</span>{label}</span>
            </li>
          ))}
        </ol>
        <p className={styles.srOnly} role="status">{system.title} selected. {reducedMotion ? 'Deployment illustration ready.' : phase === 2 ? 'Example deployment complete. Ready to connect.' : phase === 0 ? 'Choosing operating system.' : 'Deploying example server.'}</p>
      </div>
      <a href={`${productBaseUrl}/${mode === 'windows' ? 'windows-vps' : 'linux-vps'}`} className={styles.explore}>Explore {system.name} VPS<ArrowUpRight size={15} aria-hidden="true" /></a>
    </section>
  );
}

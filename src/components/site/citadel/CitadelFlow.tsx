import Image from 'next/image';
import {
  Browser,
  ChartLineUp,
  FunnelSimple,
  GlobeHemisphereWest,
  Lightning,
  ListChecks,
  Robot,
  ShieldCheck,
  UsersThree,
} from '@phosphor-icons/react/dist/ssr';
import styles from './CitadelFlow.module.css';

const traffic = [
  { title: 'Legit users', detail: 'Customers · visitors', outcome: 'Pass', icon: UsersThree, tone: 'users' },
  { title: 'Search bots', detail: 'Google · Bing · others', outcome: 'Pass', icon: Robot, tone: 'search' },
  { title: 'Malicious bots', detail: 'Scrapers · automation', outcome: 'Challenge / block', icon: Robot, tone: 'threat' },
  { title: 'HTTP floods', detail: 'High-volume requests', outcome: 'Rate limited', icon: Lightning, tone: 'flood' },
] as const;

const controls = [
  { title: 'Challenges', detail: 'JS · cookie · interaction', icon: ShieldCheck, tone: 'challenge' },
  { title: 'Rate limiting', detail: 'Presets · strikes', icon: FunnelSimple, tone: 'rate' },
  { title: 'Managed blocklists', detail: 'Threat intelligence', icon: ListChecks, tone: 'lists' },
  { title: 'Traffic analysis', detail: 'Logs · attack outcomes', icon: ChartLineUp, tone: 'analysis' },
] as const;

export function CitadelFlow() {
  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        <div className={styles.frameHead}>
          <div>
            <span className={styles.liveMark} aria-hidden="true" />
            <div>
              <span className={styles.frameEyebrow}>Protected application</span>
              <strong>Request path overview</strong>
            </div>
          </div>
          <span className={styles.policyBadge}>Adaptive policy</span>
        </div>

        <div className={styles.diagram} aria-label="Illustrative Citadel request flow">
          <svg className={styles.beamLayer} viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden="true">
            <path className={styles.track} d="M220 82 C330 82 370 166 490 224" />
            <path className={styles.track} d="M220 164 C330 164 370 188 490 224" />
            <path className={styles.track} d="M220 296 C330 296 370 260 490 230" />
            <path className={styles.track} d="M220 378 C330 378 370 282 490 230" />
            <path className={styles.cleanBeam} d="M220 82 C330 82 370 166 490 224" />
            <path className={styles.cleanBeam} d="M220 164 C330 164 370 188 490 224" />
            <path className={styles.threatBeam} d="M220 296 C330 296 370 260 490 230" />
            <path className={styles.threatBeam} d="M220 378 C330 378 370 282 490 230" />
            <path className={styles.outgoingBeam} d="M510 230 C635 228 680 230 840 230" />
          </svg>

          <section className={styles.trafficGroup} aria-label="Incoming traffic">
            <p className={styles.groupLabel}>Incoming traffic</p>
            {traffic.map(({ title, detail, outcome, icon: Icon, tone }) => (
              <article className={styles.trafficCard} data-tone={tone} key={title}>
                <span className={styles.iconBox}>
                  <Icon size={23} weight="duotone" aria-hidden="true" />
                </span>
                <span className={styles.cardCopy}>
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </span>
                <span className={styles.outcome}>{outcome}</span>
              </article>
            ))}
          </section>

          <section className={styles.processor} aria-label="Citadel protection controls">
            <div className={styles.controlGrid}>
              {controls.map(({ title, detail, icon: Icon, tone }) => (
                <article className={styles.controlCard} data-tone={tone} key={title}>
                  <span className={styles.iconBox}>
                    <Icon size={21} weight="duotone" aria-hidden="true" />
                  </span>
                  <span className={styles.cardCopy}>
                    <strong>{title}</strong>
                    <span>{detail}</span>
                  </span>
                </article>
              ))}
            </div>
            <div className={styles.citadelMark}>
              <Image
                src="/brand/citadel-shield.svg"
                alt=""
                width={128}
                height={144}
                className={styles.shield}
              />
              <strong>Citadel</strong>
              <span>Layer 7 protection</span>
            </div>
          </section>

          <div className={styles.mobileBridge} aria-hidden="true" />

          <article className={styles.destination}>
            <span className={styles.destinationIcon}>
              <Browser size={28} weight="duotone" aria-hidden="true" />
            </span>
            <span className={styles.cardCopy}>
              <strong>Your website / app</strong>
              <span>Origin on any host or provider</span>
            </span>
            <span className={styles.protected}>
              <i aria-hidden="true" />
              Protected
            </span>
          </article>
        </div>

        <figcaption className={styles.legend}>
          <span><i className={styles.cleanKey} aria-hidden="true" />Clean traffic reaches your app</span>
          <span><i className={styles.threatKey} aria-hidden="true" />Suspicious requests are challenged or blocked</span>
          <span className={styles.disclaimer}>
            <GlobeHemisphereWest size={16} weight="duotone" aria-hidden="true" />
            Illustrative HTTP / HTTPS flow
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

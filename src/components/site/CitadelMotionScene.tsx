import {
  ArrowRight,
  Browser,
  CheckCircle,
  Database,
  Globe,
  ShieldCheck,
  Warning,
} from '@phosphor-icons/react/dist/ssr';
import styles from './CitadelMotionScene.module.css';

const outcomes = [
  { request: 'GET /catalog', result: 'Allowed', tone: 'allowed' },
  { request: 'POST /login', result: 'Challenge', tone: 'challenge' },
  { request: 'GET /wp-login', result: 'Blocked', tone: 'blocked' },
] as const;

/** Illustrative, non-live request flow for the public Citadel product page. */
export function CitadelMotionScene() {
  return (
    <section className={styles.scene} aria-labelledby="citadel-flow-title">
      <header className={styles.header}>
        <div className={styles.protected}>
          <span className={styles.liveDot} aria-hidden="true" />
          <span className={styles.headerCopy}>
            <span className={styles.microLabel}>Protected application</span>
            <strong>shop.example.com</strong>
          </span>
        </div>
        <span className={styles.profile}>Balanced</span>
      </header>

      <div className={styles.titleRow}>
        <div>
          <p className={styles.kicker}>Request path</p>
          <h2 id="citadel-flow-title">Good traffic moves on.</h2>
        </div>
        <span className={styles.caption}>Illustrative flow</span>
      </div>

      <div className={styles.diagram} aria-label="Requests pass through Citadel before reaching the website">
        <span className={styles.flowline} aria-hidden="true">
          <i className={styles.packet} />
          <i className={styles.packetSecondary} />
        </span>

        <div className={styles.node}>
          <span className={styles.nodeIcon}><Globe size={22} weight="duotone" aria-hidden="true" /></span>
          <strong>Incoming traffic</strong>
          <span className={styles.nodeSub}>Visitors · clients · bots</span>
          <span className={styles.sourceSignals}>
            <span><i data-tone="good" />Clean</span>
            <span><i data-tone="risk" />Suspicious</span>
          </span>
        </div>

        <div className={styles.gate}>
          <span className={styles.shield}><ShieldCheck size={38} weight="duotone" aria-hidden="true" /></span>
          <strong>Citadel</strong>
          <span className={styles.gateSub}>Layer 7 policy</span>
          <span className={styles.checkPulse} aria-hidden="true" />
        </div>

        <div className={styles.node}>
          <span className={styles.nodeIcon}><Database size={22} weight="duotone" aria-hidden="true" /></span>
          <strong>Website / app</strong>
          <span className={styles.nodeSub}>Your origin</span>
          <span className={styles.originState}><CheckCircle size={14} weight="fill" aria-hidden="true" /> Ready</span>
        </div>
      </div>

      <div className={styles.branch}>
        <span className={styles.branchStem} aria-hidden="true" />
        <span className={styles.branchIcon}><Warning size={14} weight="fill" aria-hidden="true" /></span>
        <span>Suspicious requests are challenged or blocked</span>
      </div>

      <div className={styles.outcomes}>
        <div className={styles.outcomesHeader}>
          <strong>Policy outcomes</strong>
          <span>Example requests</span>
        </div>
        {outcomes.map(outcome => (
          <div className={styles.outcome} data-tone={outcome.tone} key={outcome.request}>
            <span className={styles.requestMethod}>{outcome.request}</span>
            <span className={styles.outcomeStatus}>
              {outcome.tone === 'allowed' ? <CheckCircle size={14} weight="fill" aria-hidden="true" /> : outcome.tone === 'challenge' ? <Browser size={14} weight="duotone" aria-hidden="true" /> : <Warning size={14} weight="fill" aria-hidden="true" />}
              {outcome.result}
            </span>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <span><i aria-hidden="true" /> HTTP / HTTPS protection</span>
        <span className={styles.footerPath}>Traffic <ArrowRight size={12} aria-hidden="true" /> policy <ArrowRight size={12} aria-hidden="true" /> origin</span>
      </footer>
      <p className={styles.srOnly}>This is an illustrative request flow, not live traffic or telemetry.</p>
    </section>
  );
}

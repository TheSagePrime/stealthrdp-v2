import { Check } from '@phosphor-icons/react/dist/ssr';
import styles from './CitadelIncluded.module.css';

/* Matches the "Included with every plan" list in the WHMCS store. */
const included = [
  'Layer 7 (HTTP/HTTPS) DDoS protection',
  'Cloudflare edge + Citadel reverse proxy',
  'Auto challenge escalation (Cookie → JS → Interaction)',
  'Lockdown mode for active attacks',
  'Real-time traffic and attack analytics',
  'Custom challenge templates',
  'Custom error pages',
  'Access logs, error logs and error tracing',
  'Self-serve Citadel portal',
  'Point your A record — we protect the site',
];

export function CitadelIncluded() {
  return (
    <section className={styles.included} aria-labelledby="citadel-included-title">
      <h3 id="citadel-included-title">Included with every plan</h3>
      <ul>
        {included.map(item => (
          <li key={item}>
            <Check size={16} weight="bold" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

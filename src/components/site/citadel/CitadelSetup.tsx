import type { SiteLocale } from '@/config/i18n';
import type { CitadelCopy } from '@/content/i18n/en/citadel';
import { CloudArrowUp, Globe, HardDrives, ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { localeHref } from '@/lib/stealth/i18n';
import { linkLabel } from '@/lib/stealth/link-label';
import styles from './CitadelSetup.module.css';

/*
 * How a request reaches the origin, and the three setup steps behind it.
 * Facts follow the Citadel docs: getting started, Cloudflare setup, DNS.
 */

/* Icons for the hops in the copy: visitor, Cloudflare edge, Citadel, origin. */
const hopIcons = [Globe, CloudArrowUp, ShieldCheck, HardDrives];
const CORE_HOP = 2;

export function CitadelSetup({ copy, locale = 'en' }: { copy: CitadelCopy['setup']; locale?: SiteLocale }) {
  const records = [
    { type: 'A', name: '@', content: copy.ingress, proxy: copy.proxied, protected: true },
    { type: 'A', name: 'www', content: copy.ingress, proxy: copy.proxied, protected: true },
    { type: 'MX', name: '@', content: copy.mail, proxy: copy.dnsOnly, protected: false },
  ];

  return (
    <div className={styles.setup}>
      <ol className={styles.flow} aria-label={copy.pathLabel}>
        {copy.hops.map(({ name, note }, index) => {
          const Icon = hopIcons[index] ?? Globe;
          return (
            <li key={name} className={styles.hop} data-core={index === CORE_HOP || undefined}>
              <span className={styles.hopIcon}>
                <Icon size={22} weight="duotone" aria-hidden="true" />
              </span>
              <strong>{name}</strong>
              <span>{note}</span>
            </li>
          );
        })}
      </ol>

      <div className={styles.grid}>
        <ol className={styles.steps}>
          {copy.steps.map(step => (
            <li key={step.title}>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        <figure className={styles.dns}>
          <figcaption>
            <span>{copy.dnsTitle}</span>
            <span className={styles.dnsNote}>{copy.dnsNote}</span>
          </figcaption>
          <table>
            <thead>
              <tr>
                {copy.columns.map(column => <th key={column} scope="col">{column}</th>)}
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={`${record.type}${record.name}`} data-protected={record.protected || undefined}>
                  <td><code>{record.type}</code></td>
                  <td><code>{record.name}</code></td>
                  <td>{record.content}</td>
                  <td><span className={styles.proxy}>{record.proxy}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.dnsFoot}>
            {copy.dnsFoot}
            {' '}
            <Link href={localeHref('/citadel/docs/cloudflare-setup', locale)}>
              {linkLabel(copy.dnsGuide, '/citadel/docs/cloudflare-setup', locale)}
            </Link>
          </p>
        </figure>
      </div>

      <p className={styles.scope}>
        {copy.scope}
      </p>
    </div>
  );
}

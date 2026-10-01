import { CloudArrowUp, Globe, HardDrives, ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import styles from './CitadelSetup.module.css';

/*
 * How a request reaches the origin, and the three setup steps behind it.
 * Facts follow the Citadel docs: getting started, Cloudflare setup, DNS.
 */

const hops = [
  { name: 'Visitor', note: 'Browser, bot or flood', icon: Globe },
  { name: 'Cloudflare edge', note: 'Proxied (orange cloud) A record', icon: CloudArrowUp },
  { name: 'Citadel', note: 'Reverse proxy checks every request', icon: ShieldCheck },
  { name: 'Your origin', note: 'Receives clean traffic only', icon: HardDrives },
];

const steps = [
  {
    title: 'Add the domain in the Citadel portal',
    text: 'Enter the origin IP or hostname, the port and the TLS-to-origin setting.',
  },
  {
    title: 'Point a proxied A record at Citadel',
    text: 'Copy the ingress IP from the domain page. In Cloudflare DNS, point the apex and each protected hostname to it with Proxied on, and set SSL/TLS to Full.',
  },
  {
    title: 'Citadel confirms the connection',
    text: 'It checks about every minute, or select Check connection. The domain changes from Awaiting DNS to Active.',
  },
];

const records = [
  { type: 'A', name: '@', content: 'Citadel ingress IP', proxy: 'Proxied', protected: true },
  { type: 'A', name: 'www', content: 'Citadel ingress IP', proxy: 'Proxied', protected: true },
  { type: 'MX', name: '@', content: 'Your mail server', proxy: 'DNS only', protected: false },
];

export function CitadelSetup() {
  return (
    <div className={styles.setup}>
      <ol className={styles.flow} aria-label="Request path">
        {hops.map(({ name, note, icon: Icon }) => (
          <li key={name} className={styles.hop} data-core={name === 'Citadel' || undefined}>
            <span className={styles.hopIcon}>
              <Icon size={22} weight="duotone" aria-hidden="true" />
            </span>
            <strong>{name}</strong>
            <span>{note}</span>
          </li>
        ))}
      </ol>

      <div className={styles.grid}>
        <ol className={styles.steps}>
          {steps.map(step => (
            <li key={step.title}>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        <figure className={styles.dns}>
          <figcaption>
            <span>Cloudflare DNS</span>
            <span className={styles.dnsNote}>Your zone stays in Cloudflare</span>
          </figcaption>
          <table>
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Name</th>
                <th scope="col">Content</th>
                <th scope="col">Proxy status</th>
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
            Mail, TXT and other non-web records do not change. A DNS-only (grey cloud) web
            record skips Citadel.
            {' '}
            <Link href="/citadel/docs/cloudflare-setup">Cloudflare setup guide</Link>
          </p>
        </figure>
      </div>

      <p className={styles.scope}>
        Citadel protects Layer 7 HTTP/HTTPS traffic. Network-layer mitigation is a separate edge task.
      </p>
    </div>
  );
}

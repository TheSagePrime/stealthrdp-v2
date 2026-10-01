'use client';

import type { Icon } from '@phosphor-icons/react';
import {
  ChartLine,
  Gauge,
  GearSix,
  Heartbeat,
  Lightning,
  ListMagnifyingGlass,
  PaintBrush,
  ShieldCheck,
  SquaresFour,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import styles from './CitadelPortal.module.css';

/*
 * A tour of the self-serve Citadel portal. Each section repeats what its
 * Citadel doc says it does and links to that doc. No invented numbers.
 */

type Section = { id: string; name: string; icon: Icon; title: string; points: string[]; doc: string };

const sections: Section[] = [
  {
    id: 'overview',
    name: 'Overview',
    icon: SquaresFour,
    title: 'Command center',
    points: [
      'Domains already synced and domains awaiting DNS',
      'Your service plan and remaining billing-period bandwidth',
      'Recent proxied and blocked requests, and live traffic',
    ],
    doc: '/citadel/docs/overview',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: ChartLine,
    title: 'Fleet traffic over time',
    points: [
      'Edge, Proxy and Blocked series for a time range you select',
      'Spot which site dominates a spike, then open that domain',
    ],
    doc: '/citadel/docs/analytics',
  },
  {
    id: 'insights',
    name: 'Insights',
    icon: Lightning,
    title: 'Attack timeline per domain',
    points: [
      'Charts and an attack and event timeline',
      'Attack started and ended events, with duration where available',
      'Recent challenge and block reasons',
    ],
    doc: '/citadel/docs/insights',
  },
  {
    id: 'logs',
    name: 'Logs',
    icon: ListMagnifyingGlass,
    title: 'Access, security and error logs',
    points: [
      'Search 15 days by IP, path, host or request ID',
      'Filter by type, method or status, with ASN and country details',
      'Origin errors 502, 503 and 504 for error tracing',
    ],
    doc: '/citadel/docs/logs',
  },
  {
    id: 'security',
    name: 'Security',
    icon: ShieldCheck,
    title: 'Challenge level and allowlists',
    points: [
      'Off, Cookie, JS, Interaction, Auto or Lockdown per domain',
      'Allowlist paths, IPs and User-Agents that must not be challenged',
    ],
    doc: '/citadel/docs/security',
  },
  {
    id: 'branding',
    name: 'Branding',
    icon: PaintBrush,
    title: 'Your own challenge and error pages',
    points: [
      'HTML shells for JS challenge, Interaction and Lockdown pages',
      'Shells for 403, 429 and origin errors 502, 503 and 504',
      'Restore the stock pages at any time',
    ],
    doc: '/citadel/docs/branding',
  },
  {
    id: 'cache',
    name: 'Cache',
    icon: Gauge,
    title: 'Serve static files before the origin',
    points: [
      'Eligible static responses come from cache',
      'Paths such as /api/ and /admin/ bypass the cache',
    ],
    doc: '/citadel/docs/cache',
  },
  {
    id: 'health',
    name: 'Health',
    icon: Heartbeat,
    title: 'Origin health probes',
    points: [
      'Latency, status and error text of the latest probe',
      'Run a new probe after you change origin settings',
    ],
    doc: '/citadel/docs/health',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: GearSix,
    title: 'Team and notifications',
    points: [
      'Plan entitlements, team invites and roles',
      'Email alerts for attack start, attack end and awaiting DNS',
      'Webhooks for attack and lockdown events, with a test delivery',
    ],
    doc: '/citadel/docs/settings',
  },
];

export function CitadelPortal() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const section = sections[active]!;
  const Glyph = section.icon;

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? sections.length - 1 : step === undefined ? null : (active + step + sections.length) % sections.length;
    if (target === null) {
      return;
    }
    event.preventDefault();
    setActive(target);
    tabsRef.current[target]?.focus();
  };

  return (
    <div className={styles.portal}>
      <div className={styles.bar} aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{`citadel.stealthrdp.com / ${section.name.toLowerCase()}`}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.nav} role="tablist" aria-label="Citadel portal sections" aria-orientation="vertical" onKeyDown={onKeyDown}>
          {sections.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <button
                key={item.id}
                ref={(element) => {
                  tabsRef.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`portal-tab-${item.id}`}
                aria-selected={index === active}
                aria-controls="portal-panel"
                tabIndex={index === active ? 0 : -1}
                onClick={() => setActive(index)}
              >
                <ItemIcon size={17} weight={index === active ? 'fill' : 'regular'} aria-hidden="true" />
                {item.name}
              </button>
            );
          })}
        </div>

        <div className={styles.panel} role="tabpanel" id="portal-panel" aria-labelledby={`portal-tab-${section.id}`} key={section.id}>
          <span className={styles.panelIcon}>
            <Glyph size={26} weight="duotone" aria-hidden="true" />
          </span>
          <h3>{section.title}</h3>
          <ul>
            {section.points.map(point => <li key={point}>{point}</li>)}
          </ul>
          <Link href={section.doc} className={styles.doc}>
            {`Read the ${section.name} guide`}
          </Link>
        </div>
      </div>
    </div>
  );
}

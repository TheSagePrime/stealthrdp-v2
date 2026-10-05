'use client';

import type { Icon } from '@phosphor-icons/react';
import type { CitadelCopy } from '@/content/i18n/en/citadel';
import type { PortalSectionId } from '@/lib/stealth/citadel-portal';
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
import { portalSectionIds } from '@/lib/stealth/citadel-portal';
import styles from './CitadelPortal.module.css';

/*
 * A tour of the self-serve Citadel portal. Each section repeats what its
 * Citadel doc says it does and links to that doc. No invented numbers.
 */

const icons: Record<PortalSectionId, Icon> = {
  overview: SquaresFour,
  analytics: ChartLine,
  insights: Lightning,
  logs: ListMagnifyingGlass,
  security: ShieldCheck,
  branding: PaintBrush,
  cache: Gauge,
  health: Heartbeat,
  settings: GearSix,
};

const sections = portalSectionIds.map(id => ({ id, icon: icons[id] }));

/* `links` holds each section's doc URL and link label, worked out on the server for the page's
   language (an English-only doc is marked as such). */
export function CitadelPortal({ copy, links }: { copy: CitadelCopy['portal']; links: { href: string; label: string }[] }) {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const section = sections[active]!;
  const words = copy.sections[active]!;
  const link = links[active]!;
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
        <span>{`citadel.stealthrdp.com / ${section.id}`}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.nav} role="tablist" aria-label={copy.sectionsLabel} aria-orientation="vertical" onKeyDown={onKeyDown}>
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
                {copy.sections[index]?.name}
              </button>
            );
          })}
        </div>

        <div className={styles.panel} role="tabpanel" id="portal-panel" aria-labelledby={`portal-tab-${section.id}`} key={section.id}>
          <span className={styles.panelIcon}>
            <Glyph size={26} weight="duotone" aria-hidden="true" />
          </span>
          <h3>{words.title}</h3>
          <ul>
            {words.points.map(point => <li key={point}>{point}</li>)}
          </ul>
          <Link href={link.href} className={styles.doc}>
            {link.label}
          </Link>
        </div>
      </div>
    </div>
  );
}

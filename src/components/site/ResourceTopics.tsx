/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Icon } from '@phosphor-icons/react';
import {
  BookOpenText,
  ChartLineUp,
  Gear,
  Globe,
  HardDrives,
  Lifebuoy,
  Lock,
  Receipt,
  RocketLaunch,
  ShieldCheck,
  Sliders,
  WindowsLogo,
} from '@phosphor-icons/react/dist/ssr';
import { createElement } from 'react';

/* Jump tiles at the top of the resource index pages: one per collection. */

/* `iconHint` is an English title to pick the icon from when `title` is in another language. */
export type ResourceTopic = { id: string; title: string; count: number; unit: string; description?: string; iconHint?: string };

const icons: Array<[RegExp, Icon]> = [
  [/start|introduction|getting/i, RocketLaunch],
  [/windows|rdp/i, WindowsLogo],
  [/network|vpn|dns|domain/i, Globe],
  [/hosting|panel|web/i, HardDrives],
  [/account|billing|polic|pricing|payment/i, Receipt],
  [/protect|security|challenge|threat/i, ShieldCheck],
  [/traffic|analytic|log|insight|monitor/i, ChartLineUp],
  [/team|alert|support|help/i, Lifebuoy],
  [/manage|server|operation/i, Gear],
  [/use case|choos|decision/i, Sliders],
  [/secur|privacy/i, Lock],
];

function iconFor(title: string): Icon {
  return icons.find(([pattern]) => pattern.test(title))?.[1] ?? BookOpenText;
}

export function ResourceTopics({ topics, label = 'Browse by topic' }: { topics: ResourceTopic[]; label?: string }) {
  return (
    <nav className="sr-topics" aria-label={label}>
      <ul>
        {topics.map((topic) => {
          const glyph = createElement(iconFor(topic.iconHint ?? topic.title), { 'size': 20, 'weight': 'duotone', 'aria-hidden': true });
          return (
            <li key={topic.id}>
              <a href={`#${topic.id}`}>
                <span className="sr-topics-icon">{glyph}</span>
                <strong>{topic.title}</strong>
                {topic.description && <small>{topic.description}</small>}
                <span className="sr-topics-count">{`${topic.count} ${topic.unit}`}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* eslint-disable better-tailwindcss/no-unknown-classes */
import Image from 'next/image';
import iconStyles from '@/components/site/IconArtwork.module.css';

/* Jump tiles at the top of the resource index pages: one per collection. */

/* `iconHint` is an English title to pick the icon from when `title` is in another language. */
export type ResourceTopic = { id: string; title: string; count: number; unit: string; description?: string; iconHint?: string };

const icons: Array<[RegExp, string]> = [
  [/start|introduction|getting/i, 'cloud'],
  [/windows|rdp/i, 'board'],
  [/network|vpn|dns|domain/i, 'globe'],
  [/hosting|panel|web/i, 'database'],
  [/account|billing|polic|pricing|payment/i, 'receipt'],
  [/protect|security|challenge|threat/i, 'shield-checkmark'],
  [/traffic|analytic|log|insight|monitor/i, 'data-trending'],
  [/team|alert|support|help/i, 'chat'],
  [/manage|server|operation/i, 'settings'],
  [/use case|choos|decision/i, 'gauge'],
  [/secur|privacy/i, 'lock-shield'],
];

function iconFor(title: string): string {
  return icons.find(([pattern]) => pattern.test(title))?.[1] ?? 'book-open';
}

export function ResourceTopics({ topics, label = 'Browse by topic' }: { topics: ResourceTopic[]; label?: string }) {
  return (
    <nav className="sr-topics not-prose" aria-label={label}>
      <ul>
        {topics.map((topic) => {
          const glyph = <Image className={iconStyles.artwork} src={`/images/fluent-color/${iconFor(topic.iconHint ?? topic.title)}.svg`} width={28} height={28} alt="" />;
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

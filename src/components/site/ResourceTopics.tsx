import { Card, Cards } from 'fumadocs-ui/components/card';
import Image from 'next/image';
import iconStyles from '@/components/site/IconArtwork.module.css';

/* Jump cards at the top of the resource index pages: one per collection. */

/* `iconHint` is an English title to pick the icon from when `title` is in another language. */
export type ResourceTopic = { id: string; title: string; count: number; unit: string; description?: string; iconHint?: string };

const icons: Array<[RegExp, string]> = [
  [/start|introduction|getting/i, 'cloud'],
  [/windows|rdp/i, 'laptop'],
  [/network|vpn|dns|domain/i, 'globe'],
  [/hosting|panel|web/i, 'database'],
  [/account|billing|polic|pricing|payment/i, 'receipt'],
  [/protect|security|challenge|threat/i, 'shield-checkmark'],
  [/traffic|analytic|log|insight|monitor/i, 'data-trending'],
  [/team|alert|support|help/i, 'headset'],
  [/manage|server|operation/i, 'settings'],
  [/use case|choos|decision/i, 'gauge'],
  [/secur|privacy/i, 'lock-shield'],
];

function iconFor(title: string): string {
  return icons.find(([pattern]) => pattern.test(title))?.[1] ?? 'book-open';
}

export function ResourceTopics({ topics }: { topics: ResourceTopic[] }) {
  return (
    <Cards>
      {topics.map(topic => (
        <Card
          key={topic.id}
          href={`#${topic.id}`}
          icon={<Image className={iconStyles.artwork} src={`/images/fluent-color/${iconFor(topic.iconHint ?? topic.title)}.svg`} width={28} height={28} alt="" />}
          title={topic.title}
          description={[topic.description, `${topic.count} ${topic.unit}`].filter(Boolean).join(' · ')}
        />
      ))}
    </Cards>
  );
}

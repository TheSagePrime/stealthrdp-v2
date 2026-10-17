'use client';

import type { CitadelCopy } from '@/content/i18n/en/citadel';
import { Tabs } from '@/components/ui/tabs';
import styles from './CitadelThreats.module.css';

/*
 * One panel per Layer 7 attack shape: what the traffic looks like, how Citadel
 * escalates, and which documented setting fits. Replaces four equal cards.
 */

type Tone = 'observe' | 'challenge' | 'block' | 'recover';

type Threat = {
  id: string;
  /* Requests per interval, 0–100, drawn as the traffic signature. */
  shape: number[];
  tones: Tone[];
};

type ThreatWords = CitadelCopy['threats'];

/* Same order as the threats in the page copy. */
const threats: Threat[] = [
  {
    id: 'flood',
    shape: [8, 9, 8, 10, 9, 72, 94, 88, 97, 91, 95, 86, 93, 98, 90, 94, 89, 92, 40, 12, 9, 8, 10, 9],
    tones: ['observe', 'challenge', 'challenge', 'block'],
  },
  {
    id: 'stuffing',
    shape: [10, 12, 11, 34, 36, 33, 37, 35, 38, 34, 36, 37, 35, 33, 36, 38, 34, 37, 35, 36, 34, 12, 11, 10],
    tones: ['observe', 'observe', 'challenge', 'block'],
  },
  {
    id: 'headless',
    shape: [14, 18, 22, 19, 26, 24, 30, 27, 33, 29, 35, 31, 38, 34, 40, 36, 42, 39, 44, 41, 46, 43, 48, 45],
    tones: ['observe', 'challenge', 'challenge', 'block'],
  },
  {
    id: 'burst',
    shape: [10, 11, 64, 12, 10, 11, 9, 58, 70, 11, 10, 12, 9, 10, 66, 10, 11, 9, 10, 61, 12, 10, 11, 9],
    tones: ['observe', 'challenge', 'block', 'recover'],
  },
];

function signature(values: number[]) {
  const x = (index: number) => ((index / (values.length - 1)) * 100).toFixed(2);
  const y = (value: number) => (100 - value).toFixed(2);
  const line = values.map((value, index) => `${index ? 'L' : 'M'}${x(index)} ${y(value)}`).join(' ');
  return { line, fill: `${line} L100 100 L0 100 Z` };
}

function Panel({ threat, words, t }: { threat: Threat; words: ThreatWords['items'][number]; t: ThreatWords }) {
  const shape = signature(threat.shape);

  return (
    <div className={styles.panel}>
      <div className={styles.copy}>
        <h3>{words.label}</h3>
        <p>{words.text}</p>
        <div className={styles.setting}>
          <span>{t.recommended}</span>
          <p>{words.setting}</p>
        </div>
      </div>

      <div className={styles.shape}>
        <span>{t.shape}</span>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d={shape.fill} />
          <path d={shape.line} />
        </svg>
      </div>

      <ol className={styles.ladder} aria-label={t.response}>
        {words.steps.map((step, index) => (
          <li key={step} data-tone={threat.tones[index]}>
            <span>{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CitadelThreats({ copy }: { copy: ThreatWords }) {
  return (
    <Tabs
      className={styles.explorer}
      items={threats.flatMap((threat, index) => {
        const words = copy.items[index];
        return words ? [{ id: threat.id, label: words.label, content: <Panel threat={threat} words={words} t={copy} /> }] : [];
      })}
    />
  );
}

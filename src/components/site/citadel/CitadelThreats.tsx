'use client';

import { Tabs } from '@/components/ui/tabs';
import styles from './CitadelThreats.module.css';

/*
 * One panel per Layer 7 attack shape: what the traffic looks like, how Citadel
 * escalates, and which documented setting fits. Replaces four equal cards.
 */

type Step = { label: string; tone: 'observe' | 'challenge' | 'block' | 'recover' };

type Threat = {
  id: string;
  label: string;
  text: string;
  /* Requests per interval, 0–100, drawn as the traffic signature. */
  shape: number[];
  steps: Step[];
  setting: string;
};

const threats: Threat[] = [
  {
    id: 'flood',
    label: 'HTTP flood',
    text: 'High request volume that looks valid enough to make the application and database do real work.',
    shape: [8, 9, 8, 10, 9, 72, 94, 88, 97, 91, 95, 86, 93, 98, 90, 94, 89, 92, 40, 12, 9, 8, 10, 9],
    steps: [
      { label: 'Rate signals', tone: 'observe' },
      { label: 'Challenge', tone: 'challenge' },
      { label: 'Strike', tone: 'challenge' },
      { label: 'Temporary ban', tone: 'block' },
    ],
    setting: 'Auto with a rate-limit preset. Auto escalates during the flood and heals when traffic calms.',
  },
  {
    id: 'stuffing',
    label: 'Credential stuffing',
    text: 'Repeated authentication attempts that target expensive login paths instead of the whole site.',
    shape: [10, 12, 11, 34, 36, 33, 37, 35, 38, 34, 36, 37, 35, 33, 36, 38, 34, 37, 35, 36, 34, 12, 11, 10],
    steps: [
      { label: 'Path signals', tone: 'observe' },
      { label: 'Session checks', tone: 'observe' },
      { label: 'Interaction', tone: 'challenge' },
      { label: 'Block', tone: 'block' },
    ],
    setting: 'Interaction during active abuse. Allowlist API and webhook paths first, because they cannot click.',
  },
  {
    id: 'headless',
    label: 'Headless automation',
    text: 'Bots and scrapers that can pass simple network checks but do not behave like a normal browser session.',
    shape: [14, 18, 22, 19, 26, 24, 30, 27, 33, 29, 35, 31, 38, 34, 40, 36, 42, 39, 44, 41, 46, 43, 48, 45],
    steps: [
      { label: 'Browser check', tone: 'observe' },
      { label: 'JS challenge', tone: 'challenge' },
      { label: 'Interaction', tone: 'challenge' },
      { label: 'Block', tone: 'block' },
    ],
    setting: 'JS or Auto. Clients that cannot complete the browser check stop at the edge.',
  },
  {
    id: 'burst',
    label: 'Burst abuse',
    text: 'Short spikes that should not permanently block a customer, but still need an immediate response.',
    shape: [10, 11, 64, 12, 10, 11, 9, 58, 70, 11, 10, 12, 9, 10, 66, 10, 11, 9, 10, 61, 12, 10, 11, 9],
    steps: [
      { label: 'Preset limit', tone: 'observe' },
      { label: 'Strike', tone: 'challenge' },
      { label: 'Short ban', tone: 'block' },
      { label: 'Timed recovery', tone: 'recover' },
    ],
    setting: 'Rate-limit presets with strikes. The client recovers automatically when the ban expires.',
  },
];

function signature(values: number[]) {
  const x = (index: number) => ((index / (values.length - 1)) * 100).toFixed(2);
  const y = (value: number) => (100 - value).toFixed(2);
  const line = values.map((value, index) => `${index ? 'L' : 'M'}${x(index)} ${y(value)}`).join(' ');
  return { line, fill: `${line} L100 100 L0 100 Z` };
}

function Panel({ threat }: { threat: Threat }) {
  const shape = signature(threat.shape);

  return (
    <div className={styles.panel}>
      <div className={styles.copy}>
        <h3>{threat.label}</h3>
        <p>{threat.text}</p>
        <div className={styles.setting}>
          <span>Recommended setting</span>
          <p>{threat.setting}</p>
        </div>
      </div>

      <div className={styles.shape}>
        <span>Traffic shape</span>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d={shape.fill} />
          <path d={shape.line} />
        </svg>
      </div>

      <ol className={styles.ladder} aria-label="Citadel response">
        {threat.steps.map((step, index) => (
          <li key={step.label} data-tone={step.tone}>
            <span>{index + 1}</span>
            {step.label}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CitadelThreats() {
  return (
    <Tabs
      className={styles.explorer}
      items={threats.map(threat => ({
        id: threat.id,
        label: threat.label,
        content: <Panel threat={threat} />,
      }))}
    />
  );
}

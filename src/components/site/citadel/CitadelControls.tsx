'use client';

import type { CitadelCopy } from '@/content/i18n/en/citadel';
import { useState } from 'react';
import { fill } from '@/lib/stealth/i18n';
import styles from './CitadelControls.module.css';

/*
 * The control surface as a bento of small, real product views. Every value
 * comes from the Citadel docs (src/content/docs/citadel-*.md).
 */

type Tone = 'pass' | 'check' | 'stop';
type ControlWords = CitadelCopy['controls'];

type Level = {
  /* Product names, shown as they are in every language. */
  name: string;
  /* Friction on a 0–5 scale; Auto spans a range because it adapts. */
  friction: [number, number];
  visitors: Tone;
  machines: Tone;
};

/* Same order as the levels in the page copy. */
const levels: Level[] = [
  { name: 'Off', friction: [0, 0], visitors: 'pass', machines: 'pass' },
  { name: 'Cookie', friction: [1, 1], visitors: 'check', machines: 'check' },
  { name: 'JS', friction: [2, 2], visitors: 'check', machines: 'check' },
  { name: 'Interaction', friction: [4, 4], visitors: 'check', machines: 'stop' },
  { name: 'Auto', friction: [1, 4], visitors: 'pass', machines: 'check' },
  { name: 'Lockdown', friction: [5, 5], visitors: 'stop', machines: 'stop' },
];

function LevelDial({ t }: { t: ControlWords }) {
  const [selected, setSelected] = useState(4);
  const level = levels[selected]!;
  const words = t.levels[selected]!;
  const [low, high] = level.friction;

  return (
    <article className={styles.tile} data-span="wide">
      <header>
        <h3>{t.dialTitle}</h3>
        <p>{t.dialText}</p>
      </header>

      <div className={styles.levels} role="group" aria-label={t.levelLabel}>
        {levels.map((item, index) => (
          <button
            key={item.name}
            type="button"
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
          >
            {item.name}
            {item.name === 'Auto' && <small>{t.default}</small>}
          </button>
        ))}
      </div>

      <div className={styles.levelBody} aria-live="polite">
        <div className={styles.friction}>
          <span>{t.friction}</span>
          <div role="img" aria-label={low === high ? fill(t.frictionOne, { low }) : fill(t.frictionRange, { low, high })}>
            {[1, 2, 3, 4, 5].map(step => (
              <i key={step} data-on={step <= low || undefined} data-range={(step > low && step <= high) || undefined} />
            ))}
          </div>
        </div>
        <p>{words.text}</p>
        <dl className={styles.outcomes}>
          <div>
            <dt>{t.visitors}</dt>
            <dd data-tone={level.visitors}>{words.visitors}</dd>
          </div>
          <div>
            <dt>{t.machines}</dt>
            <dd data-tone={level.machines}>{words.machines}</dd>
          </div>
          <div>
            <dt>{t.allowlisted}</dt>
            <dd data-tone="pass">{t.bypass}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

type LogType = 'Access' | 'Security' | 'Error';

/* Example rows that show what each log type records. */
const logRows: Array<{ id: string; type: LogType; method: string; path: string; status: string; result: keyof ControlWords['logResults']; tone: Tone }> = [
  { id: 'r-7f3a', type: 'Access', method: 'GET', path: '/pricing', status: '200', result: 'proxied', tone: 'pass' },
  { id: 'r-81c2', type: 'Security', method: 'POST', path: '/login', status: '403', result: 'challengeFailed', tone: 'stop' },
  { id: 'r-9d04', type: 'Security', method: 'GET', path: '/search?q=[redacted]', status: '429', result: 'rateLimited', tone: 'stop' },
  { id: 'r-a6e1', type: 'Security', method: 'POST', path: '/api/webhook', status: '200', result: 'allowlisted', tone: 'pass' },
  { id: 'r-b257', type: 'Error', method: 'GET', path: '/checkout', status: '502', result: 'unreachable', tone: 'stop' },
  { id: 'r-c9f8', type: 'Error', method: 'GET', path: '/reports', status: '504', result: 'timeout', tone: 'stop' },
];

function LogsTile({ t }: { t: ControlWords }) {
  const [filter, setFilter] = useState<LogType | 'All'>('All');
  const rows = logRows.filter(row => filter === 'All' || row.type === filter);

  return (
    <article className={styles.tile} data-span="full">
      <header>
        <h3>{t.logsTitle}</h3>
        <p>{t.logsText}</p>
      </header>
      <div className={styles.logTools}>
        <span className={styles.search} aria-hidden="true">{t.logSearch}</span>
        <div className={styles.filters} role="group" aria-label={t.logTypeLabel}>
          {(['All', 'Access', 'Security', 'Error'] as const).map(item => (
            <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>
              {t.logTypes[item]}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.logs} role="table" aria-label={t.logTableLabel}>
        <div role="row">
          {t.logColumns.map(column => <span key={column} role="columnheader">{column}</span>)}
        </div>
        {rows.map(row => (
          <div role="row" key={row.id}>
            <code role="cell">{row.id}</code>
            <code role="cell">{row.method}</code>
            <code role="cell">{row.path}</code>
            <code role="cell" data-tone={row.tone}>{row.status}</code>
            <span role="cell">{t.logResults[row.result]}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export function CitadelControls({ copy: t }: { copy: ControlWords }) {
  const [path, cidr, agent] = t.allowlistKinds;
  const [strike1, strike2, ban, recovers] = t.strikes;
  return (
    <div className={styles.bento}>
      <LevelDial t={t} />

      <article className={styles.tile}>
        <header>
          <h3>{t.allowlistsTitle}</h3>
          <p>{t.allowlistsText}</p>
        </header>
        <ul className={styles.rules}>
          <li>
            <span>{path}</span>
            <code>/api/</code>
          </li>
          <li>
            <span>{cidr}</span>
            <code>203.0.113.0/24</code>
          </li>
          <li>
            <span>{agent}</span>
            <code>StatusMonitor/2.1</code>
          </li>
        </ul>
      </article>

      <article className={styles.tile}>
        <header>
          <h3>{t.strikesTitle}</h3>
          <p>{t.strikesText}</p>
        </header>
        <ol className={styles.strikes}>
          <li data-tone="check">{strike1}</li>
          <li data-tone="check">{strike2}</li>
          <li data-tone="stop">{ban}</li>
          <li data-tone="pass">{recovers}</li>
        </ol>
      </article>

      <article className={styles.tile}>
        <header>
          <h3>{t.cacheTitle}</h3>
          <p>{t.cacheText}</p>
        </header>
        <div className={styles.chips}>
          <span>{t.cached}</span>
          <code>.css</code>
          <code>.js</code>
          <code>{t.images}</code>
          <code>{t.fonts}</code>
        </div>
        <div className={styles.chips} data-muted>
          <span>{t.bypassed}</span>
          <code>/api/</code>
          <code>/admin/</code>
        </div>
      </article>

      <article className={styles.tile}>
        <header>
          <h3>{t.alertsTitle}</h3>
          <p>{t.alertsText}</p>
        </header>
        <ul className={styles.alerts}>
          {t.alerts.map(([channel, event], index) => (
            <li key={channel} data-tone={index === 0 ? 'stop' : 'pass'}>
              <b>{channel}</b>
              {event}
            </li>
          ))}
        </ul>
      </article>

      <article className={styles.tile} data-span="wide">
        <header>
          <h3>{t.pagesTitle}</h3>
          <p>{t.pagesText}</p>
        </header>
        <div className={styles.pages}>
          <div>
            <span>{t.challengePages}</span>
            <ul>
              {t.challengePageItems.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <span>{t.errorPages}</span>
            <ul>
              {t.errorPageItems.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
        <pre className={styles.shell}><code>{'<h1>{{BRAND}}</h1>\n<p>{{MESSAGE}}</p>'}</code></pre>
      </article>

      <LogsTile t={t} />
    </div>
  );
}

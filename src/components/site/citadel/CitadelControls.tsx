'use client';

import { useState } from 'react';
import styles from './CitadelControls.module.css';

/*
 * The control surface as a bento of small, real product views. Every value
 * comes from the Citadel docs (src/content/docs/citadel-*.md).
 */

type Outcome = { text: string; tone: 'pass' | 'check' | 'stop' };

type Level = {
  name: string;
  /* Friction on a 0–5 scale; Auto spans a range because it adapts. */
  friction: [number, number];
  text: string;
  visitors: Outcome;
  machines: Outcome;
};

const pass = (text: string): Outcome => ({ text, tone: 'pass' });
const check = (text: string): Outcome => ({ text, tone: 'check' });
const stop = (text: string): Outcome => ({ text, tone: 'stop' });

const levels: Level[] = [
  {
    name: 'Off',
    friction: [0, 0],
    text: 'No browser challenge. Configured rate limits and blocklists still apply.',
    visitors: pass('Pass'),
    machines: pass('Pass'),
  },
  {
    name: 'Cookie',
    friction: [1, 1],
    text: 'A lightweight browser check.',
    visitors: check('Light check'),
    machines: check('May be interrupted'),
  },
  {
    name: 'JS',
    friction: [2, 2],
    text: 'A lightweight JavaScript check in the browser.',
    visitors: check('Light check'),
    machines: check('May be interrupted'),
  },
  {
    name: 'Interaction',
    friction: [4, 4],
    text: 'Requires a human click. Use it during active abuse when Auto is not enough.',
    visitors: check('One click'),
    machines: stop('Interrupted'),
  },
  {
    name: 'Auto',
    friction: [1, 4],
    text: 'Starts at a calm baseline, escalates during an attack and heals when traffic calms. The starting point for public websites.',
    visitors: pass('Calm until attacked'),
    machines: check('May be interrupted under attack'),
  },
  {
    name: 'Lockdown',
    friction: [5, 5],
    text: 'Emergency mode. Only allowlisted clients pass.',
    visitors: stop('Blocked'),
    machines: stop('Blocked'),
  },
];

function LevelDial() {
  const [selected, setSelected] = useState(4);
  const level = levels[selected]!;
  const [low, high] = level.friction;

  return (
    <article className={styles.tile} data-span="wide">
      <header>
        <h3>Six challenge levels, one per domain</h3>
        <p>Pick how much friction a domain adds. Select a level to see who gets through.</p>
      </header>

      <div className={styles.levels} role="group" aria-label="Challenge level">
        {levels.map((item, index) => (
          <button
            key={item.name}
            type="button"
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
          >
            {item.name}
            {item.name === 'Auto' && <small>Default</small>}
          </button>
        ))}
      </div>

      <div className={styles.levelBody} aria-live="polite">
        <div className={styles.friction}>
          <span>Friction</span>
          <div role="img" aria-label={low === high ? `${low} of 5` : `${low} to ${high} of 5`}>
            {[1, 2, 3, 4, 5].map(step => (
              <i key={step} data-on={step <= low || undefined} data-range={(step > low && step <= high) || undefined} />
            ))}
          </div>
        </div>
        <p>{level.text}</p>
        <dl className={styles.outcomes}>
          <div>
            <dt>Visitors in a browser</dt>
            <dd data-tone={level.visitors.tone}>{level.visitors.text}</dd>
          </div>
          <div>
            <dt>APIs and webhooks</dt>
            <dd data-tone={level.machines.tone}>{level.machines.text}</dd>
          </div>
          <div>
            <dt>Allowlisted clients</dt>
            <dd data-tone="pass">Bypass</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

type LogType = 'Access' | 'Security' | 'Error';

/* Example rows that show what each log type records. */
const logRows: Array<{ id: string; type: LogType; method: string; path: string; status: string; result: string; tone: Outcome['tone'] }> = [
  { id: 'r-7f3a', type: 'Access', method: 'GET', path: '/pricing', status: '200', result: 'Proxied', tone: 'pass' },
  { id: 'r-81c2', type: 'Security', method: 'POST', path: '/login', status: '403', result: 'Challenge failed', tone: 'stop' },
  { id: 'r-9d04', type: 'Security', method: 'GET', path: '/search?q=[redacted]', status: '429', result: 'Rate limited', tone: 'stop' },
  { id: 'r-a6e1', type: 'Security', method: 'POST', path: '/api/webhook', status: '200', result: 'Allowlisted bypass', tone: 'pass' },
  { id: 'r-b257', type: 'Error', method: 'GET', path: '/checkout', status: '502', result: 'Origin unreachable', tone: 'stop' },
  { id: 'r-c9f8', type: 'Error', method: 'GET', path: '/reports', status: '504', result: 'Origin timeout', tone: 'stop' },
];

function LogsTile() {
  const [filter, setFilter] = useState<LogType | 'All'>('All');
  const rows = logRows.filter(row => filter === 'All' || row.type === filter);

  return (
    <article className={styles.tile} data-span="full">
      <header>
        <h3>Access, security and error logs</h3>
        <p>
          Access entries with method, path, status, IP, ASN, country and latency. Security entries for
          challenges, blocks, rate limits and bypasses. Error entries for origin 502, 503 and 504. Trace one
          request by its ID. Kept for 15 days, with sensitive query values redacted.
        </p>
      </header>
      <div className={styles.logTools}>
        <span className={styles.search} aria-hidden="true">Search IP, path, host or request ID</span>
        <div className={styles.filters} role="group" aria-label="Log type">
          {(['All', 'Access', 'Security', 'Error'] as const).map(item => (
            <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.logs} role="table" aria-label="Example log rows">
        <div role="row">
          <span role="columnheader">Request ID</span>
          <span role="columnheader">Method</span>
          <span role="columnheader">Path</span>
          <span role="columnheader">Status</span>
          <span role="columnheader">Result</span>
        </div>
        {rows.map(row => (
          <div role="row" key={row.id}>
            <code role="cell">{row.id}</code>
            <code role="cell">{row.method}</code>
            <code role="cell">{row.path}</code>
            <code role="cell" data-tone={row.tone}>{row.status}</code>
            <span role="cell">{row.result}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export function CitadelControls() {
  return (
    <div className={styles.bento}>
      <LevelDial />

      <article className={styles.tile}>
        <header>
          <h3>Allowlists</h3>
          <p>Matching clients bypass challenges, including Lockdown.</p>
        </header>
        <ul className={styles.rules}>
          <li>
            <span>Path</span>
            <code>/api/</code>
          </li>
          <li>
            <span>IP or CIDR</span>
            <code>203.0.113.0/24</code>
          </li>
          <li>
            <span>User-Agent</span>
            <code>StatusMonitor/2.1</code>
          </li>
        </ul>
      </article>

      <article className={styles.tile}>
        <header>
          <h3>Rate limits and strikes</h3>
          <p>Repeat offenders escalate step by step instead of one blunt rule.</p>
        </header>
        <ol className={styles.strikes}>
          <li data-tone="check">Strike 1</li>
          <li data-tone="check">Strike 2</li>
          <li data-tone="stop">Temporary ban</li>
          <li data-tone="pass">Recovers</li>
        </ol>
      </article>

      <article className={styles.tile}>
        <header>
          <h3>Cache before origin</h3>
          <p>Eligible static responses come from cache, so repeat requests skip origin work.</p>
        </header>
        <div className={styles.chips}>
          <span>Cached</span>
          <code>.css</code>
          <code>.js</code>
          <code>images</code>
          <code>fonts</code>
        </div>
        <div className={styles.chips} data-muted>
          <span>Bypassed</span>
          <code>/api/</code>
          <code>/admin/</code>
        </div>
      </article>

      <article className={styles.tile}>
        <header>
          <h3>Alerts and origin health</h3>
          <p>Email and webhook events, plus health probes with latency and status.</p>
        </header>
        <ul className={styles.alerts}>
          <li data-tone="stop">
            <b>Webhook</b>
            Attack started
          </li>
          <li data-tone="pass">
            <b>Email</b>
            Attack ended
          </li>
          <li data-tone="pass">
            <b>Health</b>
            Origin probe 200
          </li>
        </ul>
      </article>

      <article className={styles.tile} data-span="wide">
        <header>
          <h3>Your own challenge and error pages</h3>
          <p>Paste an HTML shell per page type. Citadel injects the real verification controls.</p>
        </header>
        <div className={styles.pages}>
          <div>
            <span>Challenge pages</span>
            <ul>
              <li>JS challenge</li>
              <li>Interaction</li>
              <li>Lockdown</li>
            </ul>
          </div>
          <div>
            <span>Error pages</span>
            <ul>
              <li>403 Blocked</li>
              <li>429 Rate limited</li>
              <li>502 · 503 · 504</li>
            </ul>
          </div>
        </div>
        <pre className={styles.shell}><code>{'<h1>{{BRAND}}</h1>\n<p>{{MESSAGE}}</p>'}</code></pre>
      </article>

      <LogsTile />
    </div>
  );
}

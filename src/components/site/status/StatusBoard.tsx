/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { ReactNode } from 'react';
import type { PillState } from '@/components/ui/pill';
import type { Incident, Service, ServiceState, UptimeDay, UptimeReport } from '@/lib/stealth/uptime';
import { CheckCircle, Pause, Question, Warning, XCircle } from '@phosphor-icons/react/dist/ssr';
import { Card, CardContent } from '@/components/ui/card';
import { Pill } from '@/components/ui/pill';
import { groupOrder } from '@/lib/stealth/uptime';
import styles from './StatusBoard.module.css';

/*
 * /status: one row per monitored service with a bar for each of the last 90 days
 * (30 on phones), then the recent incidents. Server-rendered from getUptimeReport().
 */

const states: Record<ServiceState, { label: string; pill: PillState; icon: ReactNode }> = {
  up: { label: 'Operational', pill: 'ok', icon: <CheckCircle size={15} weight="fill" aria-hidden="true" /> },
  down: { label: 'Down', pill: 'bad', icon: <XCircle size={15} weight="fill" aria-hidden="true" /> },
  paused: { label: 'Paused', pill: 'unknown', icon: <Pause size={15} weight="fill" aria-hidden="true" /> },
  unknown: { label: 'Unknown', pill: 'neutral', icon: <Question size={15} weight="fill" aria-hidden="true" /> },
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "12 Sep 2026" in UTC. */
function day(iso: string): string {
  const date = new Date(iso);
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function percent(value: number | null, digits = 3): string {
  return value === null ? '—' : `${value.toFixed(digits)}%`;
}

function duration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} s`;
  }
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  return minutes % 60 ? `${hours} h ${minutes % 60} min` : `${hours} h`;
}

function when(iso: string): string {
  return `${day(iso)}, ${new Date(iso).toISOString().slice(11, 16)} UTC`;
}

function level(ratio: number | null): string {
  if (ratio === null) {
    return 'none';
  }
  if (ratio >= 99.9) {
    return 'ok';
  }
  return ratio >= 99 ? 'warn' : 'bad';
}

function dayTitle(uptimeDay: UptimeDay): string {
  const date = day(`${uptimeDay.date}T00:00:00Z`);
  if (uptimeDay.ratio === null) {
    return `${date}: no data`;
  }
  const down = uptimeDay.downSeconds ? `, ${duration(uptimeDay.downSeconds)} down` : '';
  return `${date}: ${percent(uptimeDay.ratio)}${down}`;
}

function ServiceRow({ service }: { service: Service }) {
  const state = states[service.state];
  const troubledDays = service.days.filter(uptimeDay => uptimeDay.ratio !== null && uptimeDay.ratio < 100).length;

  return (
    <li className={styles.service}>
      <div className={styles.serviceHead}>
        <h3>{service.name}</h3>
        <Pill state={state.pill} icon={state.icon}>{state.label}</Pill>
      </div>

      {service.days.length
        ? (
            <>
              <div
                className={styles.bars}
                role="img"
                aria-label={`${service.name}: ${percent(service.uptime90)} uptime in 90 days; ${troubledDays} of ${service.days.length} days had downtime.`}
              >
                {service.days.map(uptimeDay => (
                  <span key={uptimeDay.date} data-level={level(uptimeDay.ratio)} title={dayTitle(uptimeDay)} />
                ))}
              </div>
              <div className={styles.axis} aria-hidden="true">
                <span>
                  <span className={styles.wide}>{`${service.days.length} days ago`}</span>
                  <span className={styles.narrow}>{`${Math.min(30, service.days.length)} days ago`}</span>
                </span>
                <span>Today</span>
              </div>
            </>
          )
        : <p className={styles.noHistory}>Daily history is not available right now.</p>}

      <dl className={styles.facts}>
        <div>
          <dt>Uptime, 30 days</dt>
          <dd>{percent(service.uptime30)}</dd>
        </div>
        <div>
          <dt>Uptime, 90 days</dt>
          <dd>{percent(service.uptime90)}</dd>
        </div>
        {service.responseMs !== null && (
          <div>
            <dt>Average response</dt>
            <dd>{`${service.responseMs} ms`}</dd>
          </div>
        )}
        <div>
          <dt>Last incident</dt>
          <dd>
            {service.lastIncident
              ? `${day(service.lastIncident.startedAt)} · ${duration(service.lastIncident.durationSeconds)}`
              : 'None recorded'}
          </dd>
        </div>
      </dl>
    </li>
  );
}

function IncidentList({ incidents, latestOnly }: { incidents: Incident[]; latestOnly: boolean }) {
  return (
    <Card className={styles.incidents}>
      <div className={styles.sectionHead}>
        <h2>Recent incidents</h2>
        <span>{latestOnly ? 'Latest incident for each service, last 90 days' : 'Last 90 days'}</span>
      </div>
      {incidents.length
        ? (
            <ol className={styles.incidentList}>
              {incidents.map(incident => (
                <li key={`${incident.service}-${incident.startedAt}`}>
                  <span className={styles.incidentIcon} aria-hidden="true">
                    <Warning size={16} weight="fill" />
                  </span>
                  <div>
                    <strong>{incident.service}</strong>
                    <span>
                      {`Down for ${duration(incident.durationSeconds)} · started ${when(incident.startedAt)}`}
                      {incident.reason ? ` · ${incident.reason}` : ''}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )
        : <p className={styles.empty}>No incidents in the last 90 days.</p>}
    </Card>
  );
}

export function StatusBoard({ report, children }: { report: UptimeReport; children: ReactNode }) {
  const { services } = report;
  const down = services.filter(service => service.state === 'down').length;
  const up = services.filter(service => service.state === 'up').length;
  const ratios = services.map(service => service.uptime90).filter((value): value is number => value !== null);
  const average = ratios.length ? ratios.reduce((sum, value) => sum + value, 0) / ratios.length : null;
  const lastIncident = report.incidents[0];
  const groups = groupOrder
    .map(name => ({ name, members: services.filter(service => service.group === name) }))
    .filter(group => group.members.length);

  let headline = `All ${services.length} services operational`;
  if (down) {
    headline = `${down} of ${services.length} services down`;
  } else if (up < services.length) {
    headline = `${up} of ${services.length} services operational`;
  }
  const checked = report.source === 'snapshot'
    ? `Live data is unavailable. Showing the snapshot from ${day(report.checkedAt)}.`
    : `Checked ${when(report.checkedAt)} · refreshed every 5 minutes`;

  return (
    <>
      <section className="srv-status-v2-hero">
        <div className="sr-container sr-os-hero-grid">
          <div className="srv-status-v2-copy">
            {children}
            <div className="srv-status-v2-state" data-state={down ? 'attention' : 'ok'} role="status">
              {down
                ? <Warning size={22} weight="fill" aria-hidden="true" />
                : <CheckCircle size={22} weight="fill" aria-hidden="true" />}
              <div>
                <strong>{headline}</strong>
                <span>{checked}</span>
              </div>
            </div>
          </div>

          <dl className={styles.summary}>
            <div className={styles.summaryMain}>
              <dt>Average uptime, 90 days</dt>
              <dd>{percent(average, 2)}</dd>
            </div>
            <div>
              <dt>Services up</dt>
              <dd>{`${up} / ${services.length}`}</dd>
            </div>
            <div>
              <dt>Last incident</dt>
              <dd>{lastIncident ? day(lastIncident.startedAt) : 'None in 90 days'}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="srv-status-v2-body">
        <div className="sr-container srv-status-v2-console">
          {groups.map(group => (
            <Card key={group.name} className={styles.group}>
              <div className={styles.sectionHead}>
                <h2>{group.name}</h2>
                <span>{`${group.members.length} service${group.members.length === 1 ? '' : 's'}`}</span>
              </div>
              <ul className={styles.services}>
                {group.members.map(service => <ServiceRow key={service.id} service={service} />)}
              </ul>
            </Card>
          ))}

          <ul className={styles.legend} aria-label="Bar colours">
            <li data-level="ok">99.9% or more</li>
            <li data-level="warn">99% to 99.9%</li>
            <li data-level="bad">Under 99%</li>
            <li data-level="none">No data</li>
          </ul>

          <IncidentList incidents={report.incidents} latestOnly={report.source === 'public'} />

          <Card className="srv-status-v2-help">
            <CardContent>
              <div>
                <strong>Something looks wrong on your server?</strong>
                <span>Status covers shared infrastructure. Account or server-specific issues still need support.</span>
              </div>
              <div>
                <a href="https://wa.me/447441426993" target="_blank" rel="noopener noreferrer">
                  WhatsApp support
                </a>
                <a href="https://dash.stealthrdp.com/submitticket.php">
                  Open a ticket
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

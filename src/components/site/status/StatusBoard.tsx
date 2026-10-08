/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { ReactNode } from 'react';
import type { PillState } from '@/components/ui/pill';
import type { StatusBoardCopy } from '@/content/i18n/en/status';
import type { Incident, Service, ServiceState, UptimeDay, UptimeReport } from '@/lib/stealth/uptime';
import { CheckCircle, Pause, Question, Warning, Wrench, XCircle } from '@phosphor-icons/react/dist/ssr';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Pill } from '@/components/ui/pill';
import { euMaintenance } from '@/content/status-updates';
import { groupOrder } from '@/lib/stealth/uptime';
import styles from './StatusBoard.module.css';

/*
 * /status: one row per monitored service with a bar for each of the last 90 days
 * (30 on phones), then the recent incidents. Server-rendered from getUptimeReport().
 */

const states: Record<ServiceState, { pill: PillState; icon: ReactNode }> = {
  up: { pill: 'ok', icon: <CheckCircle size={15} weight="fill" aria-hidden="true" /> },
  down: { pill: 'bad', icon: <XCircle size={15} weight="fill" aria-hidden="true" /> },
  paused: { pill: 'unknown', icon: <Pause size={15} weight="fill" aria-hidden="true" /> },
  unknown: { pill: 'neutral', icon: <Question size={15} weight="fill" aria-hidden="true" /> },
};

/** "12 Sep 2026" in UTC, in the page's language. */
function day(iso: string, t: StatusBoardCopy): string {
  const date = new Date(iso);
  return t.day(date.getUTCDate(), t.months[date.getUTCMonth()] ?? '', date.getUTCFullYear());
}

function percent(value: number | null, t: StatusBoardCopy, digits = 3): string {
  return value === null ? '—' : t.percent(value.toFixed(digits).replace('.', t.decimal));
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

function when(iso: string, t: StatusBoardCopy): string {
  return `${day(iso, t)}, ${new Date(iso).toISOString().slice(11, 16)} UTC`;
}

/* UptimeRobot's own day colours: 100% green, 99–100% pale green, 95–99% orange, under 95% red. */
function level(ratio: number | null): string {
  if (ratio === null) {
    return 'none';
  }
  if (ratio >= 100) {
    return 'up';
  }
  if (ratio >= 99) {
    return 'minor';
  }
  return ratio >= 95 ? 'degraded' : 'down';
}

function dayTitle(uptimeDay: UptimeDay, t: StatusBoardCopy): string {
  const date = day(`${uptimeDay.date}T00:00:00Z`, t);
  if (uptimeDay.ratio === null) {
    return t.noRecords(date);
  }
  const down = uptimeDay.downSeconds ? t.downFor(duration(uptimeDay.downSeconds)) : '';
  return `${date}: ${percent(uptimeDay.ratio, t)}${down}`;
}

function ServiceRow({ service, t }: { service: Service; t: StatusBoardCopy }) {
  const state = states[service.state];
  const troubledDays = service.days.filter(uptimeDay => uptimeDay.ratio !== null && uptimeDay.ratio < 100).length;

  return (
    <li className={styles.service}>
      <div className={styles.serviceHead}>
        <h3>{service.name}</h3>
        <Pill state={state.pill} icon={state.icon}>{t.states[service.state]}</Pill>
      </div>

      {euMaintenance.active && service.id === euMaintenance.serviceId && (
        <p className={styles.serviceNotice}>
          <Wrench size={16} weight="fill" aria-hidden="true" />
          {t.maintenance.serviceNote}
        </p>
      )}

      {service.days.length
        ? (
            <>
              <div
                className={styles.bars}
                role="img"
                aria-label={t.barsLabel(service.name, percent(service.uptime90, t), troubledDays, service.days.length)}
              >
                {service.days.map(uptimeDay => (
                  <span key={uptimeDay.date} data-level={level(uptimeDay.ratio)} title={dayTitle(uptimeDay, t)} />
                ))}
              </div>
              <div className={styles.axis} aria-hidden="true">
                <span>
                  <span className={styles.wide}>{t.daysAgo(service.days.length)}</span>
                  <span className={styles.narrow}>{t.daysAgo(Math.min(30, service.days.length))}</span>
                </span>
                <span>{t.today}</span>
              </div>
            </>
          )
        : <p className={styles.noHistory}>{t.noHistory}</p>}

      <dl className={styles.facts}>
        <div>
          <dt>{t.uptime30}</dt>
          <dd>{percent(service.uptime30, t)}</dd>
        </div>
        <div>
          <dt>{t.uptime90}</dt>
          <dd>{percent(service.uptime90, t)}</dd>
        </div>
        {service.responseMs !== null && (
          <div>
            <dt>{t.averageResponse}</dt>
            <dd>{`${service.responseMs} ms`}</dd>
          </div>
        )}
        <div>
          <dt>{t.lastIncident}</dt>
          <dd>
            {service.lastIncident
              ? `${day(service.lastIncident.startedAt, t)} · ${duration(service.lastIncident.durationSeconds)}`
              : t.noneRecorded}
          </dd>
        </div>
      </dl>

      <AccordionItem title={t.serviceDetails} className={styles.monitorDetails}>
        <dl className={styles.detailGrid}>
          <div>
            <dt>{t.uptime24}</dt>
            <dd>{percent(service.uptime24, t)}</dd>
          </div>
          <div>
            <dt>{t.uptime7}</dt>
            <dd>{percent(service.uptime7, t)}</dd>
          </div>
          <div>
            <dt>{t.checkMethod}</dt>
            <dd>{t.monitorKinds[service.monitorKind]}</dd>
          </div>
          <div>
            <dt>{t.checkFrequency}</dt>
            <dd>{service.checkIntervalSeconds === null ? '—' : duration(service.checkIntervalSeconds)}</dd>
          </div>
          {service.lastResponseAt && (
            <div>
              <dt>{t.lastResponse}</dt>
              <dd>{when(service.lastResponseAt, t)}</dd>
            </div>
          )}
        </dl>
        {service.uptime24 === null && service.uptime7 === null && service.checkIntervalSeconds === null && <p className={styles.sourceNote}>{t.noMetrics}</p>}
      </AccordionItem>
    </li>
  );
}

function IncidentFacts({ incident, t }: { incident: Incident; t: StatusBoardCopy }) {
  return (
    <dl className={styles.detailGrid}>
      <div>
        <dt>{t.started}</dt>
        <dd><time dateTime={incident.startedAt}>{when(incident.startedAt, t)}</time></dd>
      </div>
      <div>
        <dt>{t.incidentDuration}</dt>
        <dd>{duration(incident.durationSeconds)}</dd>
      </div>
      {!incident.ongoing && (
        <div>
          <dt>{t.resolvedAt}</dt>
          <dd><time dateTime={new Date(Date.parse(incident.startedAt) + incident.durationSeconds * 1000).toISOString()}>{when(new Date(Date.parse(incident.startedAt) + incident.durationSeconds * 1000).toISOString(), t)}</time></dd>
        </div>
      )}
    </dl>
  );
}

export function IncidentHistory({ incidents, latestOnly, t }: { incidents: Incident[]; latestOnly: boolean; t: StatusBoardCopy }) {
  const currentMaintenance = euMaintenance.active
    ? incidents.find(incident => incident.serviceId === euMaintenance.serviceId && incident.ongoing)
    : undefined;
  const history = incidents.filter(incident => incident !== currentMaintenance);
  const count = history.length + (euMaintenance.active ? 1 : 0);
  return (
    <Accordion>
      <AccordionItem
        className={styles.incidents}
        titleHeadingLevel={2}
        title={`${t.recentIncidents} · ${t.historyCount(count)}`}
      >
        <p className={styles.sourceNote}>{latestOnly ? t.latestOnly : t.last90}</p>
        {count
          ? (
              <ol className={styles.incidentGrid}>
                {euMaintenance.active && (
                  <li id={euMaintenance.id} className={styles.maintenanceCard}>
                    <div className={styles.incidentCardHead}>
                      <Pill state="warn" icon={<Wrench size={16} weight="fill" aria-hidden="true" />}>{t.maintenance.status}</Pill>
                      <span>
                        {t.updated}
                        {' '}
                        <time dateTime={euMaintenance.publishedOn}>{day(euMaintenance.publishedOn, t)}</time>
                      </span>
                    </div>
                    <h3>{t.maintenance.title}</h3>
                    <p>{t.maintenance.description}</p>
                    <dl className={styles.detailGrid}>
                      <div>
                        <dt>{t.maintenance.impact}</dt>
                        <dd>{euMaintenance.serviceName}</dd>
                      </div>
                    </dl>
                    {currentMaintenance && <IncidentFacts incident={currentMaintenance} t={t} />}
                    <p className={styles.sourceNote}>{t.maintenance.timing}</p>
                  </li>
                )}
                {history.map(incident => (
                  <li className={styles.incidentCard} key={`${incident.serviceId}-${incident.startedAt}`}>
                    <div className={styles.incidentCardHead}>
                      <Pill state={incident.ongoing ? 'bad' : 'ok'} icon={incident.ongoing ? <Warning size={16} weight="fill" aria-hidden="true" /> : <CheckCircle size={16} weight="fill" aria-hidden="true" />}>{incident.ongoing ? t.ongoing : t.resolved}</Pill>
                      <span>{t.recorded}</span>
                    </div>
                    <h3>{incident.service}</h3>
                    {incident.reason && <p>{t.reasons[incident.reason]}</p>}
                    <IncidentFacts incident={incident} t={t} />
                  </li>
                ))}
              </ol>
            )
          : <p className={styles.empty}>{t.noIncidents}</p>}
      </AccordionItem>
    </Accordion>
  );
}

export function StatusBoard({ report, t, children }: { report: UptimeReport; t: StatusBoardCopy; children: ReactNode }) {
  const { services } = report;
  const down = services.filter(service => service.state === 'down').length;
  const up = services.filter(service => service.state === 'up').length;
  const ratios = services.map(service => service.uptime90).filter((value): value is number => value !== null);
  const average = ratios.length ? ratios.reduce((sum, value) => sum + value, 0) / ratios.length : null;
  const lastIncident = report.incidents[0];
  const groups = groupOrder
    .map(name => ({ name, members: services.filter(service => service.group === name) }))
    .filter(group => group.members.length);

  let headline = t.allUp(services.length);
  if (down) {
    headline = t.someDown(down, services.length);
  } else if (up < services.length) {
    headline = t.someUp(up, services.length);
  }
  const checked = report.source === 'snapshot'
    ? t.snapshot(day(report.checkedAt, t))
    : t.checked(when(report.checkedAt, t));

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
              <dt>{t.averageUptime}</dt>
              <dd>{percent(average, t, 2)}</dd>
            </div>
            <div>
              <dt>{t.servicesUp}</dt>
              <dd>{`${up} / ${services.length}`}</dd>
            </div>
            <div>
              <dt>{t.lastIncident}</dt>
              <dd>{lastIncident ? day(lastIncident.startedAt, t) : t.noneIn90}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="srv-status-v2-body">
        <div className="sr-container srv-status-v2-console">
          {euMaintenance.active && (
            <aside className={styles.maintenanceBanner} aria-labelledby="maintenance-notice-title">
              <Wrench size={24} weight="fill" aria-hidden="true" />
              <div>
                <span>{t.maintenance.status}</span>
                <h2 id="maintenance-notice-title">{t.maintenance.title}</h2>
                <p>{t.maintenance.summary}</p>
              </div>
            </aside>
          )}
          {groups.map(group => (
            <Card key={group.name} className={styles.group}>
              <div className={styles.sectionHead}>
                <h2>{t.groups[group.name] ?? group.name}</h2>
                <span>{t.serviceCount(group.members.length)}</span>
              </div>
              <ul className={styles.services}>
                {group.members.map(service => <ServiceRow key={service.id} service={service} t={t} />)}
              </ul>
            </Card>
          ))}

          <ul className={styles.legend} aria-label={t.legendLabel}>
            {(['up', 'minor', 'degraded', 'down', 'none'] as const).map((level, index) => (
              <li key={level} data-level={level}>{t.legend[index]}</li>
            ))}
          </ul>

          <IncidentHistory incidents={report.incidents} latestOnly={report.source === 'public'} t={t} />

          <Card className="srv-status-v2-help">
            <CardContent>
              <div>
                <strong>{t.help.title}</strong>
                <span>{t.help.text}</span>
              </div>
              <div>
                <a href="https://wa.me/447441426993" target="_blank" rel="noopener noreferrer">
                  {t.help.whatsapp}
                </a>
                <a href="https://dash.stealthrdp.com/submitticket.php">
                  {t.help.ticket}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

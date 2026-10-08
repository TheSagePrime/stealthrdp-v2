/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { ReactNode } from 'react';
import type { PillState } from '@/components/ui/pill';
import type { SiteLocale } from '@/config/i18n';
import type { StatusBoardCopy } from '@/content/i18n/en/status';
import type { Incident, Service, ServiceState, UptimeReport } from '@/lib/stealth/uptime';
import { CheckCircle, Pause, Question, Warning, Wrench, XCircle } from '@phosphor-icons/react/dist/ssr';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Pill } from '@/components/ui/pill';
import { euMaintenance } from '@/content/status-updates';
import { groupOrder } from '@/lib/stealth/uptime';
import { ResponseChart } from './ResponseChart';
import { DashboardBlocksUptimeBar } from './DashboardBlocksUptimeBar';
import styles from './StatusBoard.module.css';
import { MeasurementTime } from './StatusLive';
import { UptimeHistory } from './UptimeHistory';

/* /status: concise live rows with historical uptime and the incident timeline on demand. */

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

function ServiceRow({ service, t, locale }: { service: Service; t: StatusBoardCopy; locale: SiteLocale }) {
  const state = states[service.state];

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

      {service.days.length > 0 && (
        <DashboardBlocksUptimeBar days={service.days} locale={locale} name={service.name} />
      )}

      <dl className={styles.facts}>
        <div>
          <dt>{t.uptime30}</dt>
          <dd>{percent(service.uptime30, t)}</dd>
        </div>
        <div>
          <dt>{t.uptime90}</dt>
          <dd>{percent(service.uptime90, t)}</dd>
        </div>
        {service.uptime365 !== null && (
          <div>
            <dt>{t.uptime365}</dt>
            <dd>{percent(service.uptime365, t)}</dd>
          </div>
        )}
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
              <dd><MeasurementTime at={service.lastResponseAt} locale={locale} /></dd>
            </div>
          )}
        </dl>
        {service.uptime24 === null && service.uptime7 === null && service.checkIntervalSeconds === null && <p className={styles.sourceNote}>{t.noMetrics}</p>}
        <ResponseChart samples={service.responseSamples} service={service.name} locale={locale} />
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
  const entries = [
    ...(euMaintenance.active
      ? [{ key: euMaintenance.id, at: euMaintenance.publishedOn, maintenance: true as const, incident: undefined }]
      : []),
    ...history.map(incident => ({
      key: `${incident.serviceId}-${incident.startedAt}`,
      at: incident.startedAt,
      maintenance: false as const,
      incident,
    })),
  ].sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  const days = [...new Set(entries.map(entry => entry.at.slice(0, 10)))];
  const entriesByDay = new Map(days.map(date => [date, entries.filter(entry => entry.at.slice(0, 10) === date)]));
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
              <ol className={styles.incidentDays}>
                {days.map((date) => {
                  const dateObj = new Date(`${date}T00:00:00Z`);
                  const dateLabel = `${t.weekdays[(dateObj.getUTCDay() + 6) % 7]}, ${day(date, t)}`;
                  return (
                    <li className={styles.incidentDay} key={date}>
                      <h3>{dateLabel}</h3>
                      <ol className={styles.incidentEvents}>
                        {entriesByDay.get(date)?.map((entry) => (
                          entry.maintenance
                            ? (
                                <li id={euMaintenance.id} className={styles.incidentEvent} key={entry.key}>
                                  <time dateTime={entry.at}>{t.updated}</time>
                                  <div className={styles.incidentEventBody}>
                                    <Pill state="warn" icon={<Wrench size={16} weight="fill" aria-hidden="true" />}>{t.maintenance.status}</Pill>
                                    <h4>{t.maintenance.title}</h4>
                                    <p>{t.maintenance.description}</p>
                                    <p><strong>{t.maintenance.impact}:</strong> {euMaintenance.serviceName}</p>
                                    {currentMaintenance && <IncidentFacts incident={currentMaintenance} t={t} />}
                                    <p className={styles.sourceNote}>{t.maintenance.timing}</p>
                                  </div>
                                </li>
                              )
                            : entry.incident && (
                                <li className={styles.incidentEvent} key={entry.key}>
                                  <time dateTime={entry.at}>{new Date(entry.at).toISOString().slice(11, 16)} UTC</time>
                                  <div className={styles.incidentEventBody}>
                                    <Pill state={entry.incident.ongoing ? 'bad' : 'ok'} icon={entry.incident.ongoing ? <Warning size={16} weight="fill" aria-hidden="true" /> : <CheckCircle size={16} weight="fill" aria-hidden="true" />}>{entry.incident.ongoing ? t.ongoing : t.resolved}</Pill>
                                    <h4>{entry.incident.service}</h4>
                                    {entry.incident.reason && <p>{t.reasons[entry.incident.reason]}</p>}
                                    <IncidentFacts incident={entry.incident} t={t} />
                                  </div>
                                </li>
                              )
                        ))}
                      </ol>
                    </li>
                  );
                })}
              </ol>
            )
          : <p className={styles.empty}>{t.noIncidents}</p>}
      </AccordionItem>
    </Accordion>
  );
}

export function StatusBoard({ report, t, children, locale = 'en' }: { report: UptimeReport; t: StatusBoardCopy; children: ReactNode; locale?: SiteLocale }) {
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
    : <MeasurementTime at={report.checkedAt} locale={locale} updated />;

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
          {services.some(service => service.days.length > 0) && (
            <Accordion className={styles.historyOverviewWrap}>
              <AccordionItem title={t.historyDisclosure} className={styles.historyOverview}>
                <div className={styles.historicalServices}>
                  {services.filter(service => service.days.length > 0).map(service => (
                    <section className={styles.historicalService} key={service.id} aria-label={service.name}>
                      <h3>{service.name}</h3>
                      <UptimeHistory days={service.days} locale={locale} name={service.name} view="calendar" />
                    </section>
                  ))}
                </div>
              </AccordionItem>
            </Accordion>
          )}
          {groups.map(group => (
            <Card key={group.name} className={styles.group}>
              <div className={styles.sectionHead}>
                <h2>{t.groups[group.name] ?? group.name}</h2>
                <span>{t.serviceCount(group.members.length)}</span>
              </div>
              <ul className={styles.services}>
                {group.members.map(service => <ServiceRow key={service.id} service={service} t={t} locale={locale} />)}
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

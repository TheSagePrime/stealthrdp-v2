/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { ReactNode } from 'react';
import type { StatusLevel, UptimeDay } from '@/components/dashboardblocks/status';
import type { SiteLocale } from '@/config/i18n';
import type { StatusBoardCopy } from '@/content/i18n/en/status';
import type { Incident, Service, UptimeReport } from '@/lib/stealth/uptime';
import { Status1 } from '@/components/dashboardblocks/status-01';
import { Status2 } from '@/components/dashboardblocks/status-02';
import { Status3 } from '@/components/dashboardblocks/status-03';
import { euMaintenance } from '@/content/status-updates';
import { groupOrder } from '@/lib/stealth/uptime';
import { MeasurementTime } from './StatusLive';

function day(iso: string, t: StatusBoardCopy): string {
  const date = new Date(iso);
  return t.day(date.getUTCDate(), t.months[date.getUTCMonth()] ?? '', date.getUTCFullYear());
}

function when(iso: string, t: StatusBoardCopy): string {
  return `${day(iso, t)}, ${new Date(iso).toISOString().slice(11, 16)} UTC`;
}

function duration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} s`;
  }
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  return `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60} min` : ''}`;
}

function state(service: Service): StatusLevel {
  // Maintenance explains an outage without changing the measured daily uptime.
  if (euMaintenance.active && service.id === euMaintenance.serviceId && service.state === 'down') {
    return 'maintenance';
  }
  return service.state === 'up' ? 'operational' : service.state === 'down' ? 'major' : 'unknown';
}

function history(service: Service, t: StatusBoardCopy): UptimeDay[] {
  return service.days.map(item => ({
    label: day(item.date, t),
    status:
      item.ratio === null
        ? 'unknown'
        : item.ratio >= 100
          ? 'operational'
          : item.ratio >= 99
            ? 'degraded'
            : item.ratio >= 95
              ? 'partial'
              : 'major',
    uptime: item.ratio ?? undefined,
    note: item.downSeconds === null ? undefined : `${t.incidentDuration}: ${duration(item.downSeconds)}`,
  }));
}

export function IncidentHistory({
  incidents,
  latestOnly,
  t,
}: {
  incidents: Incident[];
  latestOnly: boolean;
  t: StatusBoardCopy;
}) {
  const history = incidents.filter(
    incident => !(euMaintenance.active && incident.serviceId === euMaintenance.serviceId && incident.ongoing),
  );
  return (
    <section className="grid gap-5" aria-label={t.recentIncidents}>
      <div>
        <h2 className="text-xl font-semibold">{t.recentIncidents}</h2>
        <p className="text-sm text-muted-foreground">{latestOnly ? t.latestOnly : t.last90}</p>
      </div>
      {euMaintenance.active && (
        <Status3
          title={t.maintenance.title}
          severity="maintenance"
          statusLabel={t.maintenance.status}
          affected={[euMaintenance.serviceName]}
          affectedLabel={t.maintenance.impact}
          started={`${t.updated}: ${day(euMaintenance.publishedOn, t)}`}
          updates={[
            {
              stage: t.maintenance.status,
              time: day(euMaintenance.publishedOn, t),
              message: `${t.maintenance.description} ${t.maintenance.timing}`,
            },
          ]}
        />
      )}
      {history.map(incident => (
        <Status3
          key={`${incident.serviceId}-${incident.startedAt}`}
          title={incident.service}
          severity={incident.ongoing ? 'major' : 'operational'}
          statusLabel={incident.ongoing ? t.ongoing : t.resolved}
          affected={[incident.service]}
          affectedLabel={t.maintenance.impact}
          started={`${t.started}: ${when(incident.startedAt, t)}`}
          updates={[
            ...(!incident.ongoing
              ? [
                  {
                    stage: t.resolved,
                    time: when(
                      new Date(Date.parse(incident.startedAt) + incident.durationSeconds * 1000).toISOString(),
                      t,
                    ),
                    message: `${t.incidentDuration}: ${duration(incident.durationSeconds)}`,
                  },
                ]
              : []),
            {
              stage: t.recorded,
              time: when(incident.startedAt, t),
              message: incident.reason ? t.reasons[incident.reason] : t.states.down,
            },
          ]}
        />
      ))}
      {!history.length && !euMaintenance.active && <p>{t.noIncidents}</p>}
    </section>
  );
}

/** Page composition and data adapters; all status displays come from DashboardBlocks. */
export function StatusBoard({
  report,
  t,
  children,
  locale = 'en',
}: {
  report: UptimeReport;
  t: StatusBoardCopy;
  children: ReactNode;
  locale?: SiteLocale;
}) {
  const services = report.services;
  const down = services.filter(service => service.state === 'down').length;
  const up = services.filter(service => service.state === 'up').length;
  const headline = down
    ? t.someDown(down, services.length)
    : up === services.length
      ? t.allUp(services.length)
      : t.someUp(up, services.length);
  const groups = [...new Set([...groupOrder, ...services.map(service => service.group)])];
  return (
    <div className="
      sr-container grid gap-6 py-10
      sm:py-16
    "
    >
      <header className="grid max-w-3xl gap-3">{children}</header>
      <Status1
        title={t.servicesUp}
        summary={headline}
        description={
          report.source === 'snapshot'
            ? (
                t.snapshot(day(report.checkedAt, t))
              )
            : (
                <MeasurementTime at={report.checkedAt} locale={locale} updated />
              )
        }
        services={services.map(service => ({
          name: service.name,
          status: state(service),
          statusLabel:
            t.states[service.state],
          description:
            euMaintenance.active && service.id === euMaintenance.serviceId
              ? t.maintenance.summary
              : (t.groups[service.group] ?? service.group),
        }))}
      />
      {groups.map((group) => {
        const members = services.filter(service => service.group === group);
        if (!members.length) {
          return null;
        }
        return (
          <Status2
            key={group}
            title={t.groups[group] ?? group}
            description={t.last90}
            startLabel={t.daysAgo(90)}
            endLabel={t.today}
            uptimeLabel={t.historyUptimeLabel}
            services={members.map(service => ({
              name: service.name,
              days: history(service, t),
              // The provider's rolling ratio is authoritative, not an average of bars.
              uptime: service.uptime90 === null ? '—' : t.percent(service.uptime90.toFixed(3).replace('.', t.decimal)),
            }))}
          />
        );
      })}
      <IncidentHistory incidents={report.incidents} latestOnly={report.source === 'public'} t={t} />
    </div>
  );
}

import { z } from 'zod';
import { uptime as snapshot } from '@/lib/stealth/content';
import { Env } from '@/libs/Env';
import 'server-only';

/* Service status for /status and /api/uptime.
   1. UptimeRobot API (UPTIMEROBOT_API_KEY, production): daily uptime, downtime, response time, incident log.
   2. Public status page feed: recovers missing/suspect API history; also works without a key.
   3. The dated snapshot in src/content/uptime.json when both are unreachable.
   Days are UTC calendar days; the last one is today so far. */

const HISTORY_DAYS = 90;

export type ServiceState = 'up' | 'down' | 'paused' | 'unknown';

export type UptimeDay = { date: string; ratio: number | null; downSeconds: number | null };

export type Incident = { service: string; startedAt: string; durationSeconds: number; reason: string | null };

export type Service = {
  id: string;
  name: string;
  group: string;
  state: ServiceState;
  uptime30: number | null;
  uptime90: number | null;
  days: UptimeDay[];
  responseMs: number | null;
  lastIncident: Incident | null;
};

export type UptimeReport = {
  source: 'api' | 'public' | 'snapshot';
  checkedAt: string;
  services: Service[];
  incidents: Incident[];
};

export const groupOrder = ['USA servers', 'Europe servers', 'Platform'];

function groupFor(name: string): string {
  if (/^usa\b/i.test(name)) {
    return 'USA servers';
  }
  if (/^eu\b|\bnl\b/i.test(name)) {
    return 'Europe servers';
  }
  return 'Platform';
}

const DAY = 86_400;

function percent(value: unknown): number | null {
  if (typeof value !== 'number' && (typeof value !== 'string' || value.trim() === '')) {
    return null;
  }
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 && number <= 100 ? number : null;
}

/** The last HISTORY_DAYS UTC days, oldest first, as [date, startUnix, endUnix]. */
function historyRanges(now = new Date()): Array<[string, number, number]> {
  const nowUnix = Math.floor(now.getTime() / 1000);
  const todayStart = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000);
  return Array.from({ length: HISTORY_DAYS }, (_, index) => {
    const start = todayStart - (HISTORY_DAYS - 1 - index) * DAY;
    const end = Math.min(start + DAY - 1, nowUnix);
    return [new Date(start * 1000).toISOString().slice(0, 10), start, end];
  });
}

function sortServices(services: Service[]): Service[] {
  return services.sort((a, b) =>
    groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) || a.name.localeCompare(b.name, 'en', { numeric: true }));
}

function recentIncidents(incidents: Incident[], now = Date.now()): Incident[] {
  const since = now - HISTORY_DAYS * DAY * 1000;
  return incidents
    .filter(incident => Date.parse(incident.startedAt) >= since)
    .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))
    .slice(0, 12);
}

/* 1. UptimeRobot API v2 ------------------------------------------------------------------------ */

const apiMonitor = z.object({
  id: z.number(),
  friendly_name: z.string(),
  status: z.number(),
  create_datetime: z.number().optional(),
  custom_uptime_ranges: z.string().nullish(),
  average_response_time: z.union([z.string(), z.number()]).optional(),
  logs: z.array(z.object({
    type: z.number(),
    datetime: z.number(),
    duration: z.number(),
    reason: z.object({ detail: z.string().optional() }).partial().optional(),
  })).optional(),
});

const apiResponse = z.object({ stat: z.literal('ok'), monitors: z.array(apiMonitor) });

function apiState(status: number): ServiceState {
  if (status === 2) {
    return 'up';
  }
  if (status === 8 || status === 9) {
    return 'down';
  }
  if (status === 0) {
    return 'paused';
  }
  return 'unknown';
}

type ApiMonitor = z.infer<typeof apiMonitor>;

function apiIncidents(monitor: ApiMonitor): Incident[] {
  return (monitor.logs ?? [])
    .filter(log => log.type === 1)
    .map(log => ({
      service: monitor.friendly_name,
      startedAt: new Date(log.datetime * 1000).toISOString(),
      durationSeconds: log.duration === 0 && apiState(monitor.status) === 'down'
        ? Math.max(0, Math.floor(Date.now() / 1000) - log.datetime)
        : log.duration,
      reason: log.reason?.detail ?? null,
    }))
    .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
}

function fromApi(monitors: ApiMonitor[], ranges: Array<[string, number, number]>): Service[] {
  return monitors.map((monitor) => {
    const uptimes = (monitor.custom_uptime_ranges ?? '').split('-');
    const response = Number(monitor.average_response_time);
    return {
      id: String(monitor.id),
      name: monitor.friendly_name,
      group: groupFor(monitor.friendly_name),
      state: apiState(monitor.status),
      days: ranges.map(([date, , end], index) => {
        // Days before the monitor existed have no data.
        if (end < (monitor.create_datetime ?? 0)) {
          return { date, ratio: null, downSeconds: null };
        }
        // custom_down_durations belongs to custom_uptime_ratios, not these date ranges.
        return { date, ratio: percent(uptimes[index]), downSeconds: null };
      }),
      uptime30: percent(uptimes[HISTORY_DAYS]),
      uptime90: percent(uptimes[HISTORY_DAYS + 1]),
      responseMs: Number.isFinite(response) && response > 0 ? Math.round(response) : null,
      lastIncident: apiIncidents(monitor)[0] ?? null,
    };
  });
}

function hasOnlyZeroHistory(service: Service): boolean {
  const ratios = service.days.map(day => day.ratio)
    .filter(ratio => ratio !== null);
  return service.uptime30 === 0 && service.uptime90 === 0
    && ratios.length > 0 && ratios.every(ratio => ratio === 0);
}

function needsHistoryFallback(service: Service, createdAt: number): boolean {
  return service.uptime30 === null || service.uptime90 === null || hasOnlyZeroHistory(service)
    || service.days.some(day => day.ratio === null && Date.parse(day.date) / 1000 + DAY > createdAt);
}

/** Recover history by monitor ID and UTC date; keep API state, responses and incidents. */
function withPublicHistory(service: Service, fallback: Service, createdAt: number): Service {
  // A full zero history can be real. Replace it only with independently measured history.
  const replaceZeros = hasOnlyZeroHistory(service) && !hasOnlyZeroHistory(fallback)
    && [fallback.uptime30, fallback.uptime90, ...fallback.days.map(day => day.ratio)]
      .some(ratio => ratio !== null && ratio > 0);
  const daysByDate = new Map(fallback.days.map(day => [day.date, day]));
  return {
    ...service,
    uptime30: replaceZeros ? fallback.uptime30 : service.uptime30 ?? fallback.uptime30,
    uptime90: replaceZeros ? fallback.uptime90 : service.uptime90 ?? fallback.uptime90,
    days: service.days.map((day) => {
      if (Date.parse(day.date) / 1000 + DAY <= createdAt || (!replaceZeros && day.ratio !== null)) {
        return day;
      }
      return { ...day, ratio: daysByDate.get(day.date)?.ratio ?? null, downSeconds: null };
    }),
  };
}

async function fromUptimeRobotApi(apiKey: string): Promise<UptimeReport> {
  const now = new Date();
  const ranges = historyRanges(now);
  const nowUnix = Math.floor(now.getTime() / 1000);
  const extra = [[nowUnix - 30 * DAY, nowUnix], [ranges[0]![1], nowUnix]];
  const body = new URLSearchParams({
    api_key: apiKey,
    format: 'json',
    logs: '1',
    log_types: '1',
    logs_limit: '20',
    response_times: '1',
    response_times_limit: '1',
    custom_uptime_ranges: [...ranges.map(([, start, end]) => [start, end]), ...extra]
      .map(([start, end]) => `${start}_${end}`)
      .join('-'),
  });
  const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' },
    body,
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`UptimeRobot API returned ${response.status}`);
  }
  const { monitors } = apiResponse.parse(await response.json());
  const createdAtById = new Map(monitors.map(monitor => [String(monitor.id), monitor.create_datetime ?? 0]));
  let services = sortServices(fromApi(monitors, ranges));
  if (services.some(service => needsHistoryFallback(service, createdAtById.get(service.id) ?? 0))) {
    try {
      const fallback = await fromPublicStatusPage();
      const byId = new Map(fallback.services.map(service => [service.id, service]));
      services = services.map((service) => {
        const history = byId.get(service.id);
        return history ? withPublicHistory(service, history, createdAtById.get(service.id) ?? 0) : service;
      });
    } catch {
      // History recovery must not discard fresh API state or invent missing measurements.
    }
  }
  return {
    source: 'api',
    checkedAt: now.toISOString(),
    services,
    incidents: recentIncidents(monitors.flatMap(apiIncidents)),
  };
}

/* 2. Public status page feed -------------------------------------------------------------------- */

const ratioValue = z.union([z.string(), z.number()]).nullish();
const ratioObject = z.object({ ratio: ratioValue }).nullish();

const publicMonitor = z.object({
  'monitorId': z.number(),
  'name': z.string(),
  'statusClass': z.string(),
  'dailyRatios': z.array(z.object({ date: z.string(), ratio: ratioValue, label: z.string().optional() })).optional(),
  '30dRatio': ratioObject.optional(),
  '90dRatio': ratioObject.optional(),
  'lastDowntime': z.object({ date: z.string(), duration: z.number(), reason: z.string().optional() }).nullable().optional(),
});

const publicResponse = z.object({ psp: z.object({ monitors: z.array(publicMonitor) }) });

function publicState(statusClass: string): ServiceState {
  if (statusClass === 'success') {
    return 'up';
  }
  if (statusClass === 'danger') {
    return 'down';
  }
  if (statusClass === 'black') {
    return 'paused';
  }
  return 'unknown';
}

function fromPublicFeed(body: unknown): Service[] {
  return publicResponse.parse(body).psp.monitors.map((monitor) => {
    const last = monitor.lastDowntime;
    return {
      id: String(monitor.monitorId),
      name: monitor.name,
      group: groupFor(monitor.name),
      state: publicState(monitor.statusClass),
      // "black" marks days with no data (before the monitor existed, or paused).
      days: (monitor.dailyRatios ?? []).slice(-HISTORY_DAYS).map(day => ({
        date: day.date,
        ratio: day.label === 'black' ? null : percent(day.ratio),
        downSeconds: null,
      })),
      uptime30: percent(monitor['30dRatio']?.ratio),
      uptime90: percent(monitor['90dRatio']?.ratio),
      responseMs: null,
      lastIncident: last
        ? {
            service: monitor.name,
            startedAt: new Date(`${last.date.replace(' ', 'T')}Z`).toISOString(),
            durationSeconds: last.duration,
            reason: null,
          }
        : null,
    };
  });
}

async function fromPublicStatusPage(): Promise<UptimeReport> {
  const response = await fetch('https://stats.uptimerobot.com/api/getMonitorList/yvnV3u7x00?page=1', {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Public status feed returned ${response.status}`);
  }
  const services = fromPublicFeed(await response.json());
  const incidents = services.flatMap(service => (service.lastIncident ? [service.lastIncident] : []));
  return { source: 'public', checkedAt: new Date().toISOString(), services: sortServices(services), incidents: recentIncidents(incidents) };
}

/* 3. Dated snapshot ---------------------------------------------------------------------------- */

function fromSnapshot(): UptimeReport {
  return {
    source: 'snapshot',
    checkedAt: snapshot.checkedAt,
    services: sortServices(snapshot.monitors.map((monitor, index) => ({
      id: `snapshot-${index}`,
      name: monitor.label,
      group: groupFor(monitor.region),
      state: monitor.status === 'up' ? 'up' : 'unknown',
      days: [],
      uptime30: null,
      uptime90: percent(monitor.uptimeRatio),
      responseMs: null,
      lastIncident: null,
    }))),
    incidents: [],
  };
}

export async function getUptimeReport(): Promise<UptimeReport> {
  const apiKey = Env.UPTIMEROBOT_API_KEY;
  if (apiKey) {
    try {
      return await fromUptimeRobotApi(apiKey);
    } catch {
      // Fall through to the public feed.
    }
  }
  try {
    return await fromPublicStatusPage();
  } catch {
    return fromSnapshot();
  }
}

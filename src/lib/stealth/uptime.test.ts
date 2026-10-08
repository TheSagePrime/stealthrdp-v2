import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getUptimeReport, reconcileServices, formatDuration } from './uptime';

vi.mock('@/libs/Env', () => ({ Env: { UPTIMEROBOT_API_KEY: 'test-key' } }));

const API = 'https://api.uptimerobot.com/v2/getMonitors';
const FEED = 'https://stats.uptimerobot.com/api/getMonitorList/yvnV3u7x00?page=1';
const NOW = new Date('2026-10-01T12:00:00Z');

function stub(responses: Record<string, unknown>) {
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    if (!(url in responses)) {
      throw new Error(`unreachable ${url}`);
    }
    return Response.json(responses[url]);
  }));
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('uptime report', () => {
  it('maps the 90 daily ranges, then the 30- and 90-day ranges, from the API', async () => {
    const daily = Array.from({ length: 90 }, (_, index) => (index === 89 ? '98.500' : '100.000'));
    const downs = Array.from({ length: 92 }, (_, index) => (index === 89 ? '1296' : '0'));
    stub({
      [API]: {
        stat: 'ok',
        monitors: [{
          id: 1,
          friendly_name: 'USA Server 9742',
          status: 9,
          create_datetime: Date.parse('2026-07-06T08:00:00Z') / 1000,
          custom_uptime_ranges: [...daily, '99.950', '99.770'].join('-'),
          custom_down_durations: downs.join('-'),
          average_response_time: '41.6',
          logs: [{ type: 1, datetime: Date.parse('2026-10-01T03:00:00Z') / 1000, duration: 1296, reason: { detail: 'Connection Timeout' } }],
        }],
      },
    });

    const report = await getUptimeReport();
    const [service] = report.services;

    expect(report.source).toBe('api');
    expect(service).toMatchObject({ name: 'USA Server 9742', group: 'USA servers', state: 'down', uptime30: 99.95, uptime90: 99.77, responseMs: 42 });
    expect(service?.days).toHaveLength(90);
    expect(service?.days.slice(0, 3).map(day => day.ratio)).toEqual([null, null, 100]);
    expect(service?.days.at(-1)).toEqual({ date: '2026-10-01', ratio: 98.5, downSeconds: 1296 });
    expect(report.incidents).toEqual([{ service: 'USA Server 9742', startedAt: '2026-10-01T03:00:00.000Z', durationSeconds: 1296, reason: 'Connection Timeout' }]);
  });

  it('reconciles zero-history API data with the public feed', async () => {
    // API returns all-zero custom_uptime_ranges for the EU monitor (bug)
    const daily = Array.from({ length: 90 }, () => '0.000');
    const downs = Array.from({ length: 92 }, () => '86400');
    // Public feed has correct data: 88 days at 100%, last 2 days low
    const feedDaily = [
      ...Array.from({ length: 88 }, (_, i) => ({
        date: `2026-07-${String(i + 1).padStart(2, '0')}`,
        ratio: '100.000',
        label: 'excellent' as const, color: 'green',
      })),
      { date: '2026-09-30', ratio: '100.000', label: 'excellent' as const, color: 'green' },
      { date: '2026-10-01', ratio: '34.300', label: 'poor' as const, color: 'red' },
    ];
    stub({
      [API]: {
        stat: 'ok',
        monitors: [{
          id: 795874880,
          friendly_name: 'EU 4 NL Server',
          status: 9,
          create_datetime: Date.parse('2023-12-08T19:42:27Z') / 1000,
          custom_uptime_ranges: [...daily, '0.000', '0.000'].join('-'),
          custom_down_durations: downs.join('-'),
          average_response_time: '15.0',
          logs: [{ type: 1, datetime: Date.parse('2026-10-01T02:25:06Z') / 1000, duration: 0, reason: { detail: 'Timeout' } }],
        }],
      },
      [FEED]: {
        psp: {
          monitors: [{
            'monitorId': 795874880,
            'name': 'EU 4 NL Server',
            'statusClass': 'danger',
            'dailyRatios': feedDaily,
            '30dRatio': { ratio: '99.357' },
            '90dRatio': { ratio: '99.759' },
            'lastDowntime': { date: '2026-10-01 02:25:06', duration: 0, reason: 'Timeout' },
          }],
        },
      },
    });

    const report = await getUptimeReport();
    const [service] = report.services;

    // Source is 'api' because the API succeeded (with reconciliation)
    expect(report.source).toBe('reconciled');
    expect(service).toMatchObject({
      id: '795874880',
      name: 'EU 4 NL Server',
      group: 'Europe servers',
      uptime30: 99.357,
      uptime90: 99.759,
    });
    // Daily bars should come from the public feed, not the all-zero API data
    expect(service?.days).toHaveLength(90);
    // The last two days (our mocked public feed data) should have real values
    expect(service?.days.slice(-2)?.[0]?.ratio).toBe(100);
    expect(service?.days.slice(-2)?.[1]?.ratio).toBe(34.3);
  });

  it('falls back to the public status feed when the API fails', async () => {
    stub({
      [FEED]: {
        psp: {
          monitors: [{
            'monitorId': 2,
            'name': 'EU 4 NL Server',
            'statusClass': 'success',
            'dailyRatios': [{ date: '2026-09-30', ratio: '0.000', label: 'black' }, { date: '2026-10-01', ratio: '99.841', label: 'good' }],
            '90dRatio': { ratio: '99.974' },
            'lastDowntime': { date: '2026-08-17 01:40:05', duration: 201, reason: 'Incident detected' },
          }],
        },
      },
    });

    const report = await getUptimeReport();

    expect(report.source).toBe('public');
    expect(report.services[0]).toMatchObject({ group: 'Europe servers', state: 'up', uptime90: 99.974, uptime30: null });
    expect(report.services[0]?.days.map(day => day.ratio)).toEqual([null, 99.841]);
    expect(report.incidents[0]).toMatchObject({ startedAt: '2026-08-17T01:40:05.000Z', durationSeconds: 201 });
  });

  it('shows the saved snapshot when both sources are unreachable', async () => {
    stub({});

    const report = await getUptimeReport();

    expect(report.source).toBe('snapshot');
    expect(report.services).toHaveLength(10);
  });
});

describe('reconcileServices', () => {
  it('replaces zero-history API services with matching public feed data', () => {
    const apiServices = [{
      id: '795874880',
      name: 'EU 4 NL Server',
      group: 'Europe servers',
      state: 'down' as const,
      uptime30: 0,
      uptime90: 0,
      days: Array.from({ length: 90 }, () => ({ date: '2026-10-01', ratio: 0, downSeconds: 86_400 })),
      responseMs: 15,
      lastIncident: { service: 'EU 4 NL Server', startedAt: '2026-10-01T02:25:06Z', durationSeconds: 0, reason: null },
    }, {
      id: '1',
      name: 'USA Server 01',
      group: 'USA servers',
      state: 'up' as const,
      uptime30: 99.95,
      uptime90: 99.77,
      days: Array.from({ length: 90 }, () => ({ date: '2026-10-01', ratio: 100, downSeconds: 0 })),
      responseMs: 42,
      lastIncident: null,
    }];

    const publicServices = [{
      id: '795874880',
      name: 'EU 4 NL Server',
      group: 'Europe servers',
      state: 'down' as const,
      uptime30: 99.357,
      uptime90: 99.759,
      days: Array.from({ length: 90 }, () => ({ date: '2026-10-01', ratio: 100, downSeconds: null })),
      responseMs: null,
      lastIncident: null,
    }, {
      id: '999',
      name: 'Some Other Service',
      group: 'Platform',
      state: 'up' as const,
      uptime30: 100,
      uptime90: 100,
      days: [],
      responseMs: null,
      lastIncident: null,
    }];

    const { services, reconciled } = reconcileServices(apiServices, publicServices);

    expect(reconciled).toBe(true);
    // EU service should use public feed data
    const euService = services.find(s => s.id === '795874880');
    expect(euService?.uptime90).toBe(99.759);
    expect(euService?.uptime30).toBe(99.357);
    // USA service should remain from API
    const usaService = services.find(s => s.id === '1');
    expect(usaService?.uptime90).toBe(99.77);
  });

  it('returns unchanged when no API service has all-zero history', () => {
    const apiServices = [{
      id: '1', name: 'Service A', group: 'Platform', state: 'up' as const,
      uptime30: 99.9, uptime90: 99.95,
      days: Array.from({ length: 90 }, () => ({ date: '2026-10-01', ratio: 100, downSeconds: 0 })),
      responseMs: null, lastIncident: null,
    }];
    const publicServices = [{
      id: '1', name: 'Service A', group: 'Platform', state: 'up' as const,
      uptime30: 99.9, uptime90: 99.95,
      days: Array.from({ length: 90 }, () => ({ date: '2026-10-01', ratio: 100, downSeconds: null })),
      responseMs: null, lastIncident: null,
    }];

    const { services, reconciled } = reconcileServices(apiServices, publicServices);
    expect(reconciled).toBe(false);
    expect(services).toBe(apiServices); // same reference
  });

  it('returns unchanged when no public feed match exists for the bad service', () => {
    const apiServices = [{
      id: '999', name: 'Mystery Service', group: 'Platform', state: 'up' as const,
      uptime30: 0, uptime90: 0,
      days: Array.from({ length: 90 }, () => ({ date: '2026-10-01', ratio: 0, downSeconds: 0 })),
      responseMs: null, lastIncident: null,
    }];
    const publicServices: any[] = [];

    const { services, reconciled } = reconcileServices(apiServices, publicServices);
    expect(reconciled).toBe(false);
    expect((services[0] as any).uptime90).toBe(0); // unchanged
  });
});

describe('formatDuration', () => {
  it('shows seconds for a short past incident', () => {
    expect(formatDuration(5)).toBe('5 s');
  });

  it('shows minutes', () => {
    expect(formatDuration(180)).toBe('3 min');
  });

  it('shows hours', () => {
    expect(formatDuration(7200)).toBe('2 h');
  });

  it('shows hours and minutes', () => {
    expect(formatDuration(7500)).toBe('2 h 5 min');
  });

  it('shows elapsed time for ongoing incident (0 seconds + startedAt)', () => {
    const startedAt = new Date(Date.now() - 3600_000).toISOString();
    const result = formatDuration(0, startedAt);
    expect(result).toMatch(/1 h( \d+ min)?/);
  });

  it('shows seconds for ongoing incident started very recently', () => {
    const startedAt = new Date(Date.now() - 5000).toISOString();
    const result = formatDuration(0, startedAt);
    expect(result).toBe('5 s');
  });

  it('returns "0 s" when duration is 0 and no startedAt is provided', () => {
    expect(formatDuration(0)).toBe('0 s');
  });
});
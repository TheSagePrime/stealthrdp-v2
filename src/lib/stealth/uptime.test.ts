import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getUptimeReport } from './uptime';

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
          // Created on the third day shown: the first two days have no data.
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

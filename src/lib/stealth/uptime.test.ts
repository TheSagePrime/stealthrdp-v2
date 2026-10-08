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
    // API custom_down_durations is not indexed by custom_uptime_ranges.
    expect(service?.days.at(-1)).toEqual({ date: '2026-10-01', ratio: 98.5, downSeconds: null });
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

  it.each(['', ' ', null, undefined])('keeps missing API history (%s) unavailable when recovery fails', async (value) => {
    stub({ [API]: { stat: 'ok', monitors: [{ id: 3, friendly_name: 'New server', status: 1, custom_uptime_ranges: value }] } });

    const report = await getUptimeReport();

    expect(report.source).toBe('api');
    expect(report.services[0]).toMatchObject({ state: 'unknown', uptime30: null, uptime90: null });
    expect(report.services[0]?.days.every(day => day.ratio === null)).toBe(true);
  });

  it('repairs the live all-zero outage history without replacing current API metadata or other servers', async () => {
    stub({
      [API]: {
        stat: 'ok',
        monitors: [
          {
            id: 42,
            friendly_name: 'EU new future monitor',
            status: 9,
            custom_uptime_ranges: Array.from({ length: 92 }).fill('0.000').join('-'),
            average_response_time: '82',
            logs: [{ type: 1, datetime: NOW.getTime() / 1000 - 86400, duration: 0, reason: { detail: 'Timeout' } }],
          },
          { id: 43, friendly_name: 'USA other server', status: 2, custom_uptime_ranges: Array.from({ length: 92 }).fill('100.000').join('-') },
        ],
      },
      [FEED]: {
        psp: {
          monitors: [
            {
              'monitorId': 42,
              'name': 'Old public display name',
              'statusClass': 'success',
              // Deliberately unordered: recovery must use dates, not array positions.
              'dailyRatios': [{ date: '2026-10-01', ratio: '0.000' }, { date: '2026-09-29', ratio: '100.000' }, { date: '2026-09-30', ratio: '50.000' }],
              '30dRatio': { ratio: '96.667' },
              '90dRatio': { ratio: '98.889' },
              'lastDowntime': { date: '2026-08-17 01:40:05', duration: 201 },
            },
            { 'monitorId': 43, 'name': 'USA other server', 'statusClass': 'danger', '90dRatio': { ratio: '90.000' } },
          ],
        },
      },
    });

    const report = await getUptimeReport();
    const service = report.services.find(service => service.id === '42');

    expect(report.source).toBe('api');
    expect(service).toMatchObject({ name: 'EU new future monitor', state: 'down', responseMs: 82, uptime30: 96.667, uptime90: 98.889 });
    expect(service?.days.slice(-3).map(day => day.ratio)).toEqual([100, 50, 0]);
    expect(service?.days[0]?.ratio).toBeNull();
    expect(service?.lastIncident).toMatchObject({ startedAt: '2026-09-30T12:00:00.000Z', durationSeconds: 86400, reason: 'Timeout' });
    expect(report.incidents[0]).toEqual(service?.lastIncident);
    expect(report.services.find(service => service.id === '43')).toMatchObject({ state: 'up', uptime30: 100, uptime90: 100 });
  });

  it('fills partial history by ID and date without changing measured zero days or pre-monitor dates', async () => {
    const values = Array.from({ length: 92 }).fill('100.000');
    values[87] = '0.000';
    values[88] = ' ';
    values[89] = 'invalid';
    values[90] = '';
    values[91] = '101';
    stub({
      [API]: { stat: 'ok', monitors: [{ id: 7, friendly_name: 'USA newly added', status: 2, create_datetime: Date.parse('2026-09-29T08:00:00Z') / 1000, custom_uptime_ranges: values.join('-') }] },
      [FEED]: { psp: { monitors: [{
        'monitorId': 7,
        'name': 'USA newly added',
        'statusClass': 'success',
        'dailyRatios': [{ date: '2026-07-04', ratio: '100' }, { date: '2026-09-29', ratio: '100' }, { date: '2026-09-30', ratio: '99.5' }, { date: '2026-10-01', ratio: '100' }],
        '30dRatio': { ratio: '98.1' },
        '90dRatio': { ratio: '99.2' },
      }] } },
    });

    const { services: [service] } = await getUptimeReport();

    expect(service).toMatchObject({ uptime30: 98.1, uptime90: 99.2 });
    expect(service?.days[0]?.ratio).toBeNull();
    expect(service?.days.slice(-3).map(day => day.ratio)).toEqual([0, 99.5, 100]);
  });

  it('keeps a future monitor absent from the public page and leaves its missing history unavailable', async () => {
    stub({
      [API]: { stat: 'ok', monitors: [{ id: 99, friendly_name: 'New server', status: 2 }] },
      [FEED]: { psp: { monitors: [{ 'monitorId': 100, 'name': 'New server', 'statusClass': 'success', '90dRatio': { ratio: '100' } }] } },
    });

    const report = await getUptimeReport();

    expect(report.services).toHaveLength(1);
    expect(report.services[0]).toMatchObject({ id: '99', state: 'up', uptime30: null, uptime90: null });
    expect(report.services[0]?.days.every(day => day.ratio === null)).toBe(true);
  });

  it.each([true, false])('preserves genuine all-zero history when public recovery is available: %s', async (available) => {
    stub({
      [API]: { stat: 'ok', monitors: [{ id: 5, friendly_name: 'Offline since creation', status: 9, custom_uptime_ranges: Array.from({ length: 92 }).fill('0').join('-') }] },
      ...(available ? { [FEED]: { psp: { monitors: [{ 'monitorId': 5, 'name': 'Offline since creation', 'statusClass': 'danger', '90dRatio': { ratio: '0' }, '30dRatio': { ratio: '0' }, 'dailyRatios': [{ date: '2026-10-01', ratio: '0' }] }] } } } : {}),
    });

    const { services: [service] } = await getUptimeReport();

    expect(service).toMatchObject({ state: 'down', uptime30: 0, uptime90: 0 });
    expect(service?.days.every(day => day.ratio === 0)).toBe(true);
  });

  it('keeps absent, blank and invalid public ratios unavailable, while retaining genuine zero', async () => {
    stub({ [FEED]: { psp: { monitors: [{
      'monitorId': 8,
      'name': 'Public server',
      'statusClass': 'danger',
      'dailyRatios': [
        { date: '2026-09-24', ratio: null },
        { date: '2026-09-25' },
        { date: '2026-09-26', ratio: '' },
        { date: '2026-09-27', ratio: ' ' },
        { date: '2026-09-28', ratio: 'bad' },
        { date: '2026-09-29', ratio: '101' },
        { date: '2026-09-30', ratio: '0', label: 'black' },
        { date: '2026-10-01', ratio: 0 },
      ],
      '30dRatio': { ratio: '' },
      '90dRatio': null,
    }] } } });

    const report = await getUptimeReport();

    expect(report.source).toBe('public');
    expect(report.services[0]).toMatchObject({ uptime30: null, uptime90: null });
    expect(report.services[0]?.days.map(day => day.ratio)).toEqual([null, null, null, null, null, null, null, 0]);
  });
});

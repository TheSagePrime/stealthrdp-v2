import type { Incident, Service, UptimeReport } from '@/lib/stealth/uptime';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import en from '@/content/i18n/en/status';
import { IncidentHistory, StatusBoard } from './StatusBoard';

vi.mock('@/lib/stealth/uptime', () => ({ groupOrder: ['USA servers', 'Europe servers', 'Platform'] }));

const current: Incident = { serviceId: '795874880', service: 'EU 4 NL Server', startedAt: '2026-10-08T02:25:06.000Z', durationSeconds: 3600, ongoing: true, reason: 'timeout' };
const resolved: Incident = { serviceId: '2', service: 'USA Example', startedAt: '2026-10-07T12:00:00.000Z', durationSeconds: 60, ongoing: false, reason: 'connection' };

const service: Service = {
  id: '795874880',
  name: 'EU 4 NL Server',
  group: 'Europe servers',
  state: 'down',
  uptime24: 75,
  uptime7: 96,
  uptime30: 99,
  uptime90: 99.7,
  days: [{ date: '2026-10-07', ratio: 100, downSeconds: null }, { date: '2026-10-08', ratio: 75, downSeconds: null }],
  responseMs: 82,
  monitorKind: 'network',
  checkIntervalSeconds: 60,
  lastResponseAt: '2026-10-07T23:59:00.000Z',
  lastIncident: current,
};

describe('public status information', () => {
  it('opens and closes the history grid with keyboard input, retaining maintenance and recovery details', async () => {
    await render(<IncidentHistory incidents={[current, resolved]} latestOnly={false} t={en.board} />);

    expect(page.getByText(en.board.maintenance.description)).not.toBeVisible();

    const summary = document.querySelector('summary');
    summary?.focus();
    await userEvent.keyboard('{Enter}');

    expect(page.getByText(en.board.maintenance.description)).toBeVisible();
    expect(page.getByText(en.board.maintenance.timing)).toBeVisible();
    expect(page.getByText('Recent history · 2 updates', { exact: true })).toBeVisible();
    expect(page.getByText('1 h', { exact: true })).toBeVisible();
    expect(page.getByText(en.board.resolved, { exact: true })).toBeVisible();
    expect(page.getByText(en.board.reasons.connection)).toBeVisible();
    expect(document.querySelectorAll('ol > li')).toHaveLength(2);

    summary?.focus();
    await userEvent.keyboard('{Enter}');

    expect(page.getByText(en.board.maintenance.description)).not.toBeVisible();
  });

  it('keeps maintenance context visible while history is closed and preserves the measured down state', async () => {
    const report: UptimeReport = { source: 'api', checkedAt: '2026-10-08T03:25:06.000Z', services: [service], incidents: [current] };
    await render(<StatusBoard report={report} t={en.board}>{null}</StatusBoard>);

    expect(page.getByText(en.board.maintenance.summary)).toBeVisible();
    expect(page.getByText('Down', { exact: true })).toBeVisible();
    expect(page.getByText(en.board.maintenance.description)).not.toBeVisible();
    expect(page.getByText(en.board.monitorKinds.network)).not.toBeVisible();

    await userEvent.click(page.getByText(en.board.serviceDetails, { exact: true }));

    expect(page.getByText(en.board.monitorKinds.network)).toBeVisible();
    expect(page.getByText('75.000%', { exact: true })).toBeVisible();
    expect(page.getByText('1 min', { exact: true })).toBeVisible();
    expect(page.getByText('7 Oct 2026, 23:59 UTC')).toBeVisible();
  });

  it('does not invent an outage start time when only the public feed is available', async () => {
    await render(<IncidentHistory incidents={[]} latestOnly t={en.board} />);
    await userEvent.click(page.getByText('Recent history · 1 update', { exact: true }));

    expect(page.getByText(en.board.maintenance.description)).toBeVisible();
    expect(page.getByText(en.board.latestOnly)).toBeVisible();
    expect(page.getByText(en.board.started, { exact: true })).not.toBeInTheDocument();
    expect(page.getByText('8 Oct 2026', { exact: true })).toBeVisible();
  });
});

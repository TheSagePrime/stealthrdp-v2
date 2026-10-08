import type { Incident, Service, UptimeReport } from '@/lib/stealth/uptime';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import en from '@/content/i18n/en/status';
import { IncidentHistory, StatusBoard } from './StatusBoard';

vi.mock('@/lib/stealth/uptime', () => ({ groupOrder: ['USA servers', 'Europe servers', 'Platform'] }));

const current: Incident = {
  serviceId: '795874880',
  service: 'EU 4 NL Server',
  startedAt: '2026-10-08T02:25:06.000Z',
  durationSeconds: 3600,
  ongoing: true,
  reason: 'timeout',
};
const resolved: Incident = {
  serviceId: '2',
  service: 'USA Example',
  startedAt: '2026-10-07T12:00:00.000Z',
  durationSeconds: 60,
  ongoing: false,
  reason: 'connection',
};

const service: Service = {
  id: '795874880',
  name: 'EU 4 NL Server',
  group: 'Europe servers',
  state: 'down',
  uptime24: 75,
  uptime7: 96,
  uptime365: 99.9,
  responseSamples: [],
  uptime30: 99,
  uptime90: 99.7,
  days: [
    { date: '2026-10-07', ratio: 100, downSeconds: null },
    { date: '2026-10-08', ratio: 75, downSeconds: null },
  ],
  responseMs: 82,
  monitorKind: 'network',
  checkIntervalSeconds: 60,
  lastResponseAt: '2026-10-07T23:59:00.000Z',
  lastIncident: current,
};

describe('public status information', () => {
  it('uses status blocks with measured downtime and maintenance context, without custom panels', async () => {
    const report: UptimeReport = {
      source: 'api',
      checkedAt: '2026-10-08T03:25:06.000Z',
      services: [service],
      incidents: [current],
    };
    await render(
      <StatusBoard report={report} t={en.board}>
        {null}
      </StatusBoard>,
    );

    const overview = page.getByRole('region', { name: en.board.overview });

    expect(overview.getByText(service.name)).not.toBeInTheDocument();
    expect(overview.getByText(en.board.totalServices)).toBeVisible();
    expect(Array.from(document.querySelector('[aria-label="Overview"]')?.querySelectorAll('dd') ?? [], item => item.textContent)).toEqual(['1', '0', '1', '0']);
    expect(page.getByText(en.board.maintenance.completion)).toBeVisible();
    expect(page.getByText(en.board.maintenance.timing)).not.toBeInTheDocument();
    expect(page.getByText('Down', { exact: true })).toBeVisible();
    expect(page.getByText('99.700%', { exact: true })).toBeVisible();
    expect(document.querySelector('summary')).toBeNull();
    expect(page.getByText(en.board.serviceDetails, { exact: true })).not.toBeInTheDocument();
    expect(page.getByRole('slider')).toHaveAttribute('aria-valuemax', '2');
    expect(page.getByRole('slider')).toHaveAttribute('aria-valuetext', '8 Oct 2026, Maintenance, 75.00% uptime');

    const bars = document.querySelector('[role="slider"]')?.querySelectorAll(':scope > span');

    expect(bars?.[0]?.className).toContain('bg-[var(--uptime-up)]');
    expect(bars?.[1]?.className).toContain('bg-primary');
  });

  it('shows recovery and maintenance timelines using only recorded facts', async () => {
    await render(<IncidentHistory incidents={[{ ...current, ongoing: false }, resolved]} latestOnly={false} t={en.board} />);

    expect(page.getByText(en.board.resolved, { exact: true }).first()).toBeVisible();
    expect(page.getByText(en.board.reasons.connection)).toBeVisible();
    expect(page.getByText(en.board.maintenance.completion)).toBeVisible();
    expect(page.getByText(en.board.maintenance.timing)).not.toBeInTheDocument();
    expect(page.getByText('Subscribe to updates')).not.toBeInTheDocument();
    expect(document.querySelectorAll('[data-slot="card"]')).toHaveLength(2);
    expect(page.getByText('Downtime: 1 h')).toBeVisible();
  });

  it('keeps missing rolling uptime distinct from a measured zero', async () => {
    const report: UptimeReport = {
      source: 'public',
      checkedAt: '2026-10-08T03:25:06.000Z',
      services: [
        { ...service, uptime90: null, days: [] },
        { ...service, id: '2', name: 'Zero example', uptime90: 0 },
      ],
      incidents: [],
    };
    await render(
      <StatusBoard report={report} t={en.board}>
        {null}
      </StatusBoard>,
    );

    expect(page.getByText('—', { exact: true })).toBeVisible();
    expect(page.getByText('0.000%', { exact: true })).toBeVisible();
    expect(page.getByText(en.board.latestOnly)).toBeVisible();

    const otherServiceBars = document.querySelector('[role="slider"]')?.querySelectorAll(':scope > span');

    expect(otherServiceBars?.[1]?.className).toContain('bg-[var(--uptime-down)]');
  });
});

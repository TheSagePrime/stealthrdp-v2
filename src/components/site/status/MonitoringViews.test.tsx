import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { UptimeBar } from '@/components/dashboardblocks/status';
import { MeasurementTime, StatusLive } from './StatusLive';

const { refresh, router } = vi.hoisted(() => {
  const refresh = vi.fn();
  return { refresh, router: { refresh } };
});
vi.mock('next/navigation', () => ({ default: { useRouter: () => router }, useRouter: () => router }));

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

it('refreshes each minute without resetting the actual measurement age', async () => {
  vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
  vi.setSystemTime(new Date('2026-10-08T12:00:00Z'));
  await render(
    <StatusLive>
      <MeasurementTime at="2026-10-08T11:59:30.000Z" locale="en" updated />
    </StatusLive>,
  );

  await vi.advanceTimersByTimeAsync(1000);

  await expect.element(page.getByText('31 s ago', { exact: true })).toBeVisible();

  await vi.advanceTimersByTimeAsync(59_000);

  expect(refresh).toHaveBeenCalledTimes(1);
  await expect.element(page.getByText('90 s ago', { exact: true })).toBeVisible();
});

describe('DashboardBlocks uptime interaction', () => {
  it('supports keyboard inspection and distinguishes missing days from outages', async () => {
    await render(
      <UptimeBar
        label="Example"
        days={[
          { label: '30 Sep 2026', status: 'operational', uptime: 100 },
          { label: '1 Oct 2026', status: 'unknown' },
          { label: '2 Oct 2026', status: 'major', uptime: 0 },
        ]}
      />,
    );
    const slider = page.getByRole('slider');
    document.querySelector<HTMLElement>('[role="slider"]')?.focus();
    await userEvent.keyboard('{End}');

    expect(slider).toHaveAttribute('aria-valuetext', '2 Oct 2026, Major outage, 0.00% uptime');

    await userEvent.keyboard('{ArrowLeft}');

    expect(slider).toHaveAttribute('aria-valuetext', '1 Oct 2026, No data');

    await userEvent.keyboard('{Home}');

    expect(slider).toHaveAttribute('aria-valuetext', '30 Sep 2026, Operational, 100% uptime');
  });

  it('does not render an invalid slider for missing history', async () => {
    await render(<UptimeBar label="Example" days={[]} />);

    expect(document.querySelector('[role="slider"]')).toBeNull();
  });
});

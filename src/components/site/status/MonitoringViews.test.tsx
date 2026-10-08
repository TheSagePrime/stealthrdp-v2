import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import en from '@/content/i18n/en/status';
import { ResponseChart } from './ResponseChart';
import { MeasurementTime, StatusLive } from './StatusLive';
import { UptimeHistory } from './UptimeHistory';

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
  await render(<StatusLive><MeasurementTime at="2026-10-08T11:59:30.000Z" locale="en" updated /></StatusLive>);

  await vi.advanceTimersByTimeAsync(1000);

  await expect.element(page.getByText('31 s ago', { exact: true })).toBeVisible();

  await vi.advanceTimersByTimeAsync(59_000);

  expect(refresh).toHaveBeenCalledTimes(1);
  await expect.element(page.getByText('90 s ago', { exact: true })).toBeVisible();
});

describe('monitor history views', () => {
  it('provides day tooltips and a keyboard-selectable calendar with missing and zero data distinct', async () => {
    await render(
      <UptimeHistory
        name="Example"
        locale="en"
        days={[
          { date: '2026-09-30', ratio: 100, downSeconds: null },
          { date: '2026-10-01', ratio: null, downSeconds: null },
          { date: '2026-10-02', ratio: 0, downSeconds: null },
        ]}
      />,
    );

    await userEvent.click(page.getByRole('tabpanel', { name: 'Daily bars' }).getByRole('button', { name: '30 Sep 2026: 100.000%', exact: true }));

    expect(page.getByRole('tooltip')).toHaveTextContent('30 Sep 2026: 100.000%');

    await userEvent.click(page.getByRole('tab', { name: 'Daily bars' }));
    await userEvent.keyboard('{ArrowRight}');

    expect(page.getByRole('tab', { name: 'Calendar' })).toHaveAttribute('aria-selected', 'true');

    await userEvent.click(page.getByRole('tabpanel', { name: 'Calendar' }).getByRole('button', { name: '2 Oct 2026: 0.000%', exact: true }));

    expect(page.getByRole('status', { name: 'Selected day' })).toHaveTextContent('2 Oct 2026: 0.000%');
    expect(page.getByRole('tabpanel', { name: 'Calendar' }).getByRole('button', { name: '1 Oct 2026: no records', exact: true })).toHaveAttribute('data-level', 'none');
  });

  it('breaks the graph at failed and absent measurements and supports keyboard inspection', async () => {
    await render(
      <ResponseChart
        service="Example"
        locale="en"
        samples={[
          { at: '2026-10-08T10:00:00.000Z', ms: 80 },
          { at: '2026-10-08T10:05:00.000Z', ms: 90 },
          { at: '2026-10-08T10:10:00.000Z', ms: null },
          { at: '2026-10-08T10:15:00.000Z', ms: 85 },
          { at: '2026-10-08T11:00:00.000Z', ms: 100 },
        ]}
      />,
    );

    expect(document.querySelectorAll('svg path')[1]?.getAttribute('d')?.match(/M/g)).toHaveLength(3);

    await userEvent.click(page.getByRole('button', { name: `${en.board.responseInspect}: ←`, exact: true }));

    expect(document.querySelector('output')?.textContent).toContain('10:15 UTC · 85 ms');

    await userEvent.keyboard('{Enter}');

    expect(document.querySelector('output')?.textContent).toContain(en.board.responseMissing);
    expect(page.getByText('89 ms', { exact: true })).toBeVisible();
  });

  it('shows unavailability instead of drawing a graph without measured responses', async () => {
    await render(<ResponseChart service="Example" locale="en" samples={[]} />);

    expect(page.getByText(en.board.responseEmpty)).toBeVisible();
    expect(document.querySelector('svg')).toBeNull();
  });
});

import { plans, uptime } from '@/lib/stealth/content';

/**
 * Real figures for the home page ledger.
 * Every value on the page comes from src/content/*.json or existing approved copy.
 * Nothing here is a constant: delete the content files and the page loses its numbers.
 */

export type UptimeMonitor = {
  label: string;
  region: string;
  status: string;
  uptimeRatio: number;
};

const source = uptime as { monitors?: UptimeMonitor[] };

export const monitors: UptimeMonitor[] = source.monitors ?? [];

export const monitorTotal = monitors.length;

export const reportingTotal = monitors.filter(monitor => monitor.status === 'up').length;

export const allReporting = monitorTotal > 0 && reportingTotal === monitorTotal;

export const lowestMonitor: UptimeMonitor | undefined = monitors.length
  ? monitors.reduce((lowest, monitor) =>
      monitor.uptimeRatio < lowest.uptimeRatio ? monitor : lowest,
    )
  : undefined;

export function ratioText(value: number): string {
  return value.toFixed(3);
}

export function regionTally(): { region: string; count: number }[] {
  const tally = new Map<string, number>();
  for (const monitor of monitors) {
    tally.set(monitor.region, (tally.get(monitor.region) ?? 0) + 1);
  }
  return [...tally.entries()].map(([region, count]) => ({ region, count }));
}

export function regionCount(match: string): number {
  return monitors.filter(monitor => monitor.region.toUpperCase().includes(match)).length;
}

export const planGroups = (['USA', 'EU'] as const).map(location => ({
  location,
  rows: plans.filter(plan => plan.location === location),
}));

export const planTotal = plans.length;

export function priceText(amount: number): string {
  return amount.toFixed(2);
}

export const lowestMonthly = plans.length
  ? plans.reduce((lowest, plan) => Math.min(lowest, plan.pricing.monthly.amount), Infinity)
  : 0;

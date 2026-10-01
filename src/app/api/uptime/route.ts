import { z } from 'zod';

export const dynamic = 'force-dynamic';

const PUBLIC_STATUS_URL = 'https://stats.uptimerobot.com/api/getMonitorList/yvnV3u7x00?page=1';

const ratioSchema = z.union([
  z.number(),
  z.string(),
  z.object({ ratio: z.union([z.number(), z.string()]) }),
]);

const monitorSchema = z.object({
  name: z.string().optional(),
  statusClass: z.string().optional(),
  '90dRatio': ratioSchema.optional(),
});

const responseSchema = z.object({
  status: z.literal('ok'),
  psp: z.object({
    monitors: z.array(monitorSchema),
  }),
});

type PublicMonitor = {
  label: string;
  region: string;
  status: 'up' | 'degraded' | 'down' | 'paused' | 'unknown';
  uptimeRatio: number | null;
};

let cached: { expiresAt: number; payload: { stat: 'ok'; checkedAt: string; monitors: PublicMonitor[] } } | undefined;
let inFlight: Promise<{ stat: 'ok'; checkedAt: string; monitors: PublicMonitor[] }> | undefined;

function ratio(value: z.infer<typeof ratioSchema> | undefined): number | null {
  if (value === undefined) return null;
  const raw = typeof value === 'object' ? value.ratio : value;
  const number = Number(raw);
  return Number.isFinite(number) && number >= 0 && number <= 100 ? number : null;
}

function regionFor(name = ''): string {
  const value = name.toLowerCase();
  if (value.includes('eu') || value.includes('nl')) return 'EU / Netherlands';
  if (value.includes('management') || value.includes('portal')) return 'Control Panel';
  if (value.includes('website') || value.includes('backend')) return 'Website';
  if (value.includes('usa') || value.includes(' us')) return 'USA';
  return 'Production';
}

function statusFor(value = ''): PublicMonitor['status'] {
  const normalized = value.toLowerCase();
  if (normalized === 'success' || normalized === 'up') return 'up';
  if (normalized === 'warning' || normalized === 'degraded' || normalized === 'looks_down') return 'degraded';
  if (normalized === 'danger' || normalized === 'down') return 'down';
  if (normalized === 'black' || normalized === 'paused') return 'paused';
  return 'unknown';
}

async function fetchStatus() {
  const response = await fetch(PUBLIC_STATUS_URL, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'StealthRDP-Status/2.0',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) throw new Error('Public status source unavailable');

  const parsed = responseSchema.parse(await response.json());
  const counters = new Map<string, number>();
  const monitors = parsed.psp.monitors.map((monitor) => {
    const region = regionFor(monitor.name);
    const index = (counters.get(region) ?? 0) + 1;
    counters.set(region, index);
    return {
      label: `${region} Node ${String(index).padStart(2, '0')}`,
      region,
      status: statusFor(monitor.statusClass),
      uptimeRatio: ratio(monitor['90dRatio']),
    } satisfies PublicMonitor;
  });

  if (!monitors.length) throw new Error('Public status source returned no monitors');

  return {
    stat: 'ok' as const,
    checkedAt: new Date().toISOString(),
    monitors,
  };
}

async function getStatus() {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.payload;
  if (inFlight) return inFlight;

  inFlight = fetchStatus()
    .then((payload) => {
      cached = { expiresAt: Date.now() + 60_000, payload };
      return payload;
    })
    .finally(() => {
      inFlight = undefined;
    });

  return inFlight;
}

export async function GET() {
  try {
    return Response.json(await getStatus(), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json(
      { stat: 'error', checkedAt: null, monitors: [] },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

import { sql } from 'drizzle-orm';

export type ReadinessResponse = {
  status: 'ready' | 'not_ready';
  checks: {
    database: 'ready' | 'unavailable';
  };
};

const defaultProbe = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  const { db } = await import('@/libs/DB');
  return db.execute(sql`select 1`);
};
let cached: { response: ReadinessResponse; expiresAt: number } | undefined;
let inFlight: Promise<ReadinessResponse> | undefined;

async function executeProbe(probe: () => Promise<unknown>): Promise<ReadinessResponse> {
  try {
    await Promise.race([
      probe(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('readiness timeout')), 2_000)),
    ]);

    return {
      status: 'ready',
      checks: { database: 'ready' },
    };
  } catch {
    return {
      status: 'not_ready',
      checks: { database: 'unavailable' },
    };
  }
}

export async function getReadinessResponse(probe: () => Promise<unknown> = defaultProbe): Promise<ReadinessResponse> {
  const now = Date.now();

  if (probe !== defaultProbe) {
    return executeProbe(probe);
  }

  if (cached && cached.expiresAt > now) {
    return cached.response;
  }

  if (inFlight) {
    return inFlight;
  }

  inFlight = executeProbe(defaultProbe)
    .then((response) => {
      cached = { response, expiresAt: Date.now() + 5_000 };
      return response;
    })
    .finally(() => {
      inFlight = undefined;
    });

  return inFlight;
}

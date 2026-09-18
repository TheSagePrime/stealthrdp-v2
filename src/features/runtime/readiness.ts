import { sql } from 'drizzle-orm';
import { db } from '@/libs/DB';

export type ReadinessResponse = {
  status: 'ready' | 'not_ready';
  checks: {
    database: 'ready' | 'unavailable';
  };
};

const defaultProbe = () => db.execute(sql`select 1`);
let cached: { response: ReadinessResponse; expiresAt: number } | undefined;

export async function getReadinessResponse(
  probe: () => Promise<unknown> = defaultProbe,
): Promise<ReadinessResponse> {
  const now = Date.now();
  if (probe === defaultProbe && cached && cached.expiresAt > now) {
    return cached.response;
  }

  let response: ReadinessResponse;

  try {
    await Promise.race([
      probe(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('readiness timeout')), 2_000)),
    ]);

    response = {
      status: 'ready',
      checks: { database: 'ready' },
    };
  } catch {
    response = {
      status: 'not_ready',
      checks: { database: 'unavailable' },
    };
  }

  if (probe === defaultProbe) {
    cached = { response, expiresAt: now + 5_000 };
  }

  return response;
}

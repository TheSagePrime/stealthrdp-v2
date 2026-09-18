import { sql } from 'drizzle-orm';
import { db } from '@/libs/DB';

export type ReadinessResponse = {
  status: 'ready' | 'not_ready';
  checks: {
    database: 'ready' | 'unavailable';
  };
};

export async function getReadinessResponse(
  probe: () => Promise<unknown> = () => db.execute(sql`select 1`),
): Promise<ReadinessResponse> {
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

import { describe, expect, it } from 'vitest';
import { GET as health } from '@/app/api/health/route';
import { getHealthResponse } from './health';
import { getReadinessResponse } from './readiness';

describe('runtime endpoints', () => {
  it('returns a stable health response', () => {
    expect(getHealthResponse()).toEqual({
      status: 'ok',
      service: 'web-starter',
    });
  });

  it('serves the health endpoint', async () => {
    const response = health();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(getHealthResponse());
  });

  it('reports ready only when the database probe succeeds', async () => {
    await expect(getReadinessResponse(async () => ({ ok: true }))).resolves.toEqual({
      status: 'ready',
      checks: { database: 'ready' },
    });

    await expect(
      getReadinessResponse(async () => {
        throw new Error('database unavailable');
      }),
    ).resolves.toEqual({
      status: 'not_ready',
      checks: { database: 'unavailable' },
    });
  });
});

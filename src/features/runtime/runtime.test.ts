import { describe, expect, it } from 'vitest';
import { GET as health } from '@/app/api/health/route';
import { GET as ready } from '@/app/api/ready/route';
import { getHealthResponse } from './health';
import { getReadinessResponse } from './readiness';

describe('runtime endpoints', () => {
  it('returns a stable health response', () => {
    expect(getHealthResponse()).toEqual({
      status: 'ok',
      service: 'sage-prime-starter',
    });
  });

  it('serves the health endpoint', async () => {
    const response = health();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(getHealthResponse());
  });

  it('reports readiness without exposing database details', () => {
    expect(getReadinessResponse({})).toEqual({
      status: 'not_ready',
      checks: { database: 'missing' },
    });
    expect(getReadinessResponse({ DATABASE_URL: 'postgres://configured' })).toEqual({
      status: 'ready',
      checks: { database: 'configured' },
    });
  });

  it('serves a not-ready response when the database is not configured', async () => {
    const original = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;

    try {
      const response = ready();

      expect(response.status).toBe(503);
      await expect(response.json()).resolves.toEqual(getReadinessResponse({}));
    } finally {
      if (original === undefined) {
        delete process.env.DATABASE_URL;
      } else {
        process.env.DATABASE_URL = original;
      }
    }
  });
});
